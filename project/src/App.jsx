import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import MainDashboard from './components/MainDashboard.jsx';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app">
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="app-body">
        <Sidebar collapsed={sidebarCollapsed} />
        <MainDashboard sidebarCollapsed={sidebarCollapsed} />
      </div>
    </div>
  );
}

export default App;
