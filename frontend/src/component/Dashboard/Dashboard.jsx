import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Dashboard.css";
import rainfall from "../../assets/rainfall.png";
import waterflow from "../../assets/waterflow.png";
import waterlevel from "../../assets/waterlevel.png";
import accumulate from "../../assets/accumulate.png";

const stationList = [
  { STN_ID: "TC030114", STN_Name: "สะพานพ่อขุนเม็งรายมหาราช (สถานีหลัก)" }, // สถานีหลัก
  { STN_ID: "TC030226", STN_Name: "โรงเรียนไชยปราการ" },
  { STN_ID: "TC030227", STN_Name: "สะพานบ้านสบมาว" },
  { STN_ID: "TC030113", STN_Name: "สะพานมิตรภาพแม่นาวาง-ท่าตอน" },
  { STN_ID: "TC030317", STN_Name: "สะพานบ้านสันมะเค็ด" },
  { STN_ID: "TC030318", STN_Name: "สะพานบ้านป่ารวก" },
  { STN_ID: "TC030115", STN_Name: "สะพานบ้านสบกก" },
  { STN_ID: "TC020510", STN_Name: "โรงเรียนอนุบาลดอกคำใต้ (ชุมชนสันช้างหิน)" },
  { STN_ID: "TC020511", STN_Name: "โรงเรียนบ้านร่องปอ" },
  { STN_ID: "TC020603", STN_Name: "โรงเรียนบ้านหนองบัว" },
  { STN_ID: "TC020512", STN_Name: "สะพานพระธรรมมิกราช" },
  { STN_ID: "TC020705", STN_Name: "โรงเรียนบ้านหย่วน (เชียงคำนาคโวาท)" },
  { STN_ID: "TC020805", STN_Name: "สะพานบ้านป่าข่า" },
  { STN_ID: "TC020903", STN_Name: "สะพานบ้านหล่ายงาว" },
  { STN_ID: "TC020309", STN_Name: "สะพานบ้านแม่คำสบเป็น" },
];

const options = stationList.map((station) => ({
  value: station.STN_ID,
  label: station.STN_Name,
}));

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: state.isFocused ? '#80bdff' : 'rgba(255, 255, 255, 0.85)',
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : 'none',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#ccc',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.89)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? 'rgba(255, 255, 255, 0.74)' : 'transparent',
    color: 'white',
    cursor: 'pointer',
    "&:hover": {
        backgroundColor: 'rgba(255, 255, 255, 0.82)',
    }
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
};


const Dashboard = () => {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("--:--");
  
  const [selectedOption, setSelectedOption] = useState(options.find(option => option.value === "TC030114"));

  useEffect(() => {
    if (selectedOption) {
      fetchData(selectedOption.value);
    }
  }, [selectedOption]);

  const fetchData = (stationId) => {
    fetch("/proxy.php")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          const station = json.find((s) => s.STN_ID === stationId);
          if (station) {
            setData(station);
            setLastUpdate(station.LAST_UPDATE || "--:--");
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching water data:", err);
      });
  };

  const handleStationChange = (selected) => {
    setSelectedOption(selected);
  };

  return (
    <section className="dashboard-section">
      <div className="home">
        <div className="feed-1">
          <div className="station-select" style={{ width: '100%', maxWidth: '350px' }}>
            <label htmlFor="station-selector" style={{ color: "white", marginRight: "10px", marginBottom: '5px', display: 'block' }}>
              หากต้องการข้อมูลน้ำปัจจุบันที่สถานีอื่น ๆ :
            </label>
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

          <h1 style={{ color: "white", fontSize: "1.3rem", marginTop: "5px" }} id="stationName">
            สถานีตรวจวัดน้ำ : {data?.STN_Name || "กำลังโหลด..."}
          </h1>

          <div className="data-grid">
            <div id="waterLevelPoint" className="data-point">
                <img src={waterlevel} alt="ระดับน้ำ" style={{ width: "50px", marginRight: "10px" }} />
                <div className="text">
                <div className="label">ระดับน้ำ</div>
                <div className="value">
                    <span>{data?.CURR_Water_D_Level_MSL || "--"}</span> ม.รทก.
                </div>
                </div>
            </div>

            <div className="data-point">
                <img src={waterflow} alt="อัตราการไหล" style={{ width: "40px", marginRight: "10px" }} />
                <div className="text">
                <div className="label">อัตราการไหล</div>
                <div className="value">
                    <span>{data?.CURR_FLOW || "--"}</span> ลบ.ม./วิ
                </div>
                </div>
            </div>

            <div className="data-point">
                <img src={accumulate} alt="ฝนสะสม" style={{ width: "50px", marginRight: "10px" }} />
                <div className="text">
                <div className="label">ฝนสะสม 15 นาที</div>
                <div className="value">
                    <span>{data?.CURR_Acc_Rain_15_M || "--"}</span> มม.
                </div>
                </div>
            </div>

            <div className="data-point">
                <img src={rainfall} alt="ฝน 30 นาที" style={{ width: "50px", marginRight: "10px" }} />
                <div className="text">
                <div className="label">ฝนสะสม 30 นาที</div>
                <div className="value">
                    <span>{data?.CURR_Acc_Rain_30_M || "--"}</span> มม.
                </div>
                </div>
            </div>
          </div>

          <p className="last-update" style={{ color: "white" }}>
            อัปเดตล่าสุด: <span id="lastUpdate">{lastUpdate}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;