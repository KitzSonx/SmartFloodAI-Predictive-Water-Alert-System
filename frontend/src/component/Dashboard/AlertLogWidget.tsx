// src/component/Dashboard/AlertLogWidget.tsx
import React from 'react';
import { AlertLog } from '../../types/dashboard';

interface Props {
  alertLogs: AlertLog[];
}

const AlertLogWidget: React.FC<Props> = ({ alertLogs }) => {
  return (
    <section className="dashboard-card alert-card">
      <div className="card-header">
        <h2>🔔 บันทึกการแจ้งเตือน</h2>
      </div>
      <div className="alert-log">
        {alertLogs.map((log) => (
          <div key={log.id} className={`alert-item ${log.level}`}>
            <div className="alert-time">{log.timestamp}</div>
            <div className="alert-content">
              <strong>{log.station}</strong>
              <p>{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlertLogWidget;