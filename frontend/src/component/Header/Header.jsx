import React, { useState, useEffect } from 'react';
import './Header.css';
import BannerNSC from '../../assets/BannerFlood-min.png';

const Header = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(document.body);
        
        return () => resizeObserver.disconnect();
      } else {
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
      }
    }
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const getAspectRatio = () => {
    if (screenSize.width <= 480) return '5/3';
    if (screenSize.width <= 768) return '16/10';
    if (screenSize.width <= 1024) return '16/9';
    if (screenSize.width <= 1440) return '21/9';
    return '21/8';
  };

  const headerStyle = {
    '--aspect-ratio': getAspectRatio(),
    '--screen-width': `${screenSize.width}px`,
    '--screen-height': `${screenSize.height}px`
  };

  return (
    <header 
      className={`banner-header ${isLoaded ? 'loaded' : 'loading'}`}
      style={headerStyle}
      role="banner"
      aria-label="Website header banner"
    >
      {!isLoaded && (
        <div className="banner-placeholder" aria-hidden="true">
          <div className="loading-skeleton"></div>
        </div>
      )}
      
      <img 
        src={BannerNSC} 
        alt="Website Banner"
        className="banner-image"
        onLoad={handleImageLoad}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      
      <div className="banner-overlay" aria-hidden="true"></div>
    </header>
  );
};

export default Header;