import React, { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush
} from "recharts";
import "./DataExplorerChart.css";

const createXAxisFormatter = () => {
  let lastDisplayedDate = null;

  return (tickItem) => {
    const date = new
 
Date(tickItem);
    const dateString = date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

    if (dateString !== lastDisplayedDate) {
      lastDisplayedDate = dateString;
      return dateString;
    } else {
      return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  };
};


const generateTimeTicks = (data) => {
    if (!data || data.length < 2) return [];
    
    const startTime = data[0].timestamp;
    const endTime = data[data.length - 1].timestamp;
    const duration = endTime - startTime;

    const ONE_HOUR = 60 * 60 * 1000;
    const ONE_DAY = 24 * ONE_HOUR;

    let interval;


    if (duration <= 2 * ONE_DAY) { // น้อยกว่าหรือเท่ากับ 2 วัน
      interval = 3 * ONE_HOUR; // แบ่งทุก 3 ชั่วโมง
    } else if (duration <= 7 * ONE_DAY) { // น้อยกว่าหรือเท่ากับ 1 สัปดาห์
      interval = 6 * ONE_HOUR; // แบ่งทุก 6 ชั่วโมง
    } else if (duration <= 31 * ONE_DAY) { // น้อยกว่าหรือเท่ากับ 1 เดือน
      interval = 1 * ONE_DAY; // แบ่งทุก 1 วัน
    } else if (duration <= 90 * ONE_DAY) { // น้อยกว่าหรือเท่ากับ 3 เดือน
      interval = 3 * ONE_DAY; // แบ่งทุก 3 วัน
    } else { // มากกว่า 3 เดือน
      interval = 7 * ONE_DAY; // แบ่งทุก 1 สัปดาห์
    }

    const ticks = [];
    let currentTick = startTime;
    while (currentTick <= endTime) {
      ticks.push(currentTick);
      currentTick += interval;
    }
    return ticks;
};


const DataExplorerChart = ({ data, title, onClose }) => {
  
  const timeTicks = useMemo(() => generateTimeTicks(data), [data]);
  

  const formatXAxis = useMemo(() => createXAxisFormatter(), [data]);

  const isComparison = data.length > 0 && ('level_nawang' in data[0] || 'level_mengrai' in data[0]);

  return (
    <div className="data-explorer-chart-overlay">
      <div className="data-explorer-chart-container">
        <div className="chart-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                ticks={timeTicks}
                tickFormatter={formatXAxis}
                angle={0} 
                textAnchor="middle"
                height={60}
                interval={0}
                scale="time"
                type="number"
                domain={['dataMin', 'dataMax']}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                label={{ value: 'ระดับน้ำ (ม.)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : 0}
              />
              <Tooltip 
                labelFormatter={(label) => new Date(label).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                formatter={(value, name) => {
                    const formattedValue = typeof value === 'number' ? value.toFixed(2) : "N/A";
                    return [`${formattedValue} ม.`, name];
                }}
              />
              <Legend />
              {isComparison ? (
                  <>
                    <Line type="monotone" dataKey="level_nawang" name="ท่าตอน (ต้นทาง)" stroke="#007bff" strokeWidth={3} dot={false} connectNulls={true} />
                    <Line type="monotone" dataKey="level_mengrai" name="พ่อขุนฯ (ปลายทาง)" stroke="#dc3545" strokeWidth={3} dot={false} connectNulls={true} />
                  </>
                ) : (
                  <>
                    <Line type="monotone" dataKey="level" name="ระดับน้ำ" stroke="#1e90ff" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                  </>
              )}
              
              <Brush 
                dataKey="timestamp" 
                height={30} 
                stroke="#8884d8" 
                tickFormatter={(tickItem) => new Date(tickItem).toLocaleDateString('th-TH', {day: 'numeric', month: 'short'})}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataExplorerChart;