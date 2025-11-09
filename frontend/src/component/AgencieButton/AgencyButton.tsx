import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AgencieButton.css';

const AgencyButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      className="agency-fab"
      onClick={() => navigate('/agency-dashboard')}
      title="สำหรับเจ้าหน้าที่"
    >
      <span className="agency-fab-icon">👨‍💼</span>
      <span className="agency-fab-text">เจ้าหน้าที่</span>
    </button>
  );
};

export default AgencyButton;