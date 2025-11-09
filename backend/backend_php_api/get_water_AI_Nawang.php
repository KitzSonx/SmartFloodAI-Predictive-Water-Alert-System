<?php
// get_water_AI_Nawang.php - ดึงข้อมูลจาก Nawang สำหรับ AI prediction
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
    
    if ($data['action'] === 'get_water_AI_Nawang') {
        // ดึงข้อมูล 20 ค่าล่าสุดจากตาราง current_water_data_Nawang
        $limit = isset($data['limit']) ? (int)$data['limit'] : 20;
        
        // --- ส่วนที่แก้ไข ---
        // เพิ่มคอลัมน์ water_volume เพื่อให้ครบ 2 features ตามที่โมเดลใหม่ต้องการ
        $sql = "SELECT 
                    datetime, 
                    COALESCE(CAST(water_level AS DECIMAL(10,4)), 0.0) as water_level,
                    COALESCE(CAST(water_volume AS DECIMAL(15,4)), 0.0) as water_volume
                FROM current_water_data_Nawang 
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
            'message' => "Data retrieved successfully for AI prediction (2 features)",
            'table' => 'current_water_data_Nawang'
        ]);
        
    } else {
        throw new Exception('Unknown action: ' . $data['action']);
    }
    
} catch (Exception $e) {
    error_log("Get water AI data error: " . $e->getMessage());
    sendJsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 500);
}
?>