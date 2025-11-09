import pandas as pd
import numpy as np
import requests
from google.cloud import secretmanager, storage
import json
import logging
from datetime import datetime
import tempfile
import os
import functions_framework
import shutil
import pytz # เพิ่มเข้ามา

# --- การตั้งค่า Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

# --- กำหนด Timezone ประเทศไทย ---
THAI_TZ = pytz.timezone('Asia/Bangkok')

# --- Global variables for Caching (แยกตามโมเดล) ---
_models_cache = {}  # Cache สำหรับ { 'NawangVer2': model, 'MengraiVer2': model }
_scalers_cache = {} # Cache สำหรับ { 'NawangVer2': (scaler_x, scaler_y), ... }


def get_secret(secret_name, project_id):
    """
    ดึงข้อมูลจาก Secret Manager
    """
    try:
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logger.error(f"Error accessing secret {secret_name}: {e}")
        raise


def download_and_load_model(bucket_name, project_id, model_folder):
    """
    ดาวน์โหลดและโหลดโมเดล (พร้อม caching และ compile=False)
    แยกการดาวน์โหลด scaler_X และ scaler_Y
    """
    global _models_cache, _scalers_cache

    # 1. ตรวจสอบ Cache ก่อน
    if model_folder in _models_cache and model_folder in _scalers_cache:
        logger.info(f"[{model_folder}] Using cached model and scalers")
        return _models_cache[model_folder], _scalers_cache[model_folder]

    try:
        # Import ตอนที่จะใช้จริง เพื่อลด startup time
        from tensorflow.keras.models import load_model
        import joblib

        logger.info(f"[{model_folder}] Downloading model files from Cloud Storage...")

        client = storage.Client(project=project_id)
        bucket = client.bucket(bucket_name)

        temp_dir = tempfile.mkdtemp()

        # 2. กำหนดชื่อไฟล์ตามโฟลเดอร์
        if model_folder == "NawangVer2":
            model_file_name = "Model_upstream.h5"
        elif model_folder == "MengraiVer2":
            model_file_name = "Model_downstream.h5"
        else:
            raise Exception(f"Unknown model_folder: {model_folder}")

        # 3. ดาวน์โหลด model (ตามชื่อที่กำหนด)
        model_blob = bucket.blob(f'{model_folder}/{model_file_name}')
        model_path = os.path.join(temp_dir, model_file_name)
        model_blob.download_to_filename(model_path)
        logger.info(f"[{model_folder}] Downloaded {model_file_name}")

        # 4. ดาวน์โหลด scaler_X.pkl
        scaler_x_blob = bucket.blob(f'{model_folder}/scaler_X.pkl')
        scaler_x_path = os.path.join(temp_dir, 'scaler_X.pkl')
        scaler_x_blob.download_to_filename(scaler_x_path)
        logger.info(f"[{model_folder}] Downloaded scaler_X.pkl")

        # 5. ดาวน์โหลด scaler_Y.pkl
        scaler_y_blob = bucket.blob(f'{model_folder}/scaler_Y.pkl')
        scaler_y_path = os.path.join(temp_dir, 'scaler_Y.pkl')
        scaler_y_blob.download_to_filename(scaler_y_path)
        logger.info(f"[{model_folder}] Downloaded scaler_Y.pkl")

        # --- โหลดเข้า Memory ---
        logger.info(f"[{model_folder}] Loading model with compile=False...")
        model = load_model(model_path, compile=False)

        logger.info(f"[{model_folder}] Loading scalers...")
        scaler_x = joblib.load(scaler_x_path)
        scaler_y = joblib.load(scaler_y_path)

        # ลบไฟล์ temporary
        shutil.rmtree(temp_dir)

        # 7. เก็บเข้า Cache
        _models_cache[model_folder] = model
        _scalers_cache[model_folder] = (scaler_x, scaler_y)

        logger.info(f"[{model_folder}] Models and scalers loaded successfully")
        return model, (scaler_x, scaler_y)

    except Exception as e:
        logger.error(f"[{model_folder}] Error downloading/loading model files: {e}")
        raise


