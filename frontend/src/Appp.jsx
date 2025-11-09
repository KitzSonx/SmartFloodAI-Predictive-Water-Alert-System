import React, { useEffect, useState, useMemo } from "react";
import Header from "./component/Header/Header";
import Weatherpredict from "./component/weatherpredict/weatherpredict";
import Footer from "./component/Footer/Footer.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SlideNav from "./component/SlideNav.tsx";
import Reference from "./pages/Reference.jsx";
import Feedback from "./pages/Feedback.jsx";
import Modal from "./component/Modal.jsx";
import WaterLevelForecastAreaChart from "./component/WaterLevelForecastAreaChart.jsx";
import TablePage from "./pages/TablePage.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import WaterStation from "./pages/WaterStation.jsx";
import EmergencyAgencies from "./pages/EmergencyAgencies.jsx";
import AuthComponent from "./pages/AuthComponent.jsx";
import AgencyDashboard from "./pages/AgencyDashboard.tsx";
import AgencyButton from "./component/AgencieButton/AgencyButton.tsx";
import "./App.css";
import AlertBanner from "./component/AlertBanner.jsx";
import InteractiveMap from "./component/InteractiveMap.jsx";
import StationCard from "./component/StationCard.jsx";

// Station data with water level and status
const stationList = [
  { STN_ID: "TC030114", STN_Name: "สะพานพ่อขุนเม็งรายมหาราช", x: 485, y: 280, waterLevel: 5.12, flowRate: 45.3, rainfall: 12.5, isDestination: true },
  { STN_ID: "TC030226", STN_Name: "โรงเรียนไชยปราการ", x: 187, y: 382, waterLevel: 4.2, flowRate: 38.7, rainfall: 8.3 },
  { STN_ID: "TC030227", STN_Name: "สะพานบ้านสบมาว", x: 223, y: 293, waterLevel: 3.8, flowRate: 32.1, rainfall: 6.7 },
  { STN_ID: "TC030113", STN_Name: "สะพานมิตรภาพแม่นาวาง-ท่าตอน", x: 313, y: 220, waterLevel: 4.85, flowRate: 42.8, rainfall: 10.2, isSource: true },
  { STN_ID: "TC030317", STN_Name: "สะพานบ้านสันมะเค็ด", x: 368, y: 620, waterLevel: 6.3, flowRate: 52.4, rainfall: 18.9 },
  { STN_ID: "TC030318", STN_Name: "สะพานบ้านป่ารวก", x: 455, y: 385, waterLevel: 5.5, flowRate: 48.2, rainfall: 14.6 },
  { STN_ID: "TC030115", STN_Name: "สะพานบ้านสบกก", x: 652, y: 130, waterLevel: 4.1, flowRate: 36.5, rainfall: 7.8 },
  { STN_ID: "TC020510", STN_Name: "โรงเรียนอนุบาลดอกคำใต้", x: 585, y: 662, waterLevel: 7.2, flowRate: 58.9, rainfall: 22.4 },
  { STN_ID: "TC020511", STN_Name: "โรงเรียนบ้านร่องปอ", x: 565, y: 600, waterLevel: 6.8, flowRate: 55.3, rainfall: 20.1 },
  { STN_ID: "TC020603", STN_Name: "โรงเรียนบ้านหนองบัว", x: 469, y: 470, waterLevel: 5.9, flowRate: 49.7, rainfall: 16.3 },
  { STN_ID: "TC020512", STN_Name: "สะพานพระธรรมมิกราช", x: 614, y: 522, waterLevel: 6.5, flowRate: 53.8, rainfall: 19.2 },
  { STN_ID: "TC020705", STN_Name: "โรงเรียนบ้านหย่วน", x: 738, y: 480, waterLevel: 5.7, flowRate: 47.9, rainfall: 15.4 },
  { STN_ID: "TC020805", STN_Name: "สะพานบ้านป่าข่า", x: 703, y: 301, waterLevel: 4.9, flowRate: 41.6, rainfall: 11.8 },
  { STN_ID: "TC020903", STN_Name: "สะพานบ้านหล่ายงาว", x: 830, y: 195, waterLevel: 4.4, flowRate: 39.2, rainfall: 9.5 },
  { STN_ID: "TC020309", STN_Name: "สะพานบ้านแม่คำสบเป็น", x: 515, y: 137, waterLevel: 4.6, flowRate: 40.1, rainfall: 10.7 },
];

