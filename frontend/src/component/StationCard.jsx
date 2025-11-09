import React, { useState } from 'react';
import ForecastPopup from './ForecastPopup.jsx';
import waterlevel from '../assets/waterlevel.png';

// Station Card Component
const StationCard = ({ station, onViewForecast }) => {
    const [showForecastPopup, setShowForecastPopup] = useState(false);
  
    const getStatusColor = (level) => {
      if (level >= 7) return "#7f1d1d";
      if (level >= 6) return "#dc2626";
      if (level >= 5.5) return "#f97316";
      return "#16a34a";
    };
  
    const getStatusText = (level) => {
      if (level >= 7) return "วิกฤติ";
      if (level >= 6) return "เตรียมอพยพ";
      if (level >= 5.5) return "เฝ้าระวัง";
      return "ปกติ";
    };
  
    const getTrendIcon = (trend) => {
      if (trend > 0) return "↗️";
      if (trend < 0) return "↘️";
      return "➡️";
    };
  
    const handleForecastClick = (hours) => {
      setShowForecastPopup(true);
    };
  
    return (
      <>
        <ForecastPopup
          show={showForecastPopup}
          onClose={() => setShowForecastPopup(false)}
          station={station}
        />
        
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={waterlevel} alt="water level" style={{
                width: "40px",
                height: "40px",
                marginRight: "12px"
              }} />
              <h3 style={{
                fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                fontWeight: "600",
                color: "#1e3a8a",
                margin: 0
              }}>
                {station.STN_Name}
              </h3>
            </div>
            {station.isSource && (
              <span style={{
                background: "#3b82f6",
                color: "white",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "0.8rem",
                fontWeight: "600"
              }}>
                ต้นทาง
              </span>
            )}
            {station.isDestination && (
              <span style={{
                background: "#ef4444",
                color: "white",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "0.8rem",
                fontWeight: "600"
              }}>
                ปลายทาง
              </span>
            )}
          </div>
  
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            marginBottom: "12px"
          }}>
            <span style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "700",
              color: "#2c3e50"
            }}>
              {station.currentLevel}
            </span>
            <span style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#6b7280"
            }}>
              ม.
            </span>
            <span style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              marginLeft: "8px"
            }}>
              {getTrendIcon(station.trend)}
            </span>
          </div>
  
          <div style={{
            display: "inline-block",
            padding: "8px 16px",
            borderRadius: "20px",
            background: getStatusColor(station.currentLevel),
            color: "white",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            fontWeight: "600",
            marginBottom: "16px"
          }}>
            {getStatusText(station.currentLevel)}
          </div>
  
          <div style={{
            fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)",
            color: "#6b7280",
            marginBottom: "16px"
          }}>
            อัปเดตล่าสุด: {station.lastUpdate}
          </div>
  
          { (station.STN_ID === "TC030113" || station.STN_ID === "TC030114") && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "10px"
            }}>
              <button
                onClick={handleForecastClick}
                style={{
                  padding: "12px",
                  background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "clamp(0.85rem, 2vw, 1rem)",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.02)";
                  e.target.style.boxShadow = "0 4px 15px rgba(6, 182, 212, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                📊 กราฟคาดการณ์ 3 ชม.
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  export default StationCard;