SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- Database: `db_aiwater`

-- --------------------------------------------------------
-- Table structure for table `current_water_data_MangRai`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `current_water_data_MangRai`;
CREATE TABLE `current_water_data_MangRai` (
  `datetime` datetime DEFAULT NULL,
  `rainfall` float DEFAULT NULL,
  `cumulative_rainfall` float DEFAULT NULL,
  `water_level` float DEFAULT NULL,
  `water_volume` float DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `current_water_data_Nawang`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `current_water_data_Nawang`;
CREATE TABLE `current_water_data_Nawang` (
  `datetime` datetime NOT NULL,
  `water_level` decimal(10,4) NOT NULL COMMENT 'CURR_Water_D_Level_MSL',
  `water_volume` decimal(15,4) DEFAULT '0.0000' COMMENT 'CURR_FLOW'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='ข้อมูลสถานี สะพานมิตรภาพแม่นาวาง-ท่าตอน';

-- --------------------------------------------------------
-- Table structure for table `predict_water_data_Mengrai`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `predict_water_data_Mengrai`;
CREATE TABLE `predict_water_data_Mengrai` (
  `id` bigint(20) NOT NULL COMMENT 'ID ของข้อมูล (Primary Key อัตโนมัติ)',
  `run_time` datetime NOT NULL COMMENT 'เวลาที่โมเดลเริ่มทำงาน (เวลาที่กดรัน)',
  `forecast_time` datetime NOT NULL COMMENT 'เวลาของค่าที่พยากรณ์ (เช่น T+1, T+2, T+3)',
  `forecast_value` decimal(12,4) NOT NULL COMMENT 'ค่าที่พยากรณ์ได้ (เช่น ระดับน้ำ, ปริมาณน้ำ)',
  `horizon` tinyint(4) NOT NULL COMMENT 'ระยะเวลาที่พยากรณ์ล่วงหน้า (เช่น 1, 2, 3 ชั่วโมง)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'เวลาที่แถวนี้ถูกเพิ่มเข้าฐานข้อมูล'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ตารางเก็บข้อมูลพยากรณ์น้ำแบบทับซ้อน (Mengrai Project)';

-- --------------------------------------------------------
-- Table structure for table `predict_water_data_Nawang`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `predict_water_data_Nawang`;
CREATE TABLE `predict_water_data_Nawang` (
  `id` bigint(20) NOT NULL COMMENT 'ID ของข้อมูล (Primary Key อัตโนมัติ)',
  `run_time` datetime NOT NULL COMMENT 'เวลาที่โมเดลเริ่มทำงาน (เวลาที่กดรัน)',
  `forecast_time` datetime NOT NULL COMMENT 'เวลาของค่าที่พยากรณ์ (เช่น T+1, T+2, T+3)',
  `forecast_value` decimal(12,4) NOT NULL COMMENT 'ค่าที่พยากรณ์ได้ (เช่น ระดับน้ำ, ปริมาณน้ำ)',
  `horizon` tinyint(4) NOT NULL COMMENT 'ระยะเวลาที่พยากรณ์ล่วงหน้า (เช่น 1, 2, 3 ชั่วโมง)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'เวลาที่แถวนี้ถูกเพิ่มเข้าฐานข้อมูล'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ตารางเก็บข้อมูลพยากรณ์น้ำแบบทับซ้อน (Nawang Project)';

-- --------------------------------------------------------
-- Indexes
-- --------------------------------------------------------
ALTER TABLE `current_water_data_Nawang`
  ADD UNIQUE KEY `unique_datetime` (`datetime`),
  ADD KEY `idx_datetime` (`datetime`),
  ADD KEY `idx_water_level` (`water_level`);

ALTER TABLE `predict_water_data_Mengrai`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_unique_run_forecast` (`run_time`,`forecast_time`),
  ADD KEY `idx_forecast_time` (`forecast_time`);

ALTER TABLE `predict_water_data_Nawang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_unique_run_forecast` (`run_time`,`forecast_time`),
  ADD KEY `idx_forecast_time` (`forecast_time`);

-- --------------------------------------------------------
-- AUTO_INCREMENT
-- --------------------------------------------------------
ALTER TABLE `predict_water_data_Mengrai`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID ของข้อมูล (Primary Key อัตโนมัติ)';

ALTER TABLE `predict_water_data_Nawang`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID ของข้อมูล (Primary Key อัตโนมัติ)';

SET FOREIGN_KEY_CHECKS=1;