const stationConfig = [
  { STN_ID: "TC030114", x: 485, y: 280, zeroLevel: 391.26, isDestination: true },
  { STN_ID: "TC030226", x: 187, y: 382, zeroLevel: 0.0 },
  { STN_ID: "TC030227", x: 223, y: 293, zeroLevel: 460.41 },
  { STN_ID: "TC030113", x: 313, y: 220, zeroLevel: 435.89, isSource: true },
  { STN_ID: "TC030317", x: 368, y: 620, zeroLevel: 551.4 },
  { STN_ID: "TC030318", x: 455, y: 385, zeroLevel: 414.0 },
  { STN_ID: "TC030115", x: 652, y: 130, zeroLevel: 356.7 },
  { STN_ID: "TC020510", x: 585, y: 662, zeroLevel: 0.0 },
  { STN_ID: "TC020511", x: 565, y: 600, zeroLevel: 0.0 },
  { STN_ID: "TC020603", x: 469, y: 470, zeroLevel: 0.0 },
  { STN_ID: "TC020512", x: 614, y: 522, zeroLevel: 370.4 },
  { STN_ID: "TC020705", x: 738, y: 480, zeroLevel: 0.0 },
  { STN_ID: "TC020805", x: 703, y: 301, zeroLevel: 352.1 },
  { STN_ID: "TC020903", x: 830, y: 195, zeroLevel: 356.2 },
  { STN_ID: "TC020309", x: 515, y: 137, zeroLevel: 394.1 },
];


