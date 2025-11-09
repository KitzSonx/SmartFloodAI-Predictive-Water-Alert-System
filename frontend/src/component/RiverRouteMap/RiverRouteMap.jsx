// RiverRouteMap.jsx
import React from 'react';
import './RiverRouteMap.css';
import watermap from "../../assets/Watermap2.png";
import mapicon from "../../assets/mapicon.png";

const riverInfoData = [
  {
    type: 'about',
    title: 'เกี่ยวกับแม่น้ำกก',
    content: 'น้ำแม่กกหรือแม่น้ำกก เป็นแม่น้ำสายสำคัญสายหนึ่งในภาคเหนือของประเทศไทย มีต้นกำเนิดจากทิวเขาแดนลาวและทิวเขาผีปันน้ำตอนเหนือของเมืองกก จังหวัดเชียงตุง ภายในอาณาเขตของรัฐฉานในประเทศพม่า'
  },
  {
    type: 'route',
    title: 'เส้นทางการไหล',
    content: 'ไหลเข้าสู่ประเทศไทยที่ช่องน้ำแม่กก อำเภอแม่อาย จังหวัดเชียงใหม่ ไหลมาเรื่อย ๆ จนผ่านตัวอำเภอเมืองเชียงราย หลังจากนั้นก็ไหลลงสู่แม่น้ำโขง ที่บริเวณสบกก อำเภอเชียงแสน จังหวัดเชียงราย'
  },
  {
    type: 'details',
    title: 'ข้อมูลทั่วไป',
    details: [
      { label: 'ความยาวรวม', value: '285 กิโลเมตร' },
      { label: 'ในประเทศไทย', value: '130 กิโลเมตร' },
      { label: 'ลำน้ำสาขาสำคัญ', value: 'น้ำแม่ฝาง น้ำแม่ลาว น้ำแม่กรณ์ น้ำแม่สรวย' }
    ]
  }
];

const InfoBox = ({ type, title, content, details }) => (
  <div className={`info-box ${type}`}>
    <div className="info-label">{title}</div>
    <div className="info-content">
      {content}
      {details && (
        <div className="detail-list">
          {details.map((item, index) => (
            <div className="detail-item" key={index}>
              <strong>{item.label}:</strong> {item.value}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const RiverRouteMap = () => {
  return (
    <div className="river-route-container">
      <div className="departmentinfo">
        <img src={mapicon} alt="กรมอุตุนิยมวิทยา" className="departmentlogo" />
        <h3 className="departmenttitle">
          แผนที่เส้นทางแม่น้ำ
        </h3>
      </div>
      
      <div className="river-content">
        <div className="map-section">
          <img 
            src={watermap} 
            alt="แผนที่เส้นทางแม่น้ำกก"
            className="river-map"
          />
        </div>
        
        <div className="info-section">
          {riverInfoData.map((info, index) => (
            <InfoBox 
              key={index}
              type={info.type}
              title={info.title}
              content={info.content}
              details={info.details}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiverRouteMap;