import React, { useState } from 'react';
import { 
  Home, 
  AlertTriangle, 
  BarChart3, 
  Layers, 
  User, 
  Users, 
  Zap, 
  Settings,
  Smartphone,
  Bell,
  ChevronRight,
  ChevronDown 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => {
  const [expandedItems, setExpandedItems] = useState(['profiles']);

  const toggleExpanded = (item) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, active: true },
    { id: 'alarms', label: 'Alarms', icon: AlertTriangle },
    { id: 'dashboards', label: 'Dashboards', icon: BarChart3 },
    { 
      id: 'entities', 
      label: 'Entities', 
      icon: Layers, 
      hasChildren: true,
      children: [
        { id: 'devices', label: 'Devices' },
        { id: 'assets', label: 'Assets' },
        { id: 'entity-views', label: 'Entity views' },
        { id: 'customers', label: 'Customers' }
      ]
    },
    { 
      id: 'profiles', 
      label: 'Profiles', 
      icon: User,
      hasChildren: true,
      children: [
        { id: 'device-profiles', label: 'Device profiles' },
        { id: 'asset-profiles', label: 'Asset profiles' }
      ]
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'rule-chains', label: 'Rule chains', icon: Zap },
    { 
      id: 'edge-management', 
      label: 'Edge management', 
      icon: Settings,
      hasChildren: true,
      children: [
        { id: 'edge-instances', label: 'Edge instances' },
        { id: 'edge-rule-chains', label: 'Edge rule chains' }
      ]
    },
    { 
      id: 'advanced-features', 
      label: 'Advanced features', 
      icon: Settings,
      hasChildren: true,
      children: [
        { id: 'scheduler', label: 'Scheduler' },
        { id: 'reporting', label: 'Reporting' }
      ]
    },
    { 
      id: 'resources', 
      label: 'Resources', 
      icon: Settings,
      hasChildren: true,
      children: [
        { id: 'js-libraries', label: 'JS libraries' },
        { id: 'images', label: 'Images' }
      ]
    },
    { id: 'notification-center', label: 'Notification center', icon: Bell },
    { id: 'mobile-center', label: 'Mobile center', icon: Smartphone }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div key={item.id} className="nav-item">
            <button 
              className={`nav-link ${item.active ? 'active' : ''}`}
              onClick={() => item.hasChildren && toggleExpanded(item.id)}
            >
              <item.icon size={20} />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.hasChildren && (
                    <span className="expand-icon">
                      {expandedItems.includes(item.id) ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                    </span>
                  )}
                </>
              )}
            </button>
            {!collapsed && item.hasChildren && expandedItems.includes(item.id) && (
              <div className="nav-children">
                {item.children?.map(child => (
                  <button key={child.id} className="nav-child-link">
                    <span>{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
