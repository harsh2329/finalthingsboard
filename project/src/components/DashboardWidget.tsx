import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import './DashboardWidget.css';

interface WidgetData {
  current?: string;
  trend?: string;
  series?: number[];
  max?: number;
  value?: number;
  count?: number;
  label?: string;
  items?: Array<{
    text: string;
    severity: 'critical' | 'warning' | 'info';
    time: string;
  }>;
  markers?: Array<{
    lat: number;
    lng: number;
    label: string;
  }>;
}

interface DashboardWidgetProps {
  id: string;
  title: string;
  type: 'chart' | 'gauge' | 'counter' | 'list' | 'map';
  size: 'small' | 'medium' | 'large';
  data: WidgetData;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, type, size, data }) => {
  const renderChart = () => {
    if (!data.series) return null;
    
    const max = Math.max(...data.series);
    const min = Math.min(...data.series);
    const range = max - min;
    
    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-value">{data.current}</div>
          <div className={`chart-trend ${data.trend?.startsWith('+') ? 'positive' : 'negative'}`}>
            {data.trend?.startsWith('+') ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {data.trend}
          </div>
        </div>
        <div className="chart-graph">
          <svg width="100%" height="60" viewBox="0 0 300 60">
            <polyline
              points={data.series.map((value, index) => {
                const x = (index / (data.series!.length - 1)) * 280 + 10;
                const y = 50 - ((value - min) / range) * 40;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#2196f3"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  };

  const renderGauge = () => {
    if (!data.value || !data.max) return null;
    
    const percentage = (data.value / data.max) * 100;
    
    return (
      <div className="gauge-container">
        <div className="gauge-value">{data.current}</div>
        <div className="gauge-bar">
          <div className="gauge-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="gauge-label">0 - {data.max}%</div>
      </div>
    );
  };

  const renderCounter = () => {
    return (
      <div className="counter-container">
        <div className="counter-value">{data.count?.toLocaleString()}</div>
        <div className="counter-label">{data.label}</div>
        {data.trend && (
          <div className="counter-trend">
            <TrendingUp size={14} />
            {data.trend}
          </div>
        )}
      </div>
    );
  };

  const renderList = () => {
    if (!data.items) return null;
    
    return (
      <div className="list-container">
        {data.items.map((item, index) => (
          <div key={index} className="list-item">
            <div className="list-item-icon">
              {item.severity === 'critical' && <AlertTriangle size={16} className="critical" />}
              {item.severity === 'warning' && <AlertTriangle size={16} className="warning" />}
              {item.severity === 'info' && <Info size={16} className="info" />}
            </div>
            <div className="list-item-content">
              <div className="list-item-text">{item.text}</div>
              <div className="list-item-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMap = () => {
    return (
      <div className="map-container">
        <div className="map-placeholder">
          <div className="map-overlay">
            <div className="map-markers">
              {data.markers?.map((marker, index) => (
                <div key={index} className="map-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-label">{marker.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'chart':
        return renderChart();
      case 'gauge':
        return renderGauge();
      case 'counter':
        return renderCounter();
      case 'list':
        return renderList();
      case 'map':
        return renderMap();
      default:
        return null;
    }
  };

  return (
    <div className={`widget widget-${size}`}>
      <div className="widget-header">
        <h3>{title}</h3>
        <div className="widget-actions">
          <button className="widget-action">⋮</button>
        </div>
      </div>
      <div className="widget-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardWidget;