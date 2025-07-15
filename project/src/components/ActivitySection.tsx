import React from 'react';
import { ChevronDown, Clock } from 'lucide-react';
import './ActivitySection.css';

const ActivitySection: React.FC = () => {
  const chartData = [
    { day: 'Jun 17', value: 0 },
    { day: 'Jun 21', value: 0 },
    { day: 'Jun 25', value: 0 },
    { day: 'Jul', value: 1 },
    { day: 'Jul 05', value: 0 },
    { day: 'Jul 09', value: 0 },
    { day: 'Jul 13', value: 0 }
  ];

  return (
    <div className="activity-section">
      <div className="section-header">
        <h3>Activity</h3>
        <button className="filter-btn">
          Devices
          <ChevronDown size={16} />
        </button>
      </div>
      
      <div className="activity-period">
        <Clock size={16} />
        <span>History - last 30 days</span>
      </div>
      
      <div className="activity-chart">
        <div className="chart-container">
          {chartData.map((item, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar" 
                style={{ height: `${item.value * 20 + 5}px` }}
              ></div>
              <div className="bar-label">{item.day}</div>
            </div>
          ))}
        </div>
        <div className="chart-value">1</div>
      </div>
    </div>
  );
};

export default ActivitySection;