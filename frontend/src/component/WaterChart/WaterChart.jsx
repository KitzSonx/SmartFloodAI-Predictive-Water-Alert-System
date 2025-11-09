import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];

const StockTrendChart = () => {
  return (
    <div style={{ width: '50%', height: 100 }}>
      <LineChart width={600} height={300} data={data}>
        <Line dataKey="uv" />
      </LineChart>
    </div>
  );
};

export default StockTrendChart;
