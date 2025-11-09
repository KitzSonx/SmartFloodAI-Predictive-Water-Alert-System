// src/component/Dashboard/DataExplorer.tsx
import React, { useState } from 'react';
import WaterTable from "../WaterTable/WaterTable";
import WaterTableNawang from "../WaterTableNawang/WaterTableNawang";
import CombinedWaterTable from "../CombinedWaterTable";
import DataExplorerChart from "../DataExplorerChart/DataExplorerChart.jsx";
import { ApiHistoryData, ChartDataPoint, GraphState } from '../../types/dashboard';

const roundDownToNearest15Minutes = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  const minutes = date.getMinutes();
  const roundedMinutes = Math.floor(minutes / 15) * 15;
  date.setMinutes(roundedMinutes, 0, 0);

  const pad = (num: number) => num.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};


const DataExplorer: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphState>({ visible: false, data: [], title: "" });
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedStation, setSelectedStation] = useState<string>("all");
  const [showDataExplorer, setShowDataExplorer] = useState(false);

  const handleCompareStations = async () => {
    if (!dateRange.start || !dateRange.end) {
      alert("กรุณาเลือกช่วงเวลาเริ่มต้นและสิ้นสุดก่อนเปรียบเทียบ");
      return;
    }
    setIsGraphLoading(true);
    setGraphData({ visible: false, data: [], title: "" });
    
    const formatDateForAPI = (dateTimeLocal: string) => {
      if (!dateTimeLocal) return '';
      return dateTimeLocal.replace('T', ' ') + ':00';
    };
    const formattedStart = formatDateForAPI(dateRange.start);
    const formattedEnd = formatDateForAPI(dateRange.end);
    const nawangUrl = `https://myweb.ac.th/get_water_dataNawang.php?startDate=${encodeURIComponent(formattedStart)}&endDate=${encodeURIComponent(formattedEnd)}`;
    const mengraiUrl = `https://myweb.ac.th/get_water_data.php?startDate=${encodeURIComponent(formattedStart)}&endDate=${encodeURIComponent(formattedEnd)}`;
    const nawangZeroLevel = 435.89;
    const mengraiZeroLevel = 391.26;

    try {
      const [nawangResponse, mengraiResponse] = await Promise.all([
        fetch(nawangUrl),
        fetch(mengraiUrl)
      ]);
      if (!nawangResponse.ok || !mengraiResponse.ok) throw new Error("ไม่สามารถดึงข้อมูลจากสถานีใดสถานีหนึ่งได้");

      const nawangApiData: ApiHistoryData[] = await nawangResponse.json();
      const mengraiApiData: ApiHistoryData[] = await mengraiResponse.json();
      if (!Array.isArray(nawangApiData) || !Array.isArray(mengraiApiData)) throw new Error("รูปแบบข้อมูลที่ได้รับจาก API ไม่ถูกต้อง");

      const mergedDataMap = new Map<string, ChartDataPoint>();
      nawangApiData.forEach(item => {
        const roundedTimestamp = roundDownToNearest15Minutes(item.datetime);
        const level = parseFloat(item.water_level) - nawangZeroLevel || 0;
        mergedDataMap.set(roundedTimestamp, {
          timestamp: new Date(roundedTimestamp).getTime(), 
          level_nawang: level
        });
      });
      mengraiApiData.forEach(item => {
        const roundedTimestamp = roundDownToNearest15Minutes(item.datetime);
        const level = parseFloat(item.water_level) - mengraiZeroLevel || 0;
        const existingEntry = mergedDataMap.get(roundedTimestamp);
        if (existingEntry) {
          existingEntry.level_mengrai = level;
        } else {
          mergedDataMap.set(roundedTimestamp, {
            timestamp: new Date(roundedTimestamp).getTime(),
            level_mengrai: level
          });
        }
      });
      const combinedData = Array.from(mergedDataMap.values()).sort((a, b) => a.timestamp - b.timestamp);
      setGraphData({ visible: true, data: combinedData, title: "เปรียบเทียบความลึกน้ำ: ท่าตอน vs พ่อขุนฯ" });
    } catch (error) {
      console.error("Error comparing stations:", error);
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด";
      alert("เกิดข้อผิดพลาดในการเปรียบเทียบกราฟ: " + errorMessage);
      setGraphData({ visible: false, data: [], title: "" });
    } finally {
      setIsGraphLoading(false);
    }
  };

  const handleCreateGraph = async () => {
    if (!dateRange.start || !dateRange.end) {
      alert("กรุณาเลือกช่วงเวลาเริ่มต้นและสิ้นสุดก่อนสร้างกราฟ");
      return;
    }
    if (selectedStation === 'all') {
      alert("ฟังก์ชันสร้างกราฟรองรับการเลือกทีละสถานีเท่านั้น");
      return;
    }
    setIsGraphLoading(true);
    setGraphData({ visible: false, data: [], title: "" });

    const formatDateForAPI = (dateTimeLocal: string) => {
      if (!dateTimeLocal) return '';
      return dateTimeLocal.replace('T', ' ') + ':00';
    };
    const formattedStart = formatDateForAPI(dateRange.start);
    const formattedEnd = formatDateForAPI(dateRange.end);
    let apiUrl = "";
    let stationTitle = "";
    let zeroLevel = 0;

    if (selectedStation === 'nawang') {
      apiUrl = `https://myweb.ac.th/get_water_dataNawang.php?startDate=${encodeURIComponent(formattedStart)}&endDate=${encodeURIComponent(formattedEnd)}`;
      stationTitle = "ข้อมูลความลึกน้ำรายชั่วโมง: สถานีสะพานมิตรภาพแม่นาวาง-ท่าตอน";
      zeroLevel = 435.89;
    } else if (selectedStation === 'mengrai') {
      apiUrl = `https://myweb.ac.th/get_water_data.php?startDate=${encodeURIComponent(formattedStart)}&endDate=${encodeURIComponent(formattedEnd)}`;
      stationTitle = "ข้อมูลความลึกน้ำรายชั่วโมง: สถานีสะพานพ่อขุนเม็งรายมหาราช";
      zeroLevel = 391.26;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
      const apiData: ApiHistoryData[] = await response.json();
      if(!Array.isArray(apiData)) throw new Error("รูปแบบข้อมูลที่ได้รับจาก API ไม่ถูกต้อง");
      
      const formattedGraphData = apiData.map(item => ({
        timestamp: new Date(roundDownToNearest15Minutes(item.datetime)).getTime(),
        level: (parseFloat(item.water_level) - zeroLevel) || 0,
      }));
      setGraphData({ visible: true, data: formattedGraphData, title: stationTitle });
    } catch (error) {
      console.error("Error creating graph:", error);
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด";
      alert("เกิดข้อผิดพลาดในการสร้างกราฟ: " + errorMessage);
      setGraphData({ visible: false, data: [], title: "" });
    } finally {
      setIsGraphLoading(false);
    }
  };

  return (
    <>
      <section className="dashboard-card data-explorer-card full-width-card">
        <div className="card-header">
          <h2>📊 คลังข้อมูลและรายงาน (Data Explorer & Reports)</h2>
          <button
            className="toggle-btn"
            onClick={() => setShowDataExplorer(!showDataExplorer)}
          >
            {showDataExplorer ? "▼ ซ่อน" : "▶ แสดง"}
          </button>
        </div>

        {showDataExplorer && (
          <div className="data-explorer-content">
            <div className="explorer-controls">
              <div className="control-group">
                <input 
                  type="datetime-local" 
                  value={dateRange.start} 
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} 
                />
                <span>ถึง</span>
                <input 
                  type="datetime-local" 
                  value={dateRange.end} 
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} 
                />
              </div>
              <div className="control-group">
                <label>เลือกสถานี:</label>
                <select
                  className="station-select"
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                >
                  <option value="nawang">สะพานมิตรภาพแม่นาวาง-ท่าตอน</option>
                  <option value="mengrai">สะพานพ่อขุนเม็งรายมหาราช</option>
                  <option value="all">ทั้งหมด</option>
                </select>
              </div>
              <div className="control-group">
                <button className="action-btn" onClick={handleCreateGraph} disabled={isGraphLoading}>
                  {isGraphLoading ? 'กำลังสร้าง...' : '📊 สร้างกราฟ'}
                </button>
                <button className="action-btn" onClick={handleCompareStations} disabled={isGraphLoading}>
                  ⚖️ เปรียบเทียบสถานี
                </button>
                <button className="action-btn">📈 วิเคราะห์แนวโน้ม</button>
              </div>
            </div>

            {selectedStation === "mengrai" && <WaterTable dateRange={dateRange} />}
            {selectedStation === "nawang" && <WaterTableNawang dateRange={dateRange} />}
            {selectedStation === "all" && <CombinedWaterTable dateRange={dateRange} />}
          </div>
        )}
      </section>

      {graphData.visible && (
        <DataExplorerChart 
          data={graphData.data} 
          title={graphData.title}
          onClose={() => setGraphData({ visible: false, data: [], title: "" })}
        />
      )}
    </>
  );
};

export default DataExplorer;