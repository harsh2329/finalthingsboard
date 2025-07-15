import React from 'react';
import DashboardWidget from './DashboardWidget';
import './Dashboard.css';

interface DashboardProps {
  sidebarCollapsed: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ sidebarCollapsed }) => {
  const widgets = [
    {
      id: 'temperature',
      title: 'Temperature Sensors',
      type: 'chart',
      size: 'large',
      data: {
        current: '24.5°C',
        trend: '+2.3%',
        series: [22, 23, 24, 25, 24, 23, 25, 26, 25, 24]
      }
    },
    {
      id: 'humidity',
      title: 'Humidity Levels',
      type: 'gauge',
      size: 'medium',
      data: {
        current: '68%',
        max: 100,
        value: 68
      }
    },
    {
      id: 'devices',
      title: 'Active Devices',
      type: 'counter',
      size: 'small',
      data: {
        count: 1247,
        label: 'Connected Devices',
        trend: '+12'
      }
    },
    {
      id: 'alarms',
      title: 'Active Alarms',
      type: 'list',
      size: 'medium',
      data: {
        items: [
          { text: 'High Temperature Alert', severity: 'critical', time: '2 min ago' },
          { text: 'Device Offline', severity: 'warning', time: '5 min ago' },
          { text: 'Battery Low', severity: 'info', time: '10 min ago' }
        ]
      }
    },
    {
      id: 'energy',
      title: 'Energy Consumption',
      type: 'chart',
      size: 'large',
      data: {
        current: '2.47 kWh',
        trend: '-8.2%',
        series: [2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.3, 2.1, 2.4, 2.5]
      }
    },
    {
      id: 'location',
      title: 'Device Locations',
      type: 'map',
      size: 'large',
      data: {
        markers: [
          { lat: 40.7128, lng: -74.0060, label: 'New York' },
          { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },
          { lat: 41.8781, lng: -87.6298, label: 'Chicago' }
        ]
      }
    }
  ];

  return (
    <main className={`dashboard ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="dashboard-header">
        <h1>Home Dashboard</h1>
        <div className="dashboard-actions">
          <button className="action-btn">Export</button>
          <button className="action-btn primary">Add Widget</button>
        </div>
      </div>
      
      <div className="dashboard-grid">
        {widgets.map(widget => (
          <DashboardWidget
            key={widget.id}
            {...widget}
          />
        ))}
      </div>
    </main>
  );
};

export default Dashboard;