import React from 'react';
import './AlarmsSection.css';

const AlarmsSection: React.FC = () => {
  return (
    <div className="alarms-section">
      <h3>Alarms</h3>
      
      <div className="alarms-stats">
        <div className="alarm-stat critical">
          <div className="alarm-label">Critical</div>
          <div className="alarm-value">
            0
            <span className="alarm-indicator">▲</span>
          </div>
        </div>
        
        <div className="alarm-stat assigned">
          <div className="alarm-label">Assigned to me</div>
          <div className="alarm-value">0</div>
        </div>
        
        <div className="alarm-stat total">
          <div className="alarm-label">Total</div>
          <div className="alarm-value">5</div>
        </div>
      </div>
    </div>
  );
};

export default AlarmsSection;