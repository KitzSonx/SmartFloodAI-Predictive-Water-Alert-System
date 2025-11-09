import React, { useState, useMemo, useEffect } from "react";
import { saveAs } from "file-saver";
import "./WaterTable.css";

const WaterTable = ( {dateRange} ) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  //const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const formatDateForAPI = (dateTimeLocal) => {
    if (!dateTimeLocal) return '';
    return dateTimeLocal.replace('T', ' ') + ':00';
  };

  const fetchData = (startDate = '', endDate = '') => {
    setLoading(true);
    let apiUrl = "https://myweb.ac.th/get_water_data.php";

    if (startDate && endDate) {
      const formattedStart = formatDateForAPI(startDate);
      const formattedEnd = formatDateForAPI(endDate);
      apiUrl += `?startDate=${encodeURIComponent(formattedStart)}&endDate=${encodeURIComponent(formattedEnd)}`;
    }

    console.log('Fetching from:', apiUrl);

    fetch(apiUrl)
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        
        try {
          return JSON.parse(text);
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          console.error('Response text:', text);
          throw new Error('Invalid JSON response from server');
        }
      })
      .then((apiData) => {
        console.log("API Response:", apiData);
        
        if (apiData.error) {
          console.error("API Error:", apiData.error);
          alert("เกิดข้อผิดพลาด: " + apiData.error);
          setData([]);
          setFilteredData([]);
        } else {
          let formattedData = [];
          
          if (Array.isArray(apiData)) {
            formattedData = apiData.map(item => ({
              timestamp: item.datetime,
              level: item.water_level,
              flowRate: item.water_volume,  
              rainfall: item.rainfall,    
              cumulativeRainfall: item.cumulative_rainfall
            }));
          } else if (apiData.data && Array.isArray(apiData.data)) {
            formattedData = apiData.data.map(item => ({
              timestamp: item.datetime,
              level: item.water_level,
              flowRate: item.water_volume,  
              rainfall: item.rainfall,    
              cumulativeRainfall: item.cumulative_rainfall
            }));
          } else if (apiData.sample_data && Array.isArray(apiData.sample_data)) {
            formattedData = apiData.sample_data.map(item => ({
              timestamp: item.datetime,
              level: item.water_level,
              flowRate: item.water_volume,  
              rainfall: item.rainfall,    
              cumulativeRainfall: item.cumulative_rainfall
            }));
          } else {
            console.error("API did not return an array:", apiData);
            alert("ข้อมูลที่ได้รับจากเซิร์ฟเวอร์ไม่ถูกต้อง");
            setData([]);
            setFilteredData([]);
            setLoading(false);
            return;
          }
          
          setData(formattedData);
          setFilteredData(formattedData);
        }
        setLoading(false);
        setCurrentPage(1);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message);
        setData([]);
        setFilteredData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dateRange && dateRange.start && dateRange.end) {
      fetchData(dateRange.start, dateRange.end);
    } else {
      fetchData();
    }
  }, [dateRange]);

  const formatDateHeader = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("th-TH", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: "Asia/Bangkok",
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString("th-TH", {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', timeZone: "Asia/Bangkok",
    });
  };


  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const pagedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedData, itemsPerPage]);

  const groupedData = useMemo(() => {
  const groups = [];
  let currentDate = null;
  
  pagedData.forEach((item, index) => {
      const itemDate = formatDateHeader(item.timestamp);
      if (itemDate !== currentDate) {
        groups.push({ type: 'date', date: itemDate });
        currentDate = itemDate;
      }
      groups.push({ type: 'data', ...item, index });
    });
    
    return groups;
  }, [pagedData]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleExportCSV = () => {
    const header = ["วันที่/เวลา", "ระดับน้ำ (ม.รทก.)", "อัตราการไหล (ลบ.ม./วินาที)", "ปริมาณฝน (มม.)", "ฝนสะสม (มม.)"];
    const rows = sortedData.map((d) => [
      formatDate(d.timestamp),
      d.level,
      d.flowRate,
      d.rainfall,
      d.cumulativeRainfall,
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `water_data_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <section className="water-table-section">
      <h4>สถานี : สะพานพ่อขุนเม็งรายมหาราช</h4>
      <div className="water-table-controls">
      </div>

      <div className="table-wrapper">
        <table className="water-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => requestSort("timestamp")}>
                วันที่/เวลา {sortConfig.key === "timestamp" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("level")}>
                ระดับน้ำ (ม.รทก.) {sortConfig.key === "level" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("flowRate")}>
                อัตราการไหล (ลบ.ม./วินาที) {sortConfig.key === "flowRate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("rainfall")}>
                ปริมาณฝน (มม.) {sortConfig.key === "rainfall" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("cumulativeRainfall")}>
                ฝนสะสม (มม.) {sortConfig.key === "cumulativeRainfall" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>กำลังโหลดข้อมูล...</td></tr>
            ) : groupedData.length > 0 ? (
              groupedData.map((item, idx) => {
                if (item.type === 'date') {
                  return (
                    <tr key={`date-${item.date}`} className="date-separator">
                      <td colSpan="5" className="date-cell">{item.date}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={`${item.timestamp}-${item.index}`}>
                    <td>{formatDate(item.timestamp)}</td>
                    <td>{item.level !== null ? item.level : 'N/A'}</td>
                    <td>{item.flowRate !== null ? item.flowRate : 'N/A'}</td>
                    <td>{item.rainfall !== null ? item.rainfall : 'N/A'}</td>
                    <td>{item.cumulativeRainfall !== null ? item.cumulativeRainfall : 'N/A'}</td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>ไม่พบข้อมูลในช่วงวันที่ที่เลือก</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && !loading && (
        <div className="water-table-pagination">
          <span>
            หน้า {currentPage} จาก {totalPages} (ข้อมูลทั้งหมด {sortedData.length} รายการ)
          </span>
          <div>
            <button 
              onClick={() => setCurrentPage(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              ย้อนกลับ
            </button>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default WaterTable;