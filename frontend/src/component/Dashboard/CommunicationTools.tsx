// src/component/Dashboard/CommunicationTools.tsx
import React from 'react';

const CommunicationTools: React.FC = () => {
  return (
    <section className="dashboard-card communication-card">
      <div className="card-header">
        <h2>📢 เครื่องมือสื่อสาร</h2>
      </div>
      <div className="communication-tools">
        <button className="tool-btn">📱 ส่งแจ้งเตือน LINE</button>
        <button className="tool-btn">📧 ส่งอีเมลแจ้งเตือน</button>
        <button className="tool-btn">📄 สร้างรายงานสรุป</button>
        <button className="tool-btn">🔊 ประกาศฉุกเฉิน</button>
      </div>
    </section>
  );
};

export default CommunicationTools;