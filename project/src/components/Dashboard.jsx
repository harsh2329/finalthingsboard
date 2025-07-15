import React from 'react';
import DashboardWidget from './DashboardWidget.jsx';
import './Dashboard.css';

const Dashboard = ({ sidebarCollapsed }) => {
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
        current: '1,245 kWh',
        trend: '-1.2%',
        series: [1200, 1220, 1245, 1230, 1210, 1205, 1240, 1250, 1245, 1235]
      }
    }
  ];

  return (
    <div className={`dashboard ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {widgets.map(widget => (
        <DashboardWidget key={widget.id} {...widget} />
      ))}
    </div>
  );
};

export default Dashboard;
