<?php
// get_water_AI_MangRai.php - ดึงข้อมูลจาก MangRai สำหรับ AI prediction
require_once 'config.php';

setCorsHeaders();
validateHttpMethod(['POST']);
validateApiKey();

try {
    // รับข้อมูล JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['action'])) {
        throw new Exception('Invalid request data');
    }
    
    // เชื่อมต่อฐานข้อมูล
    $pdo = DatabaseConfig::getConnection();
    
    if ($data['action'] === 'get_water_AI_MangRai') {
        // ดึงข้อมูล 20 ค่าล่าสุดจากตาราง current_water_data_MangRai
        $limit = isset($data['limit']) ? (int)$data['limit'] : 20;
        
        // --- ส่วนที่แก้ไข (v3) ---
        // เปลี่ยน CAST AS FLOAT เป็น CAST AS DECIMAL(P,S) ที่เข้ากันได้ดีกว่า
        $sql = "SELECT 
                    datetime, 
                    COALESCE(CAST(water_level AS DECIMAL(10,4)), 0.0) as water_level,
                    COALESCE(CAST(water_volume AS DECIMAL(15,4)), 0.0) as water_volume,
                    COALESCE(CAST(cumulative_rainfall AS DECIMAL(10,4)), 0.0) as cumulative_rainfall
                FROM current_water_data_MangRai
                ORDER BY datetime DESC 
                LIMIT :limit";
        // --- สิ้นสุดส่วนที่แก้ไข ---
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // เรียงข้อมูลจากเก่าไปใหม่ (สำคัญมากสำหรับ AI)
        $results = array_reverse($results);
        
        sendJsonResponse([
            'success' => true,
            'data' => $results,
            'count' => count($results),
            'message' => "Data retrieved successfully for AI prediction (3 features)",
            'table' => 'current_water_data_MangRai'
        ]);
        
    } else {
        throw new Exception('Unknown action: ' . $data['action']);
    }
    
} catch (Exception $e) {
    // ถ้าเกิด Error (เช่น SQL ผิด) จะส่ง JSON นี้กลับไป (พร้อม Status 500)
    error_log("Get water AI data error: " . $e->getMessage());
    sendJsonResponse([
        'success' => false,
        'error' => $e->getMessage() // ส่ง Error message จริงกลับไป
    ], 500);
}
?>
