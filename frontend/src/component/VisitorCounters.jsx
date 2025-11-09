import React, { useState, useEffect } from 'react';

function VisitorCounters() {
  const [pageviews, setPageviews] = useState(null);
  const [uniqueVisitors, setUniqueVisitors] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCounters = async () => {
      try {
        const pvResponse = await fetch('https://myweb.ac.th/pageview_counter.php');
        if (!pvResponse.ok) throw new Error('Pageview fetch failed');
        const pvData = await pvResponse.json();
        if (isMounted && pvData && typeof pvData.pageviews === 'number') {
          setPageviews(pvData.pageviews);
        } else if (isMounted) {
            console.error('Invalid pageview data:', pvData);
            setError(prev => ({...prev, pageviews: 'Invalid data' }));
        }

        const uvResponse = await fetch('https://myweb.ac.th/unique_visitor_counter.php', {
          credentials: 'include'
        });
        if (!uvResponse.ok) throw new Error('Unique visitor fetch failed');
        const uvData = await uvResponse.json();
         if (isMounted && uvData && typeof uvData.unique_visitors_today === 'number') {
          setUniqueVisitors(uvData.unique_visitors_today);
        } else if (isMounted) {
             console.error('Invalid unique visitor data:', uvData);
             setError(prev => ({...prev, unique: 'Invalid data' }));
        }

      } catch (err) {
        if (isMounted) {
            console.error('Failed to fetch counters:', err);
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
      }
    };

    fetchCounters();

    return () => { isMounted = false; };

  }, []);

  const counterStyle = {
    fontSize: '0.85rem', 
    color: '#6c757d',      
    backgroundColor: '#f8f9fa', 
    padding: '8px 15px',      
    borderRadius: '15px',      
    display: 'inline-block', 
    marginTop: '10px',         
    marginBottom: '10px',    
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', 
  };

  const separatorStyle = {
    margin: '0 10px',
    color: '#ced4da',
  };

  const numberStyle = {
    fontWeight: '500',
    color: '#495057',
  };

  const errorStyle = {
      color: '#dc3545',
      fontStyle: 'italic',
  }


  const renderContent = () => {
    if (error) {
      return <span style={errorStyle}>{error}</span>;
    }

    const pvText = pageviews === null ? '...' : typeof pageviews === 'number' ? pageviews.toLocaleString() : 'Error';
    const uvText = uniqueVisitors === null ? '...' : typeof uniqueVisitors === 'number' ? uniqueVisitors.toLocaleString() : 'Error';

    return (
      <>
        <span>
          เข้าชมทั้งหมด: <span style={numberStyle}>{pvText}</span> ครั้ง
        </span>
        <span style={separatorStyle}>|</span>
        <span>
          ผู้เข้าชมวันนี้: <span style={numberStyle}>{uvText}</span> คน
        </span>
      </>
    );
  };


  return (
    <div className="visitor-counters" style={counterStyle}>
      {renderContent()}
    </div>
  );
}

export default VisitorCounters;