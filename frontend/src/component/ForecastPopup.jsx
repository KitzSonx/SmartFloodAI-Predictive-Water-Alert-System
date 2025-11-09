import React, { useState } from 'react';
import WaterLevelForecastAreaChart from './WaterLevelForecastAreaChart.jsx';

// Forecast Popup Component - แสดงกราฟแนวโน้ม
const ForecastPopup = ({ show, onClose, station }) => {
    const [selectedDuration, setSelectedDuration] = useState('7h');

    if (!show) return null;

    const stationApiMap = {
        "TC030113": "nawang",
        "TC030114": "mengrai"
    };
    const apiStationId = stationApiMap[station.STN_ID];

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
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
                padding: "25px 15px",
                maxWidth: "900px",
                width: "95%", 
                maxHeight: "85vh",
                overflow: "auto",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                animation: "slideUp 0.3s ease-out"
            }}
                onClick={(e) => e.stopPropagation()}>


                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                    paddingLeft: "10px",
                    paddingRight: "10px"
                }}>
                    <h2 style={{
                        fontSize: "clamp(1.1rem, 2.8vw, 1.5rem)",
                        fontWeight: "600",
                        color: "#1e3a8a",
                        margin: 0,
                        lineHeight: 1.3
                    }}>
                        📊 กราฟระดับน้ำ ({selectedDuration === '7h' ? '7 ชม.' : selectedDuration === '12h' ? '12 ชม.' : selectedDuration === '1d' ? '1 วัน' : selectedDuration === '3d' ? '3 วัน' : '7 วัน'})
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none", border: "none",
                            fontSize: "26px", cursor: "pointer",
                            color: "#6b7280", lineHeight: 1, padding: "0 5px"
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* --- Station Name Banner --- */}
                <div style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white", padding: "12px 15px",
                    borderRadius: "12px", marginBottom: "15px",
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "3px" }}>
                        {station.STN_Name}
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                        {station.isSource && "🔵 สถานีต้นทาง"}
                        {station.isDestination && "🔴 สถานีปลายทาง"}
                    </div>
                </div>

                {/* --- Duration Selector --- */}
                <div className="duration-selector" style={{
                    marginBottom: '15px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',     
                    gap: '5px'          
                 }}>
                    <button onClick={() => setSelectedDuration('7h')} className={selectedDuration === '7h' ? 'active' : ''}>7 ชม.</button>
                    <button onClick={() => setSelectedDuration('12h')} className={selectedDuration === '12h' ? 'active' : ''}>12 ชม.</button>
                    <button onClick={() => setSelectedDuration('1d')} className={selectedDuration === '1d' ? 'active' : ''}>1 วัน</button>
                    <button onClick={() => setSelectedDuration('3d')} className={selectedDuration === '3d' ? 'active' : ''}>3 วัน</button>
                    <button onClick={() => setSelectedDuration('7d')} className={selectedDuration === '7d' ? 'active' : ''}>7 วัน</button>
                </div>

                {/* --- Chart Container --- */}
                <div style={{
                    background: "#f9fafb",
                    borderRadius: "12px",
                    padding: "10px 5px",
                    marginBottom: "20px",
                    minHeight: "350px"
                }}>
                    {(() => {
                        if (!apiStationId) {
                            return <p /*...*/ > ไม่มีข้อมูลกราฟคาดการณ์สำหรับสถานีนี้ </p>;
                        }
                        return (
                            <WaterLevelForecastAreaChart
                                stationId={apiStationId}
                                stationName={station.STN_Name}
                                duration={selectedDuration}
                            />
                        );
                    })()}
                </div>

                {/* --- Close Button --- */}
                <button
                    onClick={onClose}
                    style={{
                        width: "100%", padding: "12px",
                        background: "linear-gradient(to right, #7367f0, #9e95f5)",
                        color: "white", border: "none", borderRadius: "10px",
                        fontSize: "0.95rem", fontWeight: "600", cursor: "pointer"
                    }}
                >
                    ปิด
                </button>
            </div>
        </div>
    );
};

export default ForecastPopup;