import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import waterlev from "../assets/waterlevel2.png";

// --- Function คำนวณ Ticks ---
const calculateTicks = (data, duration) => {
    if (!data || data.length < 2) return undefined; // ต้องมีข้อมูลอย่างน้อย 2 จุด

    const startTime = data[0].timestamp;
    const endTime = data[data.length - 1].timestamp;
    let intervalMs; // ระยะห่าง Tick (ms)

    // กำหนด Interval
    // (ปรับค่าได้ตามความเหมาะสม)
    switch (duration) {
        case '7d': intervalMs = 24 * 60 * 60 * 1000; break; // ทุก 1 วัน
        case '3d': intervalMs = 12 * 60 * 60 * 1000; break; // ทุก 12 ชม.
        case '1d': intervalMs = 4 * 60 * 60 * 1000; break;  // ทุก 4 ชม.
        case '12h': intervalMs = 2 * 60 * 60 * 1000; break; // ทุก 2 ชม.
        default: intervalMs = 1 * 60 * 60 * 1000; break;   // ทุก 1 ชม. ('7h')
    }

    const ticks = [];

    const startDate = new Date(startTime);

    startDate.setMinutes(0, 0, 0);
    let currentTick = startDate.getTime();


    if (currentTick < startTime) {
       ticks.push(currentTick);
    } else if (currentTick > startTime && ticks.length === 0) {
       ticks.push(startTime);
       currentTick = startTime - (startTime % intervalMs) + intervalMs;
    }


    while (currentTick <= endTime) {
        if (ticks.length === 0 || currentTick - ticks[ticks.length - 1] >= intervalMs * 0.9) {
             ticks.push(currentTick);
        }
        currentTick += intervalMs;
    }

     if (ticks[ticks.length - 1] < endTime) {
        ticks.push(endTime);
     }



    const uniqueTicks = [...new Set(ticks)].filter(t => t >= startTime && t <= endTime);


    if (uniqueTicks.length < 3) return undefined;

    return uniqueTicks;
};


