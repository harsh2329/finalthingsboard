import React from 'react';
import { Menu, Bell, User, Home, Maximize2 } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="logo-text">ThingsBoard</span>
        </div>
        <div className="breadcrumb">
          <Home size={16} />
          <span>Home</span>
        </div>
      </div>
      
      <div className="header-right">
        <button className="header-btn">
          <Maximize2 size={18} />
        </button>
        <button className="header-btn">
          <Bell size={18} />
          <span className="notification-badge">35</span>
        </button>
        <div className="user-menu">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">Harsh Soni</span>
            <span className="user-role">Tenant administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;