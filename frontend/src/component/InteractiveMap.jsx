import React, { useState } from 'react';
import StationInfoPopup from './StationInfoPopup.jsx';
import watermap from '../assets/Watermap2.png';

// Interactive Map Component
const InteractiveMap = ({ stations, onStationClick }) => {
    const [hoveredStation, setHoveredStation] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [showStationPopup, setShowStationPopup] = useState(false);
    const [popupStation, setPopupStation] = useState(null);
  
    const getStationColor = (waterLevel) => {
      if (waterLevel >= 7) return "#7f1d1d"; // วิกฤติ - แดงเข้ม
      if (waterLevel >= 6) return "#dc2626"; // เตรียมอพยพ - แดง
      if (waterLevel >= 5.5) return "#f97316"; // เฝ้าระวัง - ส้ม
      return "#16a34a"; // ปกติ - เขียว
    };
  
    const handleStationClick = (station) => {
      setSelectedStation(station);
      setPopupStation(station);
      setShowStationPopup(true);
      onStationClick(station);
    };
  
    return (
      <>
        <StationInfoPopup
          show={showStationPopup}
          onClose={() => {
            setShowStationPopup(false);
            setPopupStation(null);
          }}
          station={popupStation}
        />
  
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
            fontWeight: "600",
            color: "#1e3a8a",
            marginBottom: "8px",
            textAlign: "center"
          }}>
            🗺️ แผนที่สถานีตรวจวัดน้ำ
          </h2>
          <p style={{
            fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "20px"
          }}>
            *คลิกจุดเพื่อดูข้อมูลสถานี*
          </p>
  
          <div style={{
            position: "relative",
            width: "100%",
            height: "500px",
            borderRadius: "12px",
            overflow: "hidden",
            background: "white",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <svg viewBox="0 0 1000 800" style={{ width: "100%", height: "100%" }}>
              <image href={watermap} x="0" y="0" width="1000" height="800" />
              
              {stations.map(station => {
                const stationColor = getStationColor(station.waterLevel);
                const isSelected = selectedStation?.STN_ID === station.STN_ID;
                
                return (
                  <g key={station.STN_ID}>
                    {isSelected && (
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r="0"
                        fill="none"
                        stroke={stationColor}
                        strokeWidth="3"
                        opacity="0.8"
                      >
                        <animate attributeName="r" from="0" to="35" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    
                    {station.isSource && (
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r="30"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        opacity="0.6"
                      />
                    )}
                    
                    {station.isDestination && (
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r="30"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        opacity="0.6"
                      />
                    )}
                    
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={isSelected ? 25 : 21}
                      fill={stationColor}
                      stroke="#fff"
                      strokeWidth={isSelected ? 3 : 2}
                      onClick={() => handleStationClick(station)}
                      onMouseEnter={() => setHoveredStation(station.STN_ID)}
                      onMouseLeave={() => setHoveredStation(null)}
                      style={{ 
                        cursor: "pointer", 
                        filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))",
                        transition: "all 0.3s ease"
                      }}
                    />
                    
                    {(isSelected || hoveredStation === station.STN_ID) && (
                      <g>
                        <rect
                          x={station.x - (station.STN_Name.length * 6 + 20)}
                          y={station.y - 50}
                          width={station.STN_Name.length * 12 + 40}
                          height="45"
                          rx="8"
                          fill="rgba(30, 60, 114, 0.95)"
                          stroke="rgba(255, 255, 255, 0.3)"
                          strokeWidth="1"
                          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
                        />
                        <text
                          x={station.x}
                          y={station.y - 28}
                          textAnchor="middle"
                          fill="white"
                          fontSize="18"
                          fontWeight="600"
                        >
                          {station.STN_Name}
                        </text>
                        <text
                          x={station.x}
                          y={station.y - 12}
                          textAnchor="middle"
                          fill="#93c5fd"
                          fontSize="14"
                          fontWeight="500"
                        >
                          {station.waterLevel} ม.
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
  
            <div style={{
              position: "absolute",
              bottom: "15px",
              left: "15px",
              background: "rgba(255, 255, 255, 0.95)",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "8px", color: "#333" }}>คำอธิบาย</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", color: "#555" }}>
                <svg width="16" height="16">
                  <circle cx="8" cy="8" r="6" fill="#16a34a" stroke="#fff" strokeWidth="2" />
                </svg>
                <span>ปกติ</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", color: "#555" }}>
                <svg width="16" height="16">
                  <circle cx="8" cy="8" r="6" fill="#f97316" stroke="#fff" strokeWidth="2" />
                </svg>
                <span>เฝ้าระวัง</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", color: "#555" }}>
                <svg width="16" height="16">
                  <circle cx="8" cy="8" r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />
                </svg>
                <span>เตรียมอพยพ</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#555" }}>
                <svg width="16" height="16">
                  <circle cx="8" cy="8" r="6" fill="#7f1d1d" stroke="#fff" strokeWidth="2" />
                </svg>
                <span>วิกฤติ</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  export default InteractiveMap;