// src/pages/AgencyDashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../component/AgencyDashboard/AgencieDashboard.css";

// --- Import Hooks & Types ---
import usePrevious from "../hooks/usePrevious.ts";
import { 
  AlertLog, LiveStationData, MergedStation, StationStatus 
} from "../types/dashboard";

// --- Import Components ---
import LogoutConfirmModal from "../component/Dashboard/LogoutConfirmModal.tsx";
import DashboardHeader from "../component/Dashboard/DashboardHeader.tsx";
import MonitoringWidget from "../component/Dashboard/MonitoringWidget.tsx";
import AlertLogWidget from "../component/Dashboard/AlertLogWidget.tsx";
import CommunicationTools from "../component/Dashboard/CommunicationTools.tsx";
import DataExplorer from "../component/Dashboard/DataExplorer.tsx";
import VisitorCounters from "../component/VisitorCounters.jsx";
import Footer from "../component/Footer/Footer";
import OperationalMap from "../component/OperationalMap/OperationalMap.tsx";
import WaterLevelForecastAreaChart from "../component/WaterLevelForecastAreaChart.jsx";


const AgencyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [liveStationsData, setLiveStationsData] = useState<LiveStationData[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('7h');

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchData = () => {
      fetch("/proxy.php")
        .then((res) => res.json())
        .then((json) => {
          if (Array.isArray(json)) {
            setLiveStationsData(json);
          }
        })
        .catch((err) => {
          console.error("Error fetching water data:", err);
        });
    };
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const stationConfig = [
    {id: "1",STN_ID: "TC030113",name: "สะพานมิตรภาพแม่นาวาง-ท่าตอน",position: { lat: 20.049635, lng: 99.407262 },zeroLevel: 435.89,isSource: true,},
    {id: "2",STN_ID: "TC030114",name: "สะพานพ่อขุนเม็งรายมหาราช",position: { lat: 19.931189, lng: 99.772518 },zeroLevel: 391.26,isDestination: true,},
    {id: "3",STN_ID: "TC030226",name: "โรงเรียนไชยปราการ",position: { lat: 19.724733, lng: 99.139405 },zeroLevel: 0.0,},
    {id: "4",STN_ID: "TC030227",name: "สะพานบ้านสบมาว",position: { lat: 19.903571, lng: 99.214507 },zeroLevel: 460.41,},
    {id: "5",STN_ID: "TC030317",name: "สะพานบ้านสันมะเค็ด",position: { lat: 19.24846, lng: 99.519731 },zeroLevel: 551.4,},
    {id: "6",STN_ID: "TC030318",name: "สะพานบ้านป่ารวก",position: { lat: 19.712035, lng: 99.711841 },zeroLevel: 414.0,},
    {id: "7",STN_ID: "TC030115",name: "สะพานบ้านสบกก",position: { lat: 20.228117, lng: 100.128349 },zeroLevel: 356.7,},
    {id: "8",STN_ID: "TC020510",name: "โรงเรียนอนุบาลดอกคำใต้ (ชุมชนสันช้างหิน)",position: { lat: 19.161239, lng: 99.985508 },zeroLevel: 0.0,},
    {id: "9",STN_ID: "TC020511",name: "โรงเรียนบ้านร่องปอ",position: { lat: 19.288175, lng: 99.9429 },zeroLevel: 0.0,},
    {id: "10",STN_ID: "TC020603",name: "โรงเรียนบ้านหนองบัว",position: { lat: 19.548153, lng: 99.734752 },zeroLevel: 0.0,},
    {id: "11",STN_ID: "TC020512",name: "สะพานพระธรรมมิกราช",position: { lat: 19.443778, lng: 100.042972 },zeroLevel: 370.4,},
    {id: "12",STN_ID: "TC020705",name: "โรงเรียนบ้านหย่วน (เชียงคำนาคโรวาท)",position: { lat: 19.523352, lng: 100.301619 },zeroLevel: 0.0,},
    {id: "13",STN_ID: "TC020805",name: "สะพานบ้านป่าข่า",position: { lat: 19.884479, lng: 100.236852 },zeroLevel: 352.1,},
    {id: "14",STN_ID: "TC020903",name: "สะพานบ้านหล่ายงาว",position: { lat: 20.095092, lng: 100.506167 },zeroLevel: 356.2,},
    {id: "15",STN_ID: "TC020309",name: "สะพานบ้านแม่คำสบเปิน",position: { lat: 20.2165, lng: 99.83675 },zeroLevel: 394.1,},
  ];

  const mergedStations = useMemo(() => {
    return stationConfig.map(config => {
      const liveData = liveStationsData.find(s => s.STN_ID === config.STN_ID);
      if (!liveData) {
        return {
          ...config,
          status: 'normal' as const,
          waterLevel: 0,
          flowRate: 0,
          rainfall: 0,
          lastUpdate: "กำลังรอข้อมูล..."
        };
      }
      const rawLevelMsl = parseFloat(liveData.CURR_Water_D_Level_MSL) || 0;
      const adjustedLevel = rawLevelMsl > 0 ? (rawLevelMsl - config.zeroLevel) : 0;
      let status: 'critical' | 'warning' | 'normal' = 'normal';
      if (adjustedLevel >= 7) status = 'critical';
      else if (adjustedLevel >= 5.5) status = 'warning';
      return {
        ...config,
        status: status,
        waterLevel: adjustedLevel,
        flowRate: parseFloat(liveData.CURR_FLOW) || 0,
        rainfall: parseFloat(liveData.CURR_Acc_Rain_15_M) || 0,
        lastUpdate: liveData.LAST_UPDATE || new Date().toLocaleString('th-TH')
      };
    });
  }, [liveStationsData]);

  const stationStatus = useMemo(() => {
    return mergedStations.reduce((acc, station) => {
      if (station.status === 'critical') acc.critical++;
      else if (station.status === 'warning') acc.warning++;
      else acc.normal++;
      return acc;
    }, { critical: 0, warning: 0, normal: 0 });
  }, [mergedStations]);

  const criticalStations = useMemo(() => {
    return mergedStations.filter(
      (station) => station.status === "critical" || station.status === "warning"
    );
  }, [mergedStations]);

  const prevMergedStations = usePrevious<MergedStation[]>(mergedStations);

  useEffect(() => {
    if (prevMergedStations && prevMergedStations.length > 0) {
      mergedStations.forEach((currentStation, index) => {
        const previousStation = prevMergedStations[index];
        if (previousStation && currentStation.status !== 'normal' && currentStation.status !== previousStation.status) {
          const newLog: AlertLog = {
            id: new Date().toISOString() + currentStation.STN_ID,
            timestamp: new Date().toLocaleString("th-TH"),
            station: currentStation.name,
            level: currentStation.status,
            message: `สถานะเปลี่ยนเป็น "${currentStation.status === 'critical' ? 'อันตราย' : 'เฝ้าระวัง'}"`,
          };
          setAlertLogs(prevLogs => {
            if (prevLogs.length === 0 || prevLogs[0].station !== newLog.station || prevLogs[0].level !== newLog.level) {
              return [newLog, ...prevLogs];
            }
            return prevLogs;
          });
        }
      });
    }
  }, [mergedStations, prevMergedStations]);

  return (
    <div className="agency-dashboard">
      <LogoutConfirmModal 
        show={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />

      <DashboardHeader onLogout={handleLogout} />

      <div className="dashboard-grid">
        <section className="dashboard-card map-card">
          <div className="card-header">
            <h2>🗺️ แผนที่ปฏิบัติการ</h2>
            <div className="map-controls">
              {/* ... (map controls) ... */}
            </div>
          </div>
          <div className="map-container">
            <OperationalMap stations={mergedStations} />
          </div>
        </section>

        <MonitoringWidget 
          criticalStations={criticalStations}
          stationStatus={stationStatus}
        />

        <section className="dashboard-card forecast-card full-width-card">
          <div className="card-header">
            <h2>📈 กราฟพยากรณ์สถานีหลัก</h2>
            <div className="duration-selector">
              <button onClick={() => setSelectedDuration('7h')} className={selectedDuration === '7h' ? 'active' : ''}>7 ชม.</button>
              <button onClick={() => setSelectedDuration('12h')} className={selectedDuration === '12h' ? 'active' : ''}>12 ชม.</button>
              <button onClick={() => setSelectedDuration('1d')} className={selectedDuration === '1d' ? 'active' : ''}>1 วัน</button>
              <button onClick={() => setSelectedDuration('3d')} className={selectedDuration === '3d' ? 'active' : ''}>3 วัน</button>
              <button onClick={() => setSelectedDuration('7d')} className={selectedDuration === '7d' ? 'active' : ''}>7 วัน</button>
            </div>
          </div>
          <div className="forecast-charts-container">
            <WaterLevelForecastAreaChart
              stationId="nawang"
              stationName="สะพานมิตรภาพแม่นาวาง-ท่าตอน (ต้นทาง)"
              duration={selectedDuration}
            />
            <WaterLevelForecastAreaChart
              stationId="mengrai"
              stationName="สะพานพ่อขุนเม็งรายมหาราช (ปลายทาง)"
              duration={selectedDuration}
            />
          </div>
        </section>
        
        <DataExplorer />

        <AlertLogWidget alertLogs={alertLogs} />

        <CommunicationTools />
      </div>
      <Footer/>
    </div>
  );
};

export default AgencyDashboard;