// Main Home Component
function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  const [stationsData, setStationsData] = useState([]);

  useEffect(() => {
    fetch("/proxy.php")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setStationsData(json);
        }
      })
      .catch((err) => {
        console.error("Error fetching water data:", err);
      });
      
    const interval = setInterval(() => {
      fetch("/proxy.php")
        .then((res) => res.json())
        .then((json) => {
          if (Array.isArray(json)) {
            setStationsData(json);
          }
        })
        .catch((err) => console.error(err));
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const stationList = useMemo(() => {
    return stationConfig.map(config =>{
      const station = stationsData.find(s => s.STN_ID === config.STN_ID);
      if(!station) return null;

      const rawLevelMsl = parseFloat(station.CURR_Water_D_Level_MSL) || 0;
      const adjustedLevel = rawLevelMsl > 0 ? (rawLevelMsl - config.zeroLevel).toFixed(2) : 0;

      return {
        ...config,
        STN_Name: station.STN_Name,
        waterLevel: parseFloat(adjustedLevel),
        flowRate: parseFloat(station.CURR_FLOW) || 0,
        rainfall: parseFloat(station.CURR_Acc_Rain_15_M) || 0
      };
    }).filter(Boolean);
  }, [stationsData]);

  const mainStations = useMemo(() => {
    const nawang = stationsData.find(s => s.STN_ID === "TC030113");
    const nawangConfig = stationConfig.find(c => c.STN_ID === "TC030113");
    const mengrai = stationsData.find(s => s.STN_ID === "TC030114");
    const mengraiConfig = stationConfig.find(c => c.STN_ID === "TC030114");
    
    const result = [];

    if (nawang && nawangConfig) {
      const rawLevel = parseFloat(nawang.CURR_Water_D_Level_MSL) || 0;
      const adjustedLevel = (rawLevel > 0 ? (rawLevel - nawangConfig.zeroLevel) : 0);
      result.push({
        ...nawangConfig,
        STN_Name: nawang.STN_Name,
        currentLevel: parseFloat(adjustedLevel.toFixed(2)),
        lastUpdate: nawang.LAST_UPDATE,
        trend: 0
      });
    }

    if (mengrai && mengraiConfig) {
      const rawLevel = parseFloat(mengrai.CURR_Water_D_Level_MSL) || 0;
      const adjustedLevel = (rawLevel > 0 ? (rawLevel - mengraiConfig.zeroLevel) : 0);
      result.push({
        ...mengraiConfig,
        STN_Name: mengrai.STN_Name,
        currentLevel: parseFloat(adjustedLevel.toFixed(2)),
        lastUpdate: mengrai.LAST_UPDATE,
        trend: 0
      });
    }
    
    return result;
  }, [stationsData]);

  const overallStatus = useMemo(() => {
    if (stationsData.length === 0) return { status: "ปกติ", message: "กำลังโหลดข้อมูล..." };
    
    const maxLevel = Math.max(...stationList.map(s => s.waterLevel));
    
    if (maxLevel >= 7) return { 
      status: "วิกฤติ", 
      message: "มีสถานีที่ระดับน้ำถึงเกณฑ์วิกฤติ กรุณาติดตามข่าวสารอย่างใกล้ชิด" 
    };
    if (maxLevel >= 6) return { 
      status: "เตรียมอพยพ", 
      message: "มีสถานีที่ควรเตรียมพร้อมอพยพ" 
    };
    if (maxLevel >= 5.5) return { 
      status: "เฝ้าระวัง", 
      message: "มีสถานีที่ควรเฝ้าระวัง" 
    };
    
    return { 
      status: "ปกติ", 
      message: "ระดับน้ำทุกสถานีอยู่ในเกณฑ์ปกติ" 
    };
  }, [stationList]);

  useEffect(() => {
    const visitedHome = sessionStorage.getItem("visitedHome");
    if (!visitedHome) {
      setShowModal(true);
      sessionStorage.setItem("visitedHome", "true");
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewForecast = (stationId) => {
    setShowForecast(true);
    setTimeout(() => {
      document.getElementById('forecast-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStationClick = (station) => {
    console.log("Selected station:", station);
  };

  return (
    <>
      <Modal show={showModal} onClose={handleCloseModal} />
      <div className="main-layout">
        <Header />
        <br /><br />
        <main className="content-area py-8">
          <div className="max-w-screen-xl mx-auto px-4">
            
            <AlertBanner 
              status={overallStatus.status}
              message={overallStatus.message}
              trend="อัพเดตทุก 5 นาที"
            />

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                fontWeight: "600",
                color: "white",
                marginBottom: "20px",
                textAlign: "center",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}>
                📍 สถานีหลักที่ติดตาม
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px"
              }}>
                {mainStations.map(station => (
                  <StationCard 
                    key={station.id}
                    station={station}
                    onViewForecast={handleViewForecast}
                  />
                ))}
              </div>
            </div>

            {showForecast && (
              <div id="forecast-section" style={{ marginBottom: "40px" }}>
                <WaterLevelForecastAreaChart />
              </div>
            )}

            <div style={{ marginBottom: "40px" }}>
              <InteractiveMap 
                stations={stationList}
                onStationClick={handleStationClick}
              />
            </div>

            <div style={{ marginBottom: "40px" }}>
              <Weatherpredict />
            </div>

          </div>
        </main>
        <Footer />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .main-layout .content-area {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
        }
      `}</style>
    </>
  );
}

// Main App Component
export default function Appp() {
  return (
    <Router>
      <SlideNav />
      <AgencyButton />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/Water-Table-Page" element={<TablePage />} /> */}
        {/* <Route path="/WaterStation" element={<WaterStation />} /> */}
        <Route path="/contact-the-evacuation-center" element={<EmergencyAgencies/>} />
        <Route path="/about-ai-water" element={<Reference />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/contact-us" element={<ContactUs/>} />
        {/* <Route path="/login" element={<AuthComponent/>} /> */}
        <Route path="/agency-login" element={<AuthComponent/>} /> {/*Login สำหรับเจ้าหน้าที่*/ }
        <Route path="/agency-dashboard" element={<AgencyDashboard/>} /> {/* Dashboard หน่วยงาน */}
      </Routes>
    </Router>
  );
}