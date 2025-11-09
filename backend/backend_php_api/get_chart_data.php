<?php

// ตั้งค่า Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// --- 1. การตั้งค่าสำหรับแต่ละสถานี (Configuration) ---
$station_configs = [
    'nawang' => [
        'historical_table' => 'current_water_data_Nawang',
        'predict_table' => 'predict_water_data_Nawang',
        'base_level_offset' => 435.89
    ],
    'mengrai' => [
        'historical_table' => 'current_water_data_MangRai',
        'predict_table' => 'predict_water_data_Mengrai',
        'base_level_offset' => 391.26
    ]
];

// --- 2. รับและตรวจสอบ Parameter จาก URL ---
$station_id = isset($_GET['station']) ? $_GET['station'] : '';

if (!array_key_exists($station_id, $station_configs)) {
    http_response_code(400);
    die(json_encode(["error" => "Invalid or missing station parameter. Use 'nawang' or 'mengrai'."]));
}

// --- 3. การเชื่อมต่อฐานข้อมูล ---
$host = "localhost";
$user = "db_ai";
$pass = "W1a5t7e4r@crms";
$dbname = "db_aiwater";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
$conn->set_charset("utf8");


$config = $station_configs[$station_id];
$base_level_offset = $config['base_level_offset'];

// --- รับและกำหนดค่า Duration ---
$duration_param = isset($_GET['duration']) ? $_GET['duration'] : '7h'; // Default เป็น 7 ชั่วโมง (ใกล้เคียงของเดิม)
$historical_interval = 'INTERVAL 4 HOUR'; // Default historical

switch ($duration_param) {
    case '12h':
        $historical_interval = 'INTERVAL 12 HOUR';
        break;
    case '1d':
        $historical_interval = 'INTERVAL 1 DAY';
        break;
    case '3d':
        $historical_interval = 'INTERVAL 3 DAY';
        break;
    case '7d':
        $historical_interval = 'INTERVAL 7 DAY';
        break;
    // case '7h': // Default
    // default:
    //     $historical_interval = 'INTERVAL 4 HOUR';
    //     break;
}


$forecast_future_interval = 'INTERVAL 3 HOUR';
$forecast_limit = 4; // ชั่วโมงปัจจุบัน + 3 ชม. ถัดไป


$all_data = [];

// --- ดึงข้อมูลย้อนหลัง (Historical Data) ---
$sql_historical = "
SELECT h1.datetime AS full_datetime,
       (h1.water_level - ?) AS value
FROM {$config['historical_table']} h1
INNER JOIN (
    SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') AS hour_slot,
           MAX(datetime) AS max_dt
    FROM {$config['historical_table']}
    WHERE datetime <= NOW() AND datetime >= NOW() - {$historical_interval} -- <-- ใช้ตัวแปร
    GROUP BY hour_slot
) h2
ON DATE_FORMAT(h1.datetime, '%Y-%m-%d %H') = h2.hour_slot
   AND h1.datetime = h2.max_dt
ORDER BY full_datetime ASC
";

$stmt_hist = $conn->prepare($sql_historical);
if (!$stmt_hist) {
    http_response_code(500);
    die(json_encode(["error" => "Prepare failed (Historical): " . $conn->error]));
}
$stmt_hist->bind_param("d", $base_level_offset);
$stmt_hist->execute();
$stmt_hist->bind_result($full_datetime, $value);
while ($stmt_hist->fetch()) {
    $all_data[] = [
        "timestamp" => strtotime($full_datetime),
        "datetime_str" => $full_datetime,
        "value" => $value
    ];
}
$stmt_hist->close();


// --- ดึงข้อมูลคาดการณ์ (Forecast Data) ---
$sql_forecast = "
SELECT t1.forecast_time AS full_forecast_time,
       (t1.forecast_value - ?) AS value
FROM {$config['predict_table']} t1
INNER JOIN (
    SELECT DATE_FORMAT(forecast_time, '%Y-%m-%d %H') AS hour_slot,
           MAX(created_at) AS max_created
    FROM {$config['predict_table']}
    WHERE forecast_time >= DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00')
      AND forecast_time <= NOW() + {$forecast_future_interval} -- <-- ใช้ตัวแปร
    GROUP BY hour_slot
) t2 ON DATE_FORMAT(t1.forecast_time, '%Y-%m-%d %H') = t2.hour_slot
     AND t1.created_at = t2.max_created
ORDER BY full_forecast_time ASC
LIMIT {$forecast_limit} -- <-- ใช้ตัวแปร
";

$stmt_fore = $conn->prepare($sql_forecast);
if (!$stmt_fore) {
    http_response_code(500);
    die(json_encode(["error" => "Prepare failed (Forecast): " . $conn->error]));
}
$stmt_fore->bind_param("d", $base_level_offset);
$stmt_fore->execute();
$stmt_fore->bind_result($full_forecast_time, $value);
while ($stmt_fore->fetch()) {
    $all_data[] = [
        "timestamp" => strtotime($full_forecast_time),
        "datetime_str" => $full_forecast_time,
        "value" => $value
    ];
}
$stmt_fore->close();


// --- เรียงข้อมูลทั้งหมดตาม Timestamp จริง ---
usort($all_data, function($a, $b) {
    return $a['timestamp'] - $b['timestamp'];
});

// --- จัดรูปแบบข้อมูลสุดท้ายก่อนส่งกลับ ---
$final_data = [];
$processed_timestamps = [];

// วนลูปจากท้ายมาหน้า
for ($i = count($all_data) - 1; $i >= 0; $i--) {
    $item = $all_data[$i];

    $hour_start_timestamp = strtotime(date('Y-m-d H:00:00', $item['timestamp']));

    // ถ้ายังไม่เคยเจอ timestamp ต้นชั่วโมงนี้
    if (!isset($processed_timestamps[$hour_start_timestamp])) {
        $final_data[] = [
            "timestamp" => $hour_start_timestamp * 1000, // *** ส่งเป็น Milliseconds ***
            "value" => $item['value']
        ];
        $processed_timestamps[$hour_start_timestamp] = true;
    }
}

// เรียงลำดับข้อมูลสุดท้ายกลับตามเวลา
$final_data = array_reverse($final_data);

echo json_encode($final_data, JSON_PRETTY_PRINT);
$conn->close();

?>