def get_water_data_from_api(api_endpoint, api_key, action_name, limit=20):
    """
    ดึงข้อมูลจาก API (Nawang หรือ Mangrai)
    """
    try:
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': api_key
        }

        payload = {
            'action': action_name, # เช่น 'get_water_AI_Nawang'
            'limit': limit
        }

        logger.info(f"Requesting {limit} records from {action_name}...")

        response = requests.post(
            api_endpoint,
            json=payload,
            headers=headers,
            timeout=30
        )
        response.raise_for_status() # ถ้า Error (เช่น 500, 404) จะพังตรงนี้

        result = response.json()
        if not result.get('success'):
            raise Exception(f"API Error ({action_name}): {result.get('error')}")

        if not result.get('data') or len(result.get('data', [])) == 0:
            raise Exception(f"No data returned from API for {action_name}")

        # แปลงข้อมูลเป็น DataFrame
        df = pd.DataFrame(result['data'])

        # แปลง data types
        df['datetime'] = pd.to_datetime(df['datetime'])

        # ลบข้อมูลที่ไม่ถูกต้อง (dropna เฉพาะ datetime)
        df = df.dropna(subset=['datetime'])

        if len(df) == 0:
            raise Exception(f"No valid data (with datetime) after cleaning for {action_name}")

        # เรียงข้อมูล (PHP ส่งมาเรียงแล้ว แต่กันเหนียว)
        df = df.sort_values('datetime').reset_index(drop=True)

        logger.info(f"Retrieved {len(df)} valid records for {action_name}")
        return df

    except Exception as e:
        logger.error(f"Error retrieving data from API ({action_name}): {e}")
        raise


def prepare_prediction_data(df, feature_columns, input_timesteps):
    """
    เตรียมข้อมูลสำหรับการทำนาย (Resample, Interpolate, Tail)
    """
    try:
        # 1. ตั้งค่า datetime เป็น index
        df = df.set_index('datetime')

        # 2. เลือกเฉพาะคอลัมน์ที่โมเดลต้องการ (ตามลำดับที่ถูกต้อง)
        df_features = df[feature_columns]

        # 3. แปลงทุกอย่างเป็นตัวเลข (เผื่อมี string ปนมา)
        df_features = df_features.apply(pd.to_numeric, errors='coerce')

        # 4. Resample: 1. จัดกลุ่มเป็นรายชั่วโมง (.mean()) 2. อุดรูโหว่ (.interpolate())
        # ใช้ 'h' (ตัวเล็ก) ตาม FutureWarning
        df_resampled = df_features.resample("h").mean().interpolate(method="linear")

        # 5. dropna() (interpolate อาจทิ้ง nan ไว้ที่ "ขอบ" ถ้าข้อมูลเริ่มต้นไม่พอ)
        df_resampled = df_resampled.dropna()

        if len(df_resampled) < input_timesteps:
            raise Exception(f"Need {input_timesteps} timesteps, but got only {len(df_resampled)} after resample/dropna. Check source data for gaps.")

        # 6. ใช้ข้อมูล N "ชั่วโมง" ล่าสุดสำหรับการทำนาย
        recent_data_df = df_resampled.tail(input_timesteps)

        # 7. ตรวจสอบ NaN อีกครั้ง (สำคัญมาก)
        if recent_data_df.isnull().values.any():
            logger.error(f"Data contains NaN after processing: \n{recent_data_df}")
            raise Exception("Data contains NaN after resample/tail. Cannot proceed.")

        logger.info(f"Data resampled. Using last {input_timesteps} hourly records.")
        return recent_data_df.values

    except Exception as e:
        logger.error(f"Error preparing prediction data: {e}")
        raise


