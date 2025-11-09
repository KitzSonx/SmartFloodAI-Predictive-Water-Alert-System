import requests
import json
import logging
from datetime import datetime
from google.cloud import secretmanager
import functions_framework
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_secret(secret_name, project_id):
    """ดึงข้อมูลจาก Secret Manager พร้อม error handling ที่ดีขึ้น"""
    try:
        # สร้าง client
        client = secretmanager.SecretManagerServiceClient()
        
        # สร้าง resource name
        name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
        logger.info(f"Attempting to access secret: {name}")
        
        # พยายามเข้าถึง secret
        response = client.access_secret_version(request={"name": name})
        secret_value = response.payload.data.decode("UTF-8")
        
        logger.info(f"Successfully accessed secret: {secret_name}")
        return secret_value
        
    except Exception as e:
        logger.error(f"Error accessing secret {secret_name}: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        
        # ถ้าเป็น permission error ให้ข้อมูลเพิ่มเติม
        if "403" in str(e) or "Permission" in str(e):
            logger.error(f"Permission denied. Please check IAM permissions for secret: {secret_name}")
            logger.error(f"Service account might need 'roles/secretmanager.secretAccessor' role")
        
        # Fallback to environment variable if available
        env_var_name = secret_name.upper().replace('-', '_')
        env_value = os.environ.get(env_var_name)
        if env_value:
            logger.warning(f"Using environment variable {env_var_name} as fallback")
            return env_value
        
        raise

def send_data_to_php(data, php_endpoint, api_key):
    """ส่งข้อมูลไปยัง PHP script"""
    try:
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': api_key
        }
        
        logger.info(f"Sending data to: {php_endpoint}")
        response = requests.post(
            php_endpoint, 
            json=data, 
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        
        result = response.json()
        if result.get('success'):
            logger.info(f"Data sent successfully: {result.get('message')}")
            return True, result
        else:
            logger.error(f"PHP script error: {result.get('error')}")
            return False, result
            
    except requests.RequestException as e:
        logger.error(f"Error sending data to PHP: {e}")
        return False, {'error': str(e)}

@functions_framework.http
def fetch_data_and_save(request):
    try:
        # Configuration
        PROJECT_ID = os.environ.get('GCP_PROJECT', 'smartfloodproj')
        API_URL = "https://tele-kokkhong.dwr.go.th/webservice/webservice_kk_Json"
        
        logger.info(f"Starting function execution. Project ID: {PROJECT_ID}")
        
        # ดึงข้อมูล API Key จาก Secret Manager
        logger.info("Retrieving API key from Secret Manager...")
        try:
            API_KEY = get_secret("water-api-key", PROJECT_ID)
        except Exception as e:
            logger.error(f"Failed to get API key: {e}")
            # Try alternative secret names
            try:
                API_KEY = get_secret("api-config", PROJECT_ID)
                config = json.loads(API_KEY)
                API_KEY = config.get('water_api_key', config.get('api_key'))
            except:
                return f"Failed to retrieve API key: {str(e)}", 500
        
        # ดึงข้อมูล PHP endpoints จาก Secret Manager
        logger.info("Retrieving PHP endpoints from Secret Manager...")
        try:
            endpoints_json = get_secret("php-endpoints", PROJECT_ID)
            endpoints = json.loads(endpoints_json)
            PHP_ENDPOINT = endpoints.get('insert_endpoint', endpoints.get('endpoint'))
        except Exception as e:
            logger.error(f"Failed to get PHP endpoints: {e}")
            return f"Failed to retrieve PHP endpoints: {str(e)}", 500
        
        if not PHP_ENDPOINT:
            logger.error("PHP endpoint not found in configuration")
            return "PHP endpoint not configured", 500
        
        # ดึงข้อมูลจาก Webservice
        logger.info(f"Fetching data from webservice: {API_URL}")
        response = requests.get(API_URL, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        # ตรวจสอบว่าได้ข้อมูลมาหรือไม่
        if not data:
            logger.warning("No data received from webservice")
            return "No data received from webservice", 400
        
        logger.info(f"Received {len(data)} records from webservice")
        
        # ประมวลผลข้อมูลแยกตาม STN_ID
        nawang_records = []
        mangrai_records = []
        records_processed = 0
        
        # Station IDs
        NAWANG_STN_ID = "TC030113"  # สะพานมิตรภาพแม่นาวาง-ท่าตอน
        MANGRAI_STN_ID = "TC030114"  # สะพานพ่อขุนเม็งรายมหาราช
        
        for record in data:
            try:
                # ตรวจสอบ station จาก STN_ID
                station_id = record.get('STN_ID', '')
                
                if station_id == NAWANG_STN_ID:
                    processed_record = process_nawang_record(record)
                    if processed_record:
                        nawang_records.append(processed_record)
                        records_processed += 1
                        logger.debug(f"Processed Nawang record: {processed_record}")
                
                elif station_id == MANGRAI_STN_ID:
                    processed_record = process_mangrai_record(record)
                    if processed_record:
                        mangrai_records.append(processed_record)
                        records_processed += 1
                        logger.debug(f"Processed MangRai record: {processed_record}")
                
            except Exception as e:
                logger.error(f"Error processing record: {record}, Error: {e}")
                continue
        
        if not nawang_records and not mangrai_records:
            logger.warning("No valid records to process after data processing")
            logger.info(f"Available station IDs: {[r.get('STN_ID') for r in data[:5]]}")
            return "No valid records to process", 400
        
        logger.info(f"Successfully processed {records_processed} records")
        logger.info(f"Nawang records: {len(nawang_records)}, MangRai records: {len(mangrai_records)}")
        
        # ส่งข้อมูลไปยัง PHP script
        payload = {
            'nawang_records': nawang_records,
            'mangrai_records': mangrai_records,
            'source': 'webservice',
            'timestamp': datetime.now().isoformat(),
            'total_records': records_processed
        }
        
        logger.info(f"Sending {records_processed} records to PHP endpoint: {PHP_ENDPOINT}")
        success, result = send_data_to_php(payload, PHP_ENDPOINT, API_KEY)
        
        if success:
            logger.info(f"Data successfully saved to database. Records inserted: {result.get('records_inserted', 0)}")
            return f"Data fetched and saved successfully! Processed {records_processed} records.", 200
        else:
            logger.error(f"Failed to save data: {result.get('error', 'Unknown error')}")
            return f"Error saving data: {result.get('error', 'Unknown error')}", 500
        
    except Exception as e:
        logger.error(f"Unexpected error in fetch_data_and_save: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        return f"Unexpected error: {str(e)}", 500

def process_nawang_record(record):
    """ประมวลผลข้อมูลสำหรับ Nawang station"""
    try:
        datetime_str = record.get('LAST_UPDATE')
        water_level_str = record.get('CURR_Water_D_Level_MSL', '0')
        water_volume_str = record.get('CURR_FLOW', '0')
        
        if datetime_str:
            try:
                dt = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                formatted_datetime = dt.strftime('%Y-%m-%d %H:%M:%S')
            except:
                logger.warning(f"Cannot parse datetime: {datetime_str}, using current time")
                formatted_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        else:
            formatted_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        try:
            water_level = float(water_level_str) if water_level_str else 0.0
        except (ValueError, TypeError):
            water_level = 0.0
            
        try:
            water_volume = float(water_volume_str) if water_volume_str else 0.0
        except (ValueError, TypeError):
            water_volume = 0.0
        
        return {
            'datetime': formatted_datetime,
            'water_level': water_level,
            'water_volume': water_volume
        }
        
    except Exception as e:
        logger.error(f"Error processing Nawang record {record}: {e}")
        return None

def process_mangrai_record(record):
    """ประมวลผลข้อมูลสำหรับ MangRai station"""
    try:
        datetime_str = record.get('LAST_UPDATE')
        rainfall_str = record.get('CURR_Acc_Rain_15_M', '0')
        cumulative_rainfall_str = record.get('CURR_Acc_Rain_1_D', '0')
        water_level_str = record.get('CURR_Water_D_Level_MSL', '0')
        water_volume_str = record.get('CURR_FLOW', '0')
        
        if datetime_str:
            try:
                dt = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
                formatted_datetime = dt.strftime('%Y-%m-%d %H:%M:%S')
            except:
                logger.warning(f"Cannot parse datetime: {datetime_str}, using current time")
                formatted_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        else:
            formatted_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        try:
            rainfall = float(rainfall_str) if rainfall_str else 0.0
        except (ValueError, TypeError):
            rainfall = 0.0
            
        try:
            cumulative_rainfall = float(cumulative_rainfall_str) if cumulative_rainfall_str else 0.0
        except (ValueError, TypeError):
            cumulative_rainfall = 0.0
            
        try:
            water_level = float(water_level_str) if water_level_str else 0.0
        except (ValueError, TypeError):
            water_level = 0.0
            
        try:
            water_volume = float(water_volume_str) if water_volume_str else 0.0
        except (ValueError, TypeError):
            water_volume = 0.0
        
        return {
            'datetime': formatted_datetime,
            'rainfall': rainfall,
            'cumulative_rainfall': cumulative_rainfall,
            'water_level': water_level,
            'water_volume': water_volume
        }
        
    except Exception as e:
        logger.error(f"Error processing MangRai record {record}: {e}")
        return None