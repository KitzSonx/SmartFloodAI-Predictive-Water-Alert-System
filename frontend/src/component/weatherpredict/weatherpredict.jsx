import React from 'react'
import './weatherpredict.css';
import utuniyom from "../../assets/utuniyom.png"

const Weatherpredict = () => {
  return (
    <section className="DDashboard-section">
        <div className='hhome'>
            <div className='ffeed-1'>
                <h3 style={{ 
                  textAlign: 'center', 
                  color: '#ffffffff', 
                  marginBottom: '1rem',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  🌤️ การพยากรณ์อากาศ 7 วันล่วงหน้า <br />จังหวัดเชียงราย
                </h3>
                <div className="departmentt-info">
                  <img src={utuniyom} alt="กรมอุตุนิยมวิทยา" className="departmentt-logo" />
                  <h3 className="departmentt-title">
                    กรมอุตุนิยมวิทยา
                  </h3>
                </div>
                <div className='iframe-container'>
                    <iframe 
                      src="https://www.tmd.go.th/weatherForecast7DaysWidget?province=เชียงราย" 
                      frameBorder="2" 
                      allowFullScreen 
                      scrolling='yes'
                    />
                </div>
            </div>
        </div>
    </section>
  );
}

export default Weatherpredict