def make_prediction(model, scaler_x, scaler_y, input_data):
    """
    ทำการพยากรณ์
    """
    try:
        logger.info("Making prediction...")

        # 1. Scaling Input (ใช้ scaler_X)
        input_data_scaled = scaler_x.transform(input_data)

        # 2. ตรวจสอบ NaN หลัง Scale (กันหารด้วย 0)
        if np.isnan(input_data_scaled).any():
            logger.error(f"Input data contains NaN *after* scaling. Check for zero variance (constant values) in input data.")
            logger.error(f"Original Data:\n{input_data}")
            raise Exception("Input data contains NaN after scaling due to zero variance.")

        # 3. Reshape เพื่อใส่ LSTM: (1, timesteps, features)
        input_data_scaled_3d = input_data_scaled.reshape(1, input_data.shape[0], input_data.shape[1])
        logger.info(f"Input shape to model: {input_data_scaled_3d.shape}") # ลด DEBUG ลง

        # 4. ทำนาย (ผลลัพธ์เป็น 3D: [1, 3, num_output_features])
        y_pred_scaled_3d = model.predict(input_data_scaled_3d)
        logger.info(f"Raw model output shape: {y_pred_scaled_3d.shape}") # ลด DEBUG ลง

        # 5. Reshape ผลลัพธ์ 3D -> 2D เพื่อให้ scaler_y ทำงานได้
        num_output_features = y_pred_scaled_3d.shape[-1]
        y_pred_scaled_2d = y_pred_scaled_3d.reshape(-1, num_output_features)
        # logger.info(f"DEBUG - Reshaped output for scaler_y shape: {y_pred_scaled_2d.shape}")

        # 6. แปลงกลับเป็นค่าเดิม (ใช้ scaler_Y) -> ผลลัพธ์เป็น 2D: [ 1, 3 ]
        y_pred_inverse_2d = scaler_y.inverse_transform(y_pred_scaled_2d)
        logger.info(f"Inverse transformed output shape: {y_pred_inverse_2d.shape}") # ลด DEBUG ลง
        logger.info(f"Inverse transformed output VALUES:\n{y_pred_inverse_2d}") # ยังคง Log ค่านี้ไว้

        # --- (v11) แก้ไขวิธีดึงค่า ---
        # 7. ดึงค่า T+1, T+2, T+3 ออกมาโดยการ flatten array (จาก [[T1, T2, T3]] -> [T1, T2, T3])
        predictions_to_send = y_pred_inverse_2d.flatten()
        # ---------------------------
        logger.info(f"Final predictions_to_send shape: {predictions_to_send.shape}") # ลด DEBUG ลง
        logger.info(f"Final predictions_to_send VALUES: {predictions_to_send}") # ยังคง Log ค่านี้ไว้

        # 8. ตรวจสอบความยาว (ควรจะได้ 3 ค่า)
        if len(predictions_to_send) != 3:
             logger.warning(f"Expected 3 predictions, but got {len(predictions_to_send)} after flatten. Model output might be incorrect.")
             # ถ้าได้ไม่ครบ 3 อาจจะ raise Error หรือส่งไปเท่าที่ได้
             raise Exception(f"Expected 3 predictions but got {len(predictions_to_send)} after flatten.")

        logger.info(f"Predictions (water_level only) being sent: {predictions_to_send}")
        return predictions_to_send

    except Exception as e:
        logger.error(f"Error making prediction: {e}")
        raise


