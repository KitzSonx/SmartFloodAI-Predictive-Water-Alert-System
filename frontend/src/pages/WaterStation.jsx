import React, { useState, useEffect } from "react";
import Select from "react-select";

import rainfall from "../assets/rainfall.png";
import waterflow from "../assets/waterflow.png";
import waterlevel from "../assets/waterlevel.png";
import accumulate from "../assets/accumulate.png";
import watermap from "../assets/Watermap2.png";
import Footer from "../component/Footer/Footer";

// Station data with SVG coordinates (based on 1000x800 viewBox)
const stationList = [
  { STN_ID: "TC030114", STN_Name: "สะพานพ่อขุนเม็งรายมหาราช (สถานีหลัก)", x: 485, y: 280 },
  { STN_ID: "TC030226", STN_Name: "โรงเรียนไชยปราการ", x: 187, y: 382 },
  { STN_ID: "TC030227", STN_Name: "สะพานบ้านสบมาว", x: 223, y: 293 },
  { STN_ID: "TC030113", STN_Name: "สะพานมิตรภาพแม่นาวาง-ท่าตอน", x: 313, y: 220 },
  { STN_ID: "TC030317", STN_Name: "สะพานบ้านสันมะเค็ด", x: 368, y: 620 },
  { STN_ID: "TC030318", STN_Name: "สะพานบ้านป่ารวก", x: 455, y: 385 },
  { STN_ID: "TC030115", STN_Name: "สะพานบ้านสบกก", x: 652, y: 130 },
  { STN_ID: "TC020510", STN_Name: "โรงเรียนอนุบาลดอกคำใต้ (ชุมชนสันช้างหิน)", x: 585, y: 662 },
  { STN_ID: "TC020511", STN_Name: "โรงเรียนบ้านร่องปอ", x: 565, y: 600 },
  { STN_ID: "TC020603", STN_Name: "โรงเรียนบ้านหนองบัว", x: 469, y: 470 },
  { STN_ID: "TC020512", STN_Name: "สะพานพระธรรมมิกราช", x: 614, y: 522 },
  { STN_ID: "TC020705", STN_Name: "โรงเรียนบ้านหย่วน (เชียงคำนาคโวาท)", x: 738, y: 480 },
  { STN_ID: "TC020805", STN_Name: "สะพานบ้านป่าข่า", x: 703, y: 301 },
  { STN_ID: "TC020903", STN_Name: "สะพานบ้านหล่ายงาว", x: 830, y: 195 },
  { STN_ID: "TC020309", STN_Name: "สะพานบ้านแม่คำสบเป็น", x: 515, y: 137 },
];

const options = stationList.map((station) => ({
  value: station.STN_ID,
  label: station.STN_Name,
}));

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: state.isFocused ? '#80bdff' : 'rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(115, 103, 240, 0.25)' : 'none',
    cursor: 'pointer',
    minHeight: '45px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: '16px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#e0e6ed',
    fontSize: '16px',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(30, 60, 114, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgba(115, 103, 240, 0.8)' : state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '15px',
    "&:hover": {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    }
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
};

