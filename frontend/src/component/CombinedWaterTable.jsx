import React, { useState, useMemo, useEffect } from "react";
import "../component/WaterTable/WaterTable.css";

const CombinedWaterTable = ({ dateRange }) => {
  const [loading, setLoading] = useState(true);
  const [mergedData, setMergedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const formatDateForAPI = (dateTimeLocal) => {
    if (!dateTimeLocal) return '';
    return dateTimeLocal.replace('T', ' ') + ':00';
  };

  const fetchData = async (startDate = '', endDate = '') => {
    setLoading(true);
    
    try {
      // สร้าง URL สำหรับทั้ง 2 API
      let nawangUrl = "https://myweb.ac.th/get_water_dataNawang.php";
      let mangraiUrl = "https://myweb.ac.th/get_water_data.php";

      if (startDate && endDate) {
        const formattedStart = formatDateForAPI(startDate);
        const formattedEnd = formatDateForAPI(endDate);
        const params = `?startDate=${encodeURIComponent(formattedStart)}&endDate=${encodeURIComponent(formattedEnd)}`;
        nawangUrl += params;
        mangraiUrl += params;
      }

      // ดึงข้อมูลจากทั้ง 2 API พร้อมกัน
      const [nawangResponse, mangraiResponse] = await Promise.all([
        fetch(nawangUrl).then(res => res.json()),
        fetch(mangraiUrl).then(res => res.json())
      ]);

      console.log("Nawang Data:", nawangResponse);
      console.log("MangRai Data:", mangraiResponse);

      // แปลงข้อมูลเป็น Map โดยใช้ timestamp เป็น key
      const nawangMap = new Map();
      const processedNawang = Array.isArray(nawangResponse) ? nawangResponse : [];
      processedNawang.forEach(item => {
        nawangMap.set(item.datetime, {
          nawang_level: item.water_level,
          nawang_volume: item.water_volume
        });
      });

      // Merge ข้อมูลจาก MangRai พร้อมกับ Nawang
      const processedMangrai = Array.isArray(mangraiResponse) ? mangraiResponse : [];
      const merged = processedMangrai.map(item => {
        const nawangData = nawangMap.get(item.datetime) || {};
        return {
          timestamp: item.datetime,
          // Nawang data
          nawang_level: nawangData.nawang_level ?? null,
          nawang_volume: nawangData.nawang_volume ?? null,
          // MangRai data
          mangrai_level: item.water_level ?? null,
          mangrai_volume: item.water_volume ?? null,
          mangrai_rainfall: item.rainfall ?? null,
          mangrai_cumulative: item.cumulative_rainfall ?? null
        };
      });

      setMergedData(merged);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message);
      setMergedData([]);
    } finally {
      setLoading(false);
    }
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


  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...mergedData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [mergedData, sortConfig]);

  const pagedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedData, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleExportCSV = () => {
    const header = [
      "วันที่/เวลา",
      "แม่นาวาง-ท่าตอน: ระดับน้ำ (ม.รทก.)",
      "แม่นาวาง-ท่าตอน: ปริมาณน้ำ (ลบ.ม./วินาที)",
      "เม็งรายมหาราช: ระดับน้ำ (ม.รทก.)",
      "เม็งรายมหาราช: ปริมาณน้ำ (ลบ.ม./วินาที)",
      "เม็งรายมหาราช: ปริมาณฝน (มม.)",
      "เม็งรายมหาราช: ฝนสะสม (มม.)"
    ];
    
    const rows = sortedData.map((d) => [
      new Date(d.timestamp).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
      d.nawang_level ?? 'N/A',
      d.nawang_volume ?? 'N/A',
      d.mangrai_level ?? 'N/A',
      d.mangrai_volume ?? 'N/A',
      d.mangrai_rainfall ?? 'N/A',
      d.mangrai_cumulative ?? 'N/A'
    ]);
    
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `combined_water_data_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Group data by date for rendering
  const groupedData = useMemo(() => {
    const groups = [];
    let currentDate = null;
    
    pagedData.forEach((item, index) => {
      const itemDate = formatDateHeader(item.timestamp);
      if (itemDate !== currentDate) {
        groups.push({ type: 'date', date: itemDate, timestamp: item.timestamp });
        currentDate = itemDate;
      }
      groups.push({ type: 'data', ...item, index });
    });
    
    return groups;
  }, [pagedData]);

  return (
    <section className="water-table-section">
      <h4>ตารางข้อมูลเปรียบเทียบทั้ง 2 สถานี</h4>
      
      <div className="water-table-controls">
      </div>

      <div className="table-wrapper">
        <table className="water-table combined-table">
          <thead>
            <tr className="station-header">
              <th rowSpan="2" className="sortable time-column" onClick={() => requestSort("timestamp")}>
                เวลา {sortConfig.key === "timestamp" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th colSpan="2" className="station-group nawang">แม่นาวาง-ท่าตอน</th>
              <th colSpan="4" className="station-group mangrai">พ่อขุนเม็งรายมหาราช</th>
            </tr>
            <tr className="field-header">
              <th className="sortable" onClick={() => requestSort("nawang_level")}>
                ระดับน้ำ (ม.รทก.) {sortConfig.key === "nawang_level" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("nawang_volume")}>
                ปริมาณน้ำ (ลบ.ม./วิ) {sortConfig.key === "nawang_volume" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("mangrai_level")}>
                ระดับน้ำ (ม.รทก.) {sortConfig.key === "mangrai_level" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("mangrai_volume")}>
                ปริมาณน้ำ (ลบ.ม./วิ) {sortConfig.key === "mangrai_volume" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("mangrai_rainfall")}>
                ฝน (มม.) {sortConfig.key === "mangrai_rainfall" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="sortable" onClick={() => requestSort("mangrai_cumulative")}>
                ฝนสะสม (มม.) {sortConfig.key === "mangrai_cumulative" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>กำลังโหลดข้อมูล...</td></tr>
            ) : groupedData.length > 0 ? (
              groupedData.map((item, idx) => {
                if (item.type === 'date') {
                  return (
                    <tr key={`date-${idx}`} className="date-separator">
                      <td colSpan="7" className="date-cell">{item.date}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={`${item.timestamp}-${item.index}`}>
                    <td className="time-cell">{new Date(item.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{item.nawang_level !== null ? item.nawang_level : '-'}</td>
                    <td>{item.nawang_volume !== null ? item.nawang_volume : '-'}</td>
                    <td>{item.mangrai_level !== null ? item.mangrai_level : '-'}</td>
                    <td>{item.mangrai_volume !== null ? item.mangrai_volume : '-'}</td>
                    <td>{item.mangrai_rainfall !== null ? item.mangrai_rainfall : '-'}</td>
                    <td>{item.mangrai_cumulative !== null ? item.mangrai_cumulative : '-'}</td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>ไม่พบข้อมูลในช่วงวันที่ที่เลือก</td></tr>
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

      <style>{`
        .combined-table .station-header th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 700;
          padding: 14px 12px;
          text-align: center;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        .combined-table .field-header th {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          color: white;
          font-weight: 600;
          font-size: 0.8rem;
          padding: 10px 8px;
          text-align: center;
        }

        .station-group {
          border-left: 2px solid rgba(255, 255, 255, 0.3);
        }

        .station-group.nawang {
          background: linear-gradient(135deg, rgba(17, 153, 142, 0.25) 0%, rgba(56, 239, 125, 0.25) 100%);
        }

        .station-group.mangrai {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%);
        }

        .time-column {
          position: sticky;
          left: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 20;
          min-width: 100px;
        }

        .date-separator {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
          font-weight: 700;
        }

        .date-cell {
          padding: 12px !important;
          text-align: center;
          color: #667eea;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .time-cell {
          position: sticky;
          left: 0;
          background: white;
          font-weight: 600;
          color: #667eea;
          z-index: 10;
          border-right: 2px solid #e1e8ed;
        }

        .combined-table tbody tr:nth-child(even) .time-cell {
          background: #f8f9fa;
        }

        .combined-table tbody tr:hover .time-cell {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
        }

        .combined-table td {
          text-align: center;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .time-column {
            min-width: 80px;
            font-size: 0.75rem;
          }

          .combined-table .station-header th,
          .combined-table .field-header th {
            font-size: 0.7rem;
            padding: 8px 4px;
          }

          .combined-table td {
            font-size: 0.8rem;
            padding: 8px 4px;
          }
        }
      `}</style>
    </section>
  );
};

export default CombinedWaterTable;