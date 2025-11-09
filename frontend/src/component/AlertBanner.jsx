import React from 'react';

// Alert Banner Component
const AlertBanner = ({ status, message, trend }) => {
  const getStatusConfig = () => {
    switch(status) {
      case "วิกฤติ":
        return { bg: "#7f1d1d", icon: "🚨", text: "white" };
      case "เตรียมอพยพ":
        return { bg: "#dc2626", icon: "⚠️", text: "white" };
      case "เฝ้าระวัง":
        return { bg: "#f97316", icon: "⚡", text: "white" };
      default:
        return { bg: "#26cb62ff", icon: "✅", text: "white" };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={{
      background: config.bg,
      color: config.text,
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      animation: "fadeIn 0.5s ease-in"
    }}>
      <div style={{
        fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
        fontWeight: "700",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap"
      }}>
        <span style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}>{config.icon}</span>
        <span>สถานการณ์น้ำแม่น้ำกก: <strong>{status}</strong></span>
      </div>
      {message && (
        <div style={{
          marginTop: "10px",
          fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
          textAlign: "center",
          opacity: 0.95
        }}>
          {message}
        </div>
      )}
      {trend && (
        <div style={{
          marginTop: "8px",
          fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
          textAlign: "center",
          opacity: 0.9
        }}>
          📈 แนวโน้ม: {trend}
        </div>
      )}
    </div>
  );
};

export default AlertBanner;