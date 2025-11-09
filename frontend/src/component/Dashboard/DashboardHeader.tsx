// src/component/Dashboard/DashboardHeader.tsx
import React from 'react';

interface Props {
  onLogout: () => void;
}

const DashboardHeader: React.FC<Props> = ({ onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>🎛️ ศูนย์บัญชาการสถานการณ์น้ำ</h1>
        <p className="subtitle">Water Situation Command Center</p>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">👨‍💼 เจ้าหน้าที่</span>
          <button className="logout-btn" onClick={onLogout}>
            ออกจากระบบ
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;