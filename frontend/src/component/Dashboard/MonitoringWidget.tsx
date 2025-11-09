// src/component/Dashboard/MonitoringWidget.tsx
import React from 'react';
import { MergedStation, StationStatus } from '../../types/dashboard';

interface Props {
  criticalStations: MergedStation[];
  stationStatus: StationStatus;
}

const MonitoringWidget: React.FC<Props> = ({ criticalStations, stationStatus }) => {
  return (
    <section className="dashboard-card monitoring-card">
      <div className="card-header">
        <h2>🚦 สรุปสถานการณ์และสถานีเฝ้าระวัง ({criticalStations.length} สถานี)</h2>
      </div>
      <div className="monitoring-list">
        <br />
        <div className="status-summary">
          <div className="summary-card normal">
            <div className="summary-content">
              <span className="summary-icon">✅</span>
              <p>สถานีปกติ</p>
            </div>
            <span className="summary-value">{stationStatus.normal}</span>
          </div>
          <div className="summary-card warning">
            <div className="summary-content">
              <span className="summary-icon">⚠️</span>
              <p>สถานีเฝ้าระวัง</p>
            </div>
            <span className="summary-value">{stationStatus.warning}</span>
          </div>
          <div className="summary-card critical">
            <div className="summary-content">
              <span className="summary-icon">🚨</span>
              <p>สถานีวิกฤติ</p>
            </div>
            <span className="summary-value">{stationStatus.critical}</span>
          </div>
        </div>
        <br />
        {criticalStations.length > 0 ? (
          <table className="monitoring-table">
            <thead>
              <tr>
                <th>สถานี</th>
                <th>ระดับน้ำ (ม.)</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {criticalStations.map(station => (
                <tr key={station.STN_ID}>
                  <td>{station.name}</td>
                  <td>{station.waterLevel.toFixed(2)}</td>
                  <td>
                    <span className={`status-dot ${station.status}`}></span>
                    {station.status === 'critical' ? 'อันตราย' : 'เฝ้าระวัง'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-critical">ทุกสถานีอยู่ในสถานะปกติ</p>
        )}
      </div>
    </section>
  );
};

export default MonitoringWidget;