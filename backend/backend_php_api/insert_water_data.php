<?php
// insert_water_data.php - รองรับข้อมูลแยก station
require_once 'config.php';

setCorsHeaders();
validateHttpMethod(['POST']);
validateApiKey();

try {
    // รับข้อมูล JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }
    
    // เชื่อมต่อฐานข้อมูล
    $pdo = DatabaseConfig::getConnection();
    
    // เริ่ม transaction
    $pdo->beginTransaction();
    
    $total_records_inserted = 0;
    
    // บันทึกข้อมูล Nawang (เฉพาะ datetime, water_level, water_volume)
    if (isset($data['nawang_records']) && !empty($data['nawang_records'])) {
        $nawang_sql = "INSERT INTO current_water_data_Nawang (datetime, water_level, water_volume) 
                       VALUES (:datetime, :water_level, :water_volume)
                       ON DUPLICATE KEY UPDATE
                       water_level = VALUES(water_level),
                       water_volume = VALUES(water_volume)";
        
        $nawang_stmt = $pdo->prepare($nawang_sql);
        
        foreach ($data['nawang_records'] as $record) {
            // ตรวจสอบข้อมูลที่จำเป็น
            if (!isset($record['datetime'], $record['water_level'], $record['water_volume'])) {
                continue;
            }
            
            $nawang_stmt->execute([
                ':datetime' => $record['datetime'],
                ':water_level' => $record['water_level'],
                ':water_volume' => $record['water_volume']
            ]);
            
            $total_records_inserted++;
        }
    }
    
    // บันทึกข้อมูล MangRai (ครบทุก column)
    if (isset($data['mangrai_records']) && !empty($data['mangrai_records'])) {
        $mangrai_sql = "INSERT INTO current_water_data_MangRai (datetime, rainfall, cumulative_rainfall, water_level, water_volume) 
                        VALUES (:datetime, :rainfall, :cumulative_rainfall, :water_level, :water_volume)
                        ON DUPLICATE KEY UPDATE
                        rainfall = VALUES(rainfall),
                        cumulative_rainfall = VALUES(cumulative_rainfall),
                        water_level = VALUES(water_level),
                        water_volume = VALUES(water_volume)";
        
        $mangrai_stmt = $pdo->prepare($mangrai_sql);
        
        foreach ($data['mangrai_records'] as $record) {
            // ตรวจสอบข้อมูลที่จำเป็น
            if (!isset($record['datetime'], $record['rainfall'], $record['cumulative_rainfall'], 
                       $record['water_level'], $record['water_volume'])) {
                continue;
            }
            
            $mangrai_stmt->execute([
                ':datetime' => $record['datetime'],
                ':rainfall' => $record['rainfall'],
                ':cumulative_rainfall' => $record['cumulative_rainfall'],
                ':water_level' => $record['water_level'],
                ':water_volume' => $record['water_volume']
            ]);
            
            $total_records_inserted++;
        }
    }
    
    // Commit transaction
    $pdo->commit();
    
    sendJsonResponse([
        'success' => true,
        'message' => "Data inserted successfully",
        'records_inserted' => $total_records_inserted,
        'nawang_records' => isset($data['nawang_records']) ? count($data['nawang_records']) : 0,
        'mangrai_records' => isset($data['mangrai_records']) ? count($data['mangrai_records']) : 0,
        'tables' => ['current_water_data_Nawang', 'current_water_data_MangRai']
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($pdo)) {
        $pdo->rollback();
    }
    
    error_log("Insert data error: " . $e->getMessage());
    sendJsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 500);
}
?>