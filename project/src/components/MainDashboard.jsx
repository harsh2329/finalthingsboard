import React from 'react';
import DemoUseCases from './DemoUseCases.jsx';
import GetStarted from './GetStarted.jsx';
import DevicesSection from './DevicesSection.jsx';
import AlarmsSection from './AlarmsSection.jsx';
import DashboardsSection from './DashboardsSection.jsx';
import ActivitySection from './ActivitySection.jsx';
import QuickLinks from './QuickLinks.jsx';
import Documentation from './Documentation.jsx';
import Usage from './Usage.jsx';
import MobileApp from './MobileApp.jsx';
import './MainDashboard.css';

const MainDashboard = ({ sidebarCollapsed }) => {
  return (
    <main className={`main-dashboard ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="dashboard-content">
        <DemoUseCases />
        
        <div className="dashboard-grid">
          <div className="left-column">
            <DevicesSection />
            <DashboardsSection />
            <QuickLinks />
          </div>
          
          <div className="middle-column">
            <AlarmsSection />
            <ActivitySection />
            <Documentation />
          </div>
          
          <div className="right-column">
            <GetStarted />
            <Usage />
            <MobileApp />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;
