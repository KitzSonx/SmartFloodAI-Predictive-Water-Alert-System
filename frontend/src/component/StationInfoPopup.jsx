import React from 'react';

// Station Info Popup for Map
const StationInfoPopup = ({ show, onClose, station }) => {
    if (!show || !station) return null;
  
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
  
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn 0.3s ease-in"
      }}
      onClick={onClose}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              fontWeight: "600",
              color: "#1e3a8a",
              margin: 0
            }}>
              📍 ข้อมูลสถานี
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "28px",
                cursor: "pointer",
                color: "#6b7280",
                lineHeight: 1,
                padding: "0 8px"
              }}
            >
              ×
            </button>
          </div>
  
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px"
          }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px" }}>
              {station.STN_Name}
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              {station.isSource && "🔵 สถานีต้นทาง"}
              {station.isDestination && "🔴 สถานีปลายทาง"}
              {!station.isSource && !station.isDestination && "📍 สถานีวัดระดับน้ำ"}
            </div>
          </div>
  
          <div style={{
            background: "#f9fafb",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <div style={{
              display: "grid",
              gap: "16px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: "white",
                borderRadius: "8px"
              }}>
                <span style={{ color: "#6b7280", fontWeight: "500" }}>💧 ระดับน้ำ</span>
                <span style={{
                  color: "#1e3a8a",
                  fontWeight: "700",
                  fontSize: "1.3rem"
                }}>
                  {station.waterLevel} ม.
                </span>
              </div>
  
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: "white",
                borderRadius: "8px"
              }}>
                <span style={{ color: "#6b7280", fontWeight: "500" }}>🌊 อัตราการไหล</span>
                <span style={{
                  color: "#1e3a8a",
                  fontWeight: "700",
                  fontSize: "1.2rem"
                }}>
                  {station.flowRate} ม³/วินาที
                </span>
              </div>
  
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: "white",
                borderRadius: "8px"
              }}>
                <span style={{ color: "#6b7280", fontWeight: "500" }}>🌧️ ปริมาณฝน</span>
                <span style={{
                  color: "#1e3a8a",
                  fontWeight: "700",
                  fontSize: "1.2rem"
                }}>
                  {station.rainfall} มม.
                </span>
              </div>
  
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                background: "white",
                borderRadius: "8px"
              }}>
                <span style={{ color: "#6b7280", fontWeight: "500" }}>⚠️ สถานะ</span>
                <span style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  background: getStatusColor(station.waterLevel),
                  color: "white",
                  fontWeight: "600",
                  fontSize: "1rem"
                }}>
                  {getStatusText(station.waterLevel)}
                </span>
              </div>
            </div>
          </div>
  
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(to right, #7367f0, #9e95f5)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            ปิด
          </button>
        </div>
      </div>
    );
  };

  export default StationInfoPopup;