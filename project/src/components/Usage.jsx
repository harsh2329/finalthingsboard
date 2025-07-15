import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Usage.css';

const Usage = () => {
  const usageData = [
    { label: 'Devices', current: 32, total: 100, color: '#4a6fa5' },
    { label: 'Assets', current: 3, total: 100, color: '#4caf50' },
    { label: 'Users', current: 6, total: 100, color: '#ff9800' },
    { label: 'Dashboards', current: 17, total: 100, color: '#9c27b0' },
    { label: 'Customers', current: 5, total: '\u221e', color: '#f44336' }
  ];

  return (
    <div className="usage">
      <div className="section-header">
        <h3>Usage</h3>
        <button className="filter-btn">
          Entities
          <ChevronDown size={16} />
        </button>
      </div>
      
      <div className="usage-list">
        {usageData.map((item, index) => (
          <div key={index} className="usage-item">
            <div className="usage-info">
              <span className="usage-label">{item.label}</span>
              <span className="usage-value">
                {item.current} / {item.total}
              </span>
            </div>
            <div className="usage-bar">
              <div 
                className="usage-fill" 
                style={{ 
                  width: item.total === '\u221e' ? '5%' : `${(item.current / Number(item.total)) * 100}%`,
                  backgroundColor: item.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Usage;