const InteractiveMap = ({ stations, selectedStation, onStationClick }) => {
  const [hoveredStation, setHoveredStation] = useState(null);
  
  return (
    <div className="map-container">
      <svg 
        viewBox="0 0 1000 800" 
        className="map-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <image 
          href={watermap} 
          x="0" 
          y="0" 
          width="1000" 
          height="800"
          preserveAspectRatio="xMidYMid meet"
        />
        {stations.map(station => (
          <g key={station.STN_ID}>
            {selectedStation?.STN_ID === station.STN_ID && (
              <circle
                cx={station.x}
                cy={station.y}
                r="0"
                fill="none"
                stroke="#FFD700"
                strokeWidth="3"
                opacity="0.8"
              >
                <animate
                  attributeName="r"
                  from="0"
                  to="30"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.8"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            
            <circle
              cx={station.x}
              cy={station.y}
              r={selectedStation?.STN_ID === station.STN_ID ? 25 : 21}
              fill={selectedStation?.STN_ID === station.STN_ID ? '#FFD700' : '#FF5722'}
              stroke="#fff"
              strokeWidth={selectedStation?.STN_ID === station.STN_ID ? 3 : 2}
              onClick={() => onStationClick(station)}
              onMouseEnter={() => setHoveredStation(station.STN_ID)}
              onMouseLeave={() => setHoveredStation(null)}
              className="station-marker"
              opacity="0.95"
            />
            
            {(selectedStation?.STN_ID === station.STN_ID || hoveredStation === station.STN_ID) && (
              <g>
                <rect
                  x={station.x - (station.STN_Name.length * 6 + 20)}
                  y={station.y - 45}
                  width={station.STN_Name.length * 12 + 20}
                  height="40"
                  rx="8"
                  fill="rgba(30, 60, 114, 0.95)"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                  className="tooltip-bg"
                />
                <text
                  x={station.x}
                  y={station.y - 22}
                  textAnchor="middle"
                  fill="white"
                  fontSize="20"
                  fontFamily="'Noto Sans Thai', Arial, sans-serif"
                  fontWeight="500"
                  className="tooltip-text"
                >
                  {station.STN_Name}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
      
      <div className="map-legend">
        <div className="legend-title">คำอธิบาย</div>
        <div className="legend-item">
          <svg width="16" height="16">
            <circle cx="8" cy="8" r="6" fill="#FF5722" stroke="#fff" strokeWidth="2" />
          </svg>
          <span>สถานีตรวจวัด</span>
        </div>
        <div className="legend-item">
          <svg width="20" height="20">
            <circle cx="10" cy="10" r="8" fill="#FFD700" stroke="#fff" strokeWidth="2" />
          </svg>
          <span>สถานีที่เลือก</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("--:--");
  const [selectedOption, setSelectedOption] = useState(options.find(option => option.value === "TC030114"));
  const [selectedStation, setSelectedStation] = useState(stationList.find(s => s.STN_ID === "TC030114"));

  useEffect(() => {
    if (selectedStation) {
      fetchData(selectedStation.STN_ID);
    }
  }, [selectedStation]);

  const fetchData = (stationId) => {
    const simulatedData = {
      STN_ID: stationId,
      STN_Name: stationList.find(s => s.STN_ID === stationId)?.STN_Name,
      CURR_Water_D_Level_MSL: (Math.random() * 10).toFixed(2),
      CURR_FLOW: (Math.random() * 100).toFixed(2),
      CURR_Acc_Rain_15_M: (Math.random() * 20).toFixed(2),
      CURR_Acc_Rain_30_M: (Math.random() * 30).toFixed(2),
      LAST_UPDATE: new Date().toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    };
    
    setData(simulatedData);
    setLastUpdate(simulatedData.LAST_UPDATE);
  };

  const handleStationChange = (selected) => {
    setSelectedOption(selected);
    const station = stationList.find(s => s.STN_ID === selected.value);
    setSelectedStation(station);
  };

  const handleMapStationClick = (station) => {
    setSelectedStation(station);
    setSelectedOption(options.find(opt => opt.value === station.STN_ID));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="header-section">
          <br /><br />
          <h2 className="main-title">ระบบตรวจสอบข้อมูลน้ำปัจจุบันแต่ละสถานีในจังหวัดเชียงราย</h2>
          <div className="description">
            <p>
              ข้อมูลน้ำปัจจุบันของสถานีต่าง ๆ ทั่วจังหวัดเชียงราย สามารถเลือกสถานีได้จากการคลิกไปที่จุดในแผนที่แม่น้ำ
              หรือเลือกจากรายการด้านล่าง เพื่อดูข้อมูลระดับน้ำ อัตราการไหล และปริมาณฝนในแต่ละสถานี
            </p>
          </div>
        </div>

        <div className="map-panel">
          <h2 className="panel-title">แผนที่สถานีตรวจวัดน้ำ</h2>
          <h5 style={{color: "white", fontSize: 17}}>*คลิกจุดเพื่อเลือกสถานีปัจจุบัน*</h5>
          <div className="map-wrapper">
            <InteractiveMap
              stations={stationList}
              selectedStation={selectedStation}
              onStationClick={handleMapStationClick}
            />
          </div>
        </div>

        <div className="data-panel">
          <div className="station-selector">
            <label className="selector-label">เลือกสถานีตรวจวัด : </label>
            <Select
              instanceId="station-selector"
              options={options}
              value={selectedOption}
              onChange={handleStationChange}
              styles={customStyles}
              isSearchable={false}
              placeholder="กรุณาเลือกสถานี..."
            />
          </div>

          <h2 className="station-name">
            สถานี : {data?.STN_Name || "กำลังโหลด..."}
          </h2>

          <div className="data-grid">
            <div className="data-card">
              <img src={waterlevel} alt="ระดับน้ำ" className="data-icon" />
              <div className="data-content">
                <div className="data-label">ระดับน้ำ</div>
                <div className="data-value">
                  {data?.CURR_Water_D_Level_MSL || "--"} ม.รทก.
                </div>
              </div>
            </div>

            <div className="data-card">
              <img src={waterflow} alt="อัตราการไหล" className="data-icon" />
              <div className="data-content">
                <div className="data-label">อัตราการไหล</div>
                <div className="data-value">
                  {data?.CURR_FLOW || "--"} ลบ.ม./วิ
                </div>
              </div>
            </div>

            <div className="data-card">
              <img src={accumulate} alt="ฝนสะสม" className="data-icon" />
              <div className="data-content">
                <div className="data-label">ฝนสะสม 15 นาที</div>
                <div className="data-value">
                  {data?.CURR_Acc_Rain_15_M || "--"} มม.
                </div>
              </div>
            </div>

            <div className="data-card">
              <img src={rainfall} alt="ฝน 30 นาที" className="data-icon" />
              <div className="data-content">
                <div className="data-label">ฝนสะสม 30 นาที</div>
                <div className="data-value">
                  {data?.CURR_Acc_Rain_30_M || "--"} มม.
                </div>
              </div>
            </div>
          </div>

          <div className="last-update">
            อัปเดตล่าสุด: {lastUpdate}
          </div>
        </div>
      </div>
      <br />
      <Footer/>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background-image: radial-gradient(
            circle 382px at 50% 50.2%,
            rgba(73, 76, 212, 1) 0.1%,
            rgba(3, 1, 50, 1) 100.2%
          );
          padding: 20px;
          font-family: 'Noto Sans Thai', Arial, sans-serif;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
        }

        .header-section {
          text-align: center;
          margin-bottom: 10px;
        }

        .main-title {
          color: transparent;
          background: linear-gradient(to right, #67e8f9, #ffffff);
          background-clip: text;
          -webkit-background-clip: text;
          font-size: clamp(1.5rem, 4vw, 2.2rem);
          font-weight: 600;
          margin: 0 0 20px 0;
          text-shadow: none;
          letter-spacing: 0.025em;
          line-height: 2.2;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .description {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin: 0 auto;
          max-width: 800px;
        }

        .description p {
          color: white;
          font-size: clamp(14px, 2.5vw, 18px);
          line-height: 1.6;
          margin: 0;
          text-align: center;
        }

        .map-panel, .data-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .panel-title {
          color: white;
          font-size: clamp(1.3rem, 3vw, 1.8rem);
          font-weight: 600;
          margin: 0 0 20px 0;
          text-align: center;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .map-wrapper {
          height: 500px;
          width: 100%;
        }

        .map-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .map-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .station-marker {
          cursor: pointer;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
        }

        .tooltip-bg {
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }

        .tooltip-text {
          pointer-events: none;
          user-select: none;
        }

        .map-legend {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.95);
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
        }

        .legend-title {
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          color: #555;
        }

        .legend-item:last-child {
          margin-bottom: 0;
        }

        .station-selector {
          margin-bottom: 25px;
        }

        .selector-label {
          color: white;
          display: block;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 500;
        }

        .station-name {
          color: white;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-weight: 500;
          margin-bottom: 25px;
          text-align: center;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .data-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .data-card {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .data-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
        }

        .data-icon {
          width: 45px;
          height: 45px;
          margin-right: 15px;
          object-fit: contain;
        }

        .data-content {
          flex: 1;
        }

        .data-label {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .data-value {
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 600;
          color: #2c3e50;
        }

        .last-update {
          color: white;
          text-align: center;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Desktop Layout */
        @media (min-width: 1024px) {
          .dashboard-container {
            grid-template-columns: 1.2fr 1fr;
            grid-template-rows: auto auto 1fr;
            grid-template-areas: 
              "header header"
              "map data"
              "map data";
          }

          .header-section {
            grid-area: header;
          }

          .map-panel {
            grid-area: map;
            height: fit-content;
          }

          .data-panel {
            grid-area: data;
          }

          .map-wrapper {
            height: 600px;
          }
        }

        /* Tablet Layout */
        @media (max-width: 1023px) and (min-width: 768px) {
          .dashboard {
            padding: 15px;
          }
          
          .data-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .map-wrapper {
            height: 450px;
          }
        }

        /* Mobile Layout */
        @media (max-width: 767px) {
          .dashboard {
            padding: 10px;
          }

          .map-panel, .data-panel {
            padding: 20px;
          }

          .data-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .map-wrapper {
            height: 400px;
          }

          .data-card {
            padding: 15px;
          }

          .data-icon {
            width: 40px;
            height: 40px;
            margin-right: 12px;
          }

          .map-legend {
            position: absolute;
            bottom: 15px;
            left: 15px;
            right: 15px;
            width: 110px;
            box-sizing: border-box;
            padding: 8px 10px;
            font-size: 11px;
          }

          .legend-title {
            font-weight: 600;
            margin-bottom: 6px;
            color: #333;
            font-size: 11px;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 3px;
            color: #555;
          }

          .legend-item svg {
            width: 12px;
            height: 12px;
          }

          .legend-item span {
            font-size: 10px;
          }
        }

        /* Very small mobile screens */
        @media (max-width: 480px) {
          .description {
            padding: 15px;
          }

          .map-wrapper {
            height: 350px;
          }

          .data-grid {
            grid-template-columns: 1fr;
          }

          .station-name {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;