function WaterLevelForecastAreaChart({
  stationId,
  stationName,
  duration = "7h",
}) {
  const [processedData, setProcessedData] = useState([]);
  const [currentHourName, setCurrentHourName] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [currentWaterLevel, setCurrentWaterLevel] = useState(null);
  const [trend, setTrend] = useState("");
  const [dangerLevel, setDangerLevel] = useState("");
  const [screenSize, setScreenSize] = useState("desktop");

    const [currentHourStartTimestampMs, setCurrentHourStartTimestampMs] = useState(() => {
        const now = new Date();
        now.setMinutes(0,0,0);
        return now.getTime();
    });
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            now.setMinutes(0,0,0);
            setCurrentHourStartTimestampMs(now.getTime());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

  useEffect(() => {
    // ถ้ายังไม่มี stationId (เช่น โหลดครั้งแรก) ก็ไม่ต้องทำอะไร
    if (!stationId) {
      setProcessedData([]); // เคลียร์ข้อมูลกราฟ
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://myweb.ac.th/get_chart_data.php?station=${stationId}&duration=${duration}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataFromApi = await response.json();

        const nowTimestamp = Date.now();
        const currentHourStartTimestamp = new Date();
        currentHourStartTimestamp.setMinutes(0, 0, 0);

        let splitIndex = dataFromApi.findIndex(
          (d) => d.timestamp >= currentHourStartTimestamp.getTime()
        );
        if (splitIndex === -1) {
          splitIndex = dataFromApi.length > 0 ? dataFromApi.length - 1 : 0;
        }

        const formattedData = dataFromApi.map((d, index) => ({
          timestamp: d.timestamp,
          currentLevel:
            index <= splitIndex ? parseFloat(d.value).toFixed(2) : null,
          forecastLevel:
            index >= splitIndex ? parseFloat(d.value).toFixed(2) : null,
        }));
        setProcessedData(formattedData);

        let currentLevel = null,
          newTrend = "ค่อนข้างคงที่",
          newDangerLevel = "ปกติ";
        if (dataFromApi[splitIndex]) {
          const current = parseFloat(dataFromApi[splitIndex].value);
          currentLevel = current.toFixed(2);
          if (current >= 7) newDangerLevel = "วิกฤติ";
          else if (current >= 6) newDangerLevel = "เตรียมอพยพ";
          else if (current >= 5.5) newDangerLevel = "เฝ้าระวัง";

          if (dataFromApi.length > splitIndex + 1) {
            const futurePoint = dataFromApi[dataFromApi.length - 1];
            if (futurePoint) {
              const future = parseFloat(futurePoint.value);
              if (future > current + 0.1) newTrend = "มีแนวโน้มเพิ่มขึ้น";
              else if (future < current - 0.1) newTrend = "มีแนวโน้มลดลง";
            }
          }
        }
        setCurrentWaterLevel(currentLevel);
        setTrend(newTrend);
        setDangerLevel(newDangerLevel);
      } catch (error) {
        console.error(
          `Failed to fetch water level data for ${stationId}:`,
          error
        );
        setProcessedData([]);
      }
    };

    fetchData();
  }, [stationId, duration]);

  useEffect(() => {
    const updateFontSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setFontSize(13);
        setScreenSize("mobile");
      } else if (width < 768) {
        setFontSize(14);
        setScreenSize("tablet");
      } else {
        setFontSize(16);
        setScreenSize("desktop");
      }
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  const customTicks = useMemo(() => calculateTicks(processedData, duration), [processedData, duration]);

  // --- Function สำหรับ format Label ของ Tooltip ---
  const formatTooltipLabel = (label) => {
      const date = new Date(label);
      return new Intl.DateTimeFormat('th-TH', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
      }).format(date);
  };

  const renderCustomLegend = () => {
    return (
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          paddingLeft: 0,
          marginBottom: 10,
          justifyContent: "center",
        }}
      >
        <li
          style={{
            marginRight: 20,
            display: "flex",
            alignItems: "center",
            color: "#1e3a8a",
            fontWeight: "500",
          }}
        >
          <svg width="14" height="14" style={{ marginRight: 6 }}>
            <line
              x1="0"
              y1="7"
              x2="14"
              y2="7"
              stroke="#1e3a8a"
              strokeWidth="2"
            />
          </svg>
          ระดับน้ำอดีต-ปัจจุบัน
        </li>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            color: "#f63b64ff",
            fontWeight: "500",
          }}
        >
          <svg width="14" height="14" style={{ marginRight: 6 }}>
            <line
              x1="0"
              y1="7"
              x2="14"
              y2="7"
              stroke="#f63b5aff"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          </svg>
          ระดับน้ำคาดการณ์
        </li>
      </ul>
    );
  };

  const getDangerColor = () => {
    switch (dangerLevel) {
      case "วิกฤติ":
        return "#7f1d1d";
      case "เตรียมอพยพ":
        return "#dc2626";
      case "เฝ้าระวัง":
        return "#f97316";
      default:
        return "#16a34a";
    }
  };


  const CustomTextLabels = ({ data, fontSize, screenSize }) => {
    if (!data || data.length === 0) return null;


    const currentLevelData = data.filter((d) => d.currentLevel !== null);
    const forecastLevelData = data.filter((d) => d.forecastLevel !== null);

    const currentMidIndex = Math.floor(currentLevelData.length / 2);
    const forecastMidIndex = Math.floor(forecastLevelData.length / 2);

 
    const getResponsiveSettings = () => {
      switch (screenSize) {
        case "mobile":
          return {
            currentX: "35%",
            forecastX: "80%",
            yPosition: "60%",
            fontSizeAdjust: fontSize - 1,
            currentText: "อดีต-ปัจจุบัน",
            forecastText: "คาดการณ์",
          };
        case "tablet":
          return {
            currentX: "45%",
            forecastX: "80%",
            yPosition: "60%",
            fontSizeAdjust: fontSize,
            currentText: "อดีต-ปัจจุบัน",
            forecastText: "คาดการณ์",
          };
        default: // desktop
          return {
            currentX: "30%",
            forecastX: "80%",
            yPosition: "60%",
            fontSizeAdjust: fontSize + 1,
            currentText: "ระดับน้ำอดีต-ปัจจุบัน",
            forecastText: "ระดับน้ำคาดการณ์",
          };
      }
    };

    const settings = getResponsiveSettings();

    return (
      <g>
        {/* Current Level Text */}
        {currentLevelData.length > 0 && currentLevelData[currentMidIndex] && (
          <text
            x={settings.currentX}
            y={settings.yPosition}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize={settings.fontSizeAdjust}
            fontWeight="bold"
            style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.9)" }}
          >
            {settings.currentText}
          </text>
        )}

        {/* Forecast Level Text */}
        {forecastLevelData.length > 0 &&
          forecastLevelData[forecastMidIndex] && (
            <text
              x={settings.forecastX}
              y={settings.yPosition}
              textAnchor="middle"
              fill="#f63b3b"
              fontSize={settings.fontSizeAdjust}
              fontWeight="bold"
              style={{ textShadow: "1px 1px 2px rgba(255,255,255,0.9)" }}
            >
              {settings.forecastText}
            </text>
          )}
      </g>
    );
  };

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    if (duration === '7d' || duration === '3d' || duration === '1d') {
         return new Intl.DateTimeFormat('th-TH', {
             month: 'numeric',
             day: 'numeric',
             hour: '2-digit',
             minute: '2-digit',
             hour12: false
         }).format(date);
    } else {
         return new Intl.DateTimeFormat('th-TH', {
             hour: '2-digit',
             minute: '2-digit',
             hour12: false
         }).format(date);
    }
  };

  if (processedData.length === 0) {
    return (
      <div
        className="bg-white p-4 rounded-xl shadow-lg font-sans text-center"
        style={{ height: 420 }}
      >
        <h2
          className={`font-semibold text-gray-800 mb-4`}
          style={{ fontSize: fontSize + 4 }}
        >
          {stationName || "การคาดการณ์ระดับน้ำ"}
        </h2>
        <p>กำลังโหลดข้อมูล... (สถานี: {stationId || "N/A"})</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 sm:p-4 rounded-xl shadow-xl font-sans border-2 border-blue-500">
      <h2
        className={`text-center font-bold text-blue-900 mb-1`}
        style={{ fontSize: fontSize + 6 }}
      >
        {screenSize === "mobile" ? (
          <>
            <img
              src={waterlev}
              alt="water level"
              className="inline-block w-6 h-6 mr-1"
            />{" "}
            การคาดการณ์ระดับน้ำ
            <br />3 ชั่วโมงล่วงหน้า
          </>
        ) : (
          <>
            <img
              src={waterlev}
              alt="water level"
              className="inline-block w-8 h-8 mr-2"
            />{" "}
            การคาดการณ์ระดับน้ำ 3 ชั่วโมงล่วงหน้า
          </>
        )}
      </h2>
      <p
        className="text-center text-gray-600 mb-3"
        style={{ fontSize: fontSize }}
      >
        สถานี: {stationName}
      </p>

      {/* Warning Section */}
      <div
        className="mb-2 p-2 rounded-lg"
        style={{
          backgroundColor: dangerLevel === "ปกติ" ? "#f0fdf4" : "#fef2f2",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-1 sm:mb-0">
            <span className="font-semibold" style={{ color: getDangerColor() }}>
              สถานะปัจจุบัน : {dangerLevel}
            </span>
            {currentWaterLevel && (
              <span className="ml-1 text-gray-700">
                (ระดับน้ำ : {currentWaterLevel} ม.)
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {trend && <span>📈 แนวโน้ม : {trend}</span>}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={processedData}
          margin={{ top: 0, right: 15, bottom: 15, left: 5 }}
        >
          <defs>
            <linearGradient id="currentAreaColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#123fb8ff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#123fb8ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastAreaColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f63b79ff" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#f63b60ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatXAxis}
            ticks={customTicks}
            stroke="#6b7280"
            tick={{ fontSize: fontSize, dy: 5 }}
            height={60}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fontSize: fontSize }}
            ticks={[2, 3, 4, 5, 6, 7]}
            width={40}
            label={{
              value: "ระดับน้ำ (ร.ส.ม.)",
              angle: -90,
              position: "insideLeft",
              offset: 2,
              fontSize: fontSize,
            }}
            domain={[2, 7.5]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #e0e0e0",
              borderRadius: "0.5rem",
              fontSize: fontSize - 2,
              padding: "8px",
            }}
            formatter={(value) => `${value} ม.`}
            labelFormatter={formatTooltipLabel}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{
              fontSize: fontSize - 1,
              paddingTop: "5px",
              paddingBottom: "8px",
            }}
            content={renderCustomLegend}
          />

          <ReferenceLine
            x={currentHourStartTimestampMs}
            stroke="black"
            strokeDasharray="4 4"
            strokeWidth={2.5}
          >
            <Label
              value="ตอนนี้"
              position="insideTop"
              fill="black"
              fontSize={fontSize - 2}
              dx={25}
              dy={-5}
            />
          </ReferenceLine>

          <ReferenceLine
            y={4.5}
            stroke="green"
            strokeDasharray="4 7"
            strokeWidth={1.5}
          >
            <Label
              value="ปกติ (4.5 ม.)"
              position="insideRight"
              fill="green"
              fontSize={fontSize - 2}
              dy={-12}
            />
          </ReferenceLine>
          <ReferenceLine
            y={5.5}
            stroke="orange"
            strokeDasharray="4 7"
            strokeWidth={1.5}
          >
            <Label
              value="เฝ้าระวัง (5.5 ม.)"
              position="insideRight"
              fill="orange"
              fontSize={fontSize - 2}
              dy={-10}
            />
          </ReferenceLine>
          <ReferenceLine
            y={6}
            stroke="red"
            strokeDasharray="4 7"
            strokeWidth={1.5}
          >
            <Label
              value="เตรียมอพยพ (6 ม.)"
              position="insideRight"
              fill="red"
              fontSize={fontSize - 2}
              dy={-13}
            />
          </ReferenceLine>
          <ReferenceLine
            y={7}
            stroke="#7f1d1d"
            strokeDasharray="4 7"
            strokeWidth={1.5}
          >
            <Label
              value="วิกฤติ (7 ม.)"
              position="insideRight"
              fill="#7f1d1d"
              fontSize={fontSize - 2}
              dy={-13}
            />
          </ReferenceLine>

          <Area
            type="monotone"
            dataKey="currentLevel"
            name="ระดับน้ำปัจจุบัน"
            stroke="#1e3a8a"
            strokeWidth={2}
            fill="url(#currentAreaColor)"
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="forecastLevel"
            name="ระดับน้ำคาดการณ์"
            stroke="#f63b3bff"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#forecastAreaColor)"
            activeDot={{ r: 6 }}
            connectNulls
          />

          {/* Custom Text Labels - Now Responsive */}
          <CustomTextLabels
            data={processedData}
            fontSize={fontSize}
            screenSize={screenSize}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WaterLevelForecastAreaChart;
