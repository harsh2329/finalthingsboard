import React from 'react';
import DemoUseCases from './DemoUseCases';
import GetStarted from './GetStarted';
import DevicesSection from './DevicesSection';
import AlarmsSection from './AlarmsSection';
import DashboardsSection from './DashboardsSection';
import ActivitySection from './ActivitySection';
import QuickLinks from './QuickLinks';
import Documentation from './Documentation';
import Usage from './Usage';
import MobileApp from './MobileApp';
import './MainDashboard.css';

interface MainDashboardProps {
  sidebarCollapsed: boolean;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ sidebarCollapsed }) => {
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