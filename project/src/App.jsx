import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import MainDashboard from './components/MainDashboard.jsx';
import CustomerManagement from './components/sidebarcomponent/CustomerManagement.jsx';
import './App.css';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import DeviceModal from './components/sidebarcomponent/DeviceModal.jsx';

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
      <Routes>
        <Route path='/customers' element={<CustomerManagement />} />
        <Route path='/devices' element={ <DeviceModal/>} />
        <Route path ='/dashboard' element ={<MainDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