def send_predictions_to_php(predictions, php_endpoint, api_key, run_timestamp_th):
    """
    ส่งผลการพยากรณ์ไปยัง PHP (ใช้เวลาไทย)
    """
    try:
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': api_key
        }

        predictions_list = predictions.tolist()
        num_predictions = len(predictions_list)

        payload = {
            'predictions': predictions_list,
            'timestamp': run_timestamp_th.isoformat(), # ส่งเวลาไทยไป PHP
            'model_info': 'CloudRun LSTM Water Level Prediction',
            'prediction_hours': num_predictions
        }

        logger.info(f"Sending {num_predictions} predictions to PHP (Timestamp: {run_timestamp_th.isoformat()})...")

        response = requests.post(
            php_endpoint,
            json=payload,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()

        result = response.json()
        if result.get('success'):
            logger.info("Predictions sent successfully")
            return True, result
        else:
            logger.error(f"PHP error: {result.get('error')}")
            return False, result

    except Exception as e:
        logger.error(f"Error sending predictions: {e}")
        return False, {'error': str(e)}

# --- การตั้งค่าโมเดล (แยกตาม Task) ---
MODEL_CONFIGS = {
    "Nawang": {
        "model_folder": "NawangVer2",
        "api_action": "get_water_AI_Nawang",
        "api_endpoint_key": "get_data_Nawang_endpoint",
        "save_endpoint_key": "save_prediction_Nawang_endpoint",
        "features": ["water_level", "water_volume"], # 2 features
        "timesteps": 5
    },
    "Mengrai": {
        "model_folder": "MengraiVer2",
        "api_action": "get_water_AI_MangRai",
        "api_endpoint_key": "get_data_MangRai_endpoint",
        "save_endpoint_key": "save_prediction_MangRai_endpoint",
        "features": ["water_level", "water_volume", "cumulative_rainfall"], # 3 features
        "timesteps": 5
    }
}

@functions_framework.http
def water_prediction_main(request):
    """
    Main function สำหรับ Cloud Function / Cloud Run
    """
    # --- (v9) ใช้เวลาไทย ---
    utc_now = datetime.now(pytz.utc)
    start_time_th = utc_now.astimezone(THAI_TZ)
    logger.info(f"--- Prediction Process Started at {start_time_th.strftime('%Y-%m-%d %H:%M:%S %Z%z')} ---")
    # --------------------

    # เก็บผลลัพธ์ของแต่ละ Task
    results = {
        "Nawang": "Not Run",
        "Mengrai": "Not Run"
    }

    try:
        # --- 1. ดึงการตั้งค่า (ทำครั้งเดียว) ---
        logger.info("Step 1: Loading configuration...")
        PROJECT_ID = "smartfloodproj"

        storage_config_json = get_secret("storage-config", PROJECT_ID)
        storage_config = json.loads(storage_config_json)
        BUCKET_NAME = storage_config["bucket_name"]

        endpoints_json = get_secret("php-endpoints", PROJECT_ID)
        endpoints = json.loads(endpoints_json)

        API_KEY = get_secret("water-api-key", PROJECT_ID)

        # --- 2. วนลูปทำงานแต่ละ Task (Nawang, Mengrai) ---
        for task_name, config in MODEL_CONFIGS.items():
            task_start_time_th = datetime.now(THAI_TZ) # เวลาไทยสำหรับ Task นี้
            logger.info(f"--- Starting {task_name} Prediction (Task at {task_start_time_th.strftime('%H:%M:%S')}) ---")

            try:
                # 2.1 โหลดโมเดลและ Scalers
                model_folder = storage_config[f"model_folder_{task_name}"]
                model, (scaler_x, scaler_y) = download_and_load_model(
                    BUCKET_NAME, PROJECT_ID, model_folder
                )

                # 2.2 ดึงข้อมูล
                api_endpoint = endpoints[config["api_endpoint_key"]]
                df = get_water_data_from_api(
                    api_endpoint, API_KEY, config["api_action"], limit=20
                )

                # 2.3 เตรียมข้อมูล
                input_data = prepare_prediction_data(
                    df, config["features"], config["timesteps"]
                )

                # 2.4 ทำนาย
                predictions = make_prediction(
                    model, scaler_x, scaler_y, input_data
                )

                # 2.5 บันทึกผล (ส่ง start_time_th ไป PHP)
                save_endpoint = endpoints[config["save_endpoint_key"]]
                success, result = send_predictions_to_php(
                    predictions, save_endpoint, API_KEY, start_time_th # ใช้เวลาไทย
                )

                if success:
                    results[task_name] = "Success"
                    logger.info(f"--- {task_name} Prediction SUCCESSFUL ---")
                else:
                    raise Exception(f"Failed to save: {result.get('error')}")

            except Exception as e:
                # ถ้า Task ใด Task หนึ่งล้มเหลว ให้ log error ไว้ แล้วไปทำ Task ต่อไป
                logger.error(f"{task_name} Prediction FAILED: {e}")
                results[task_name] = f"Failed: {str(e)}"

        # --- 3. สรุปผล ---
        elapsed = (datetime.now(THAI_TZ) - start_time_th).total_seconds() # ใช้เวลาไทยในการคำนวณ

        has_failure = any("Failed" in v for v in results.values())
        has_success = "Success" in results.values()

        if has_failure and not has_success:
            # ถ้าล้มเหลวทั้งคู่
            logger.error(f"FATAL: All prediction tasks failed. Nawang: {results['Nawang']}, Mengrai: {results['Mengrai']}")
            return f"FATAL: All tasks failed. Nawang: {results['Nawang']}, Mengrai: {results['Mengrai']}", 500

        current_status = "Partial Success" if has_failure else "All Success"

        final_status = {
            "status": current_status,
            "execution_time_seconds": elapsed,
            "results": results,
            "start_time_th": start_time_th.isoformat() # เพิ่มเวลาเริ่ม (ไทย) ในผลลัพธ์
        }
        logger.info(f"Process completed with status: {current_status}")
        return final_status, 200

    except Exception as e:
        # --- Error ร้ายแรง (เช่น ดึง Secret ไม่ได้) ---
        elapsed = (datetime.now(THAI_TZ) - start_time_th).total_seconds() # ใช้เวลาไทย
        error_msg = f"CRITICAL ERROR: Failed to load secrets or critical component failed after {elapsed:.2f}s: {e}"
        logger.error(error_msg)
        return error_msg, 500

    finally:
        elapsed_final = (datetime.now(THAI_TZ) - start_time_th).total_seconds() # ใช้เวลาไทย
        logger.info(f"--- Process Completed in {elapsed_final:.2f} seconds (Thai Time) ---")

