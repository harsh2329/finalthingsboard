import React from 'react';
import { Monitor, Users, Home, Settings } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'devices', label: 'Devices', icon: Monitor },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>ThingsBoard</h2>
      </div>
      <ul className="nav-menu">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              {item.label}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;