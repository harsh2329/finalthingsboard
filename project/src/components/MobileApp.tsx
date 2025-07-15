import React from 'react';
import './MobileApp.css';

const MobileApp: React.FC = () => {
  return (
    <div className="mobile-app">
      <h3>Connect mobile app</h3>
      
      <div className="app-stores">
        <a href="#" className="store-link app-store">
          <img 
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
            alt="Download on the App Store"
          />
        </a>
        <a href="#" className="store-link google-play">
          <img 
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
            alt="Get it on Google Play"
          />
        </a>
      </div>
      
      <div className="qr-code">
        <div className="qr-placeholder">
          <div className="qr-pattern">
            {Array.from({ length: 64 }).map((_, i) => (
              <div 
                key={i} 
                className={`qr-dot ${Math.random() > 0.5 ? 'filled' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;