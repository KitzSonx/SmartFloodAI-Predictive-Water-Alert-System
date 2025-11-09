// src/component/OperationalMap/OperationalMap.tsx

import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindowF } from '@react-google-maps/api';


// --- กำหนด Style ให้กับแผนที่ ---
const containerStyle = {
  width: '100%',
  height: '100%'
};

// --- ตำแหน่งศูนย์กลางของแผนที่ (เช่น ภาคเหนือของไทย) ---
const center = {
  lat: 19.5,
  lng: 99.5
};

// --- Interface สำหรับข้อมูลสถานีที่เราจะรับเข้ามา ---
interface Station {
  id: string;
  name: string;
  status: 'critical' | 'warning' | 'normal';
  position: {
    lat: number;
    lng: number;
  };
  waterLevel?: number;
  flowRate?: number;
  rainfall?: number;
  lastUpdate?: string;
}

interface OperationalMapProps {
  stations: Station[];
}

// --- URL ของไอคอนหมุดแบบต่างๆ (คุณสามารถใช้ URL รูปภาพของคุณเองได้) ---
const icons = {
  critical: {
    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  },
  warning: {
    url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  },
  normal: {
    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  }
};


const OperationalMap: React.FC<OperationalMapProps> = ({ stations }) => {
  // --- โหลด Google Maps Script ---
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBVoecDfOQ8rzddUr2C1hsAsaUGSvvvU4I"
  });

  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const handleMarkerClick = (markerId: string) => {
    setActiveMarker(markerId);
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };


  if (!isLoaded) {
    return <div>กำลังโหลดแผนที่...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8} // ปรับระดับการซูมตามความเหมาะสม
    >
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={station.position}
          title={station.name}
          icon={icons[station.status]}
          onClick={() => handleMarkerClick(station.id)}
        >
          {activeMarker === station.id && (
            <InfoWindowF
              position={station.position}
              onCloseClick={handleInfoWindowClose}
            >
              <div style={{ padding: '5px' }}>
                <h4>📍{station.name}</h4>
                <p><strong>💧ระดับน้ำ:</strong> {station.waterLevel?.toFixed(2) ?? 'N/A'} ม.</p>
                <p><strong>🌊อัตราการไหล:</strong> {station.flowRate?.toFixed(2) ?? 'N/A'} ลบ.ม./วินาที</p>
                <p><strong>🌧️ปริมาณฝน (15 นาที):</strong> {station.rainfall?.toFixed(2) ?? 'N/A'} มม.</p>
                <p><small>🔄อัปเดตล่าสุด: {station.lastUpdate ?? 'N/A'}</small></p>
              </div>
            </InfoWindowF>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
}

export default OperationalMap;