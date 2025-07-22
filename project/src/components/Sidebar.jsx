// import React, { useState } from 'react';
// import { 
//   Home, 
//   AlertTriangle, 
//   BarChart3, 
//   Layers, 
//   User, 
//   Users, 
//   Zap, 
//   Settings,
//   Smartphone,
//   Bell,
//   ChevronRight,
//   ChevronDown 
// } from 'lucide-react';
// import './Sidebar.css';
// import { Link } from 'react-router-dom';

// const Sidebar = ({ collapsed }) => {
//   const [expandedItems, setExpandedItems] = useState(['profiles']);

//   const toggleExpanded = (item) => {
//     setExpandedItems(prev => 
//       prev.includes(item) 
//         ? prev.filter(i => i !== item)
//         : [...prev, item]
//     );
//   };

//   const menuItems = [
//     { id: 'home', label: 'Home', icon: Home, active: true },
//     { id: 'alarms', label: 'Alarms', icon: AlertTriangle },
//     { id: 'dashboards', label: 'Dashboards', icon: BarChart3 },
//     { 
//       id: 'entities', 
//       label: 'Entities', 
//       icon: Layers, 
//       hasChildren: true,
//       children: [
//         { id: 'devices', label: 'Devices' },
//         { id: 'assets', label: 'Assets' },
//         { id: 'entity-views', label: 'Entity views' },
//         { id: 'customers', label: 'Customers' }
//       ]
//     },
//     { 
//       id: 'profiles', 
//       label: 'Profiles', 
//       icon: User,
//       hasChildren: true,
//       children: [
//         { id: 'device-profiles', label: 'Device profiles' },
//         { id: 'asset-profiles', label: 'Asset profiles' }
//       ]
//     },
//     // Add 'to' property for customers
//     { id: 'customers', label: 'Customers', icon: Users, to: '/customers' },
//     { id: 'rule-chains', label: 'Rule chains', icon: Zap },
//     { 
//       id: 'edge-management', 
//       label: 'Edge management', 
//       icon: Settings,
//       hasChildren: true,
//       children: [
//         { id: 'edge-instances', label: 'Edge instances' },
//         { id: 'edge-rule-chains', label: 'Edge rule chains' }
//       ]
//     },
//     { 
//       id: 'advanced-features', 
//       label: 'Advanced features', 
//       icon: Settings,
//       hasChildren: true,
//       children: [
//         { id: 'scheduler', label: 'Scheduler' },
//         { id: 'reporting', label: 'Reporting' }
//       ]
//     },
//     { 
//       id: 'resources', 
//       label: 'Resources', 
//       icon: Settings,
//       hasChildren: true,
//       children: [
//         { id: 'js-libraries', label: 'JS libraries' },
//         { id: 'images', label: 'Images' }
//       ]
//     },
//     { id: 'notification-center', label: 'Notification center', icon: Bell },
//     { id: 'mobile-center', label: 'Mobile center', icon: Smartphone }
//   ];

//   return (
//     <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
//       <nav className="sidebar-nav">
//         {menuItems.map(item => (
//           <div key={item.id} className="nav-item">
//             <button 
//               className={`nav-link ${item.active ? 'active' : ''}`}
//               onClick={() => item.hasChildren && toggleExpanded(item.id)}
//             >
//               <item.icon size={20} />
//               {!collapsed && (
//                 <>
//                   <span>{item.label}</span>
//                   {item.hasChildren && (
//                     <span className="expand-icon">
//                       {expandedItems.includes(item.id) ? 
//                         <ChevronDown size={16} /> : 
//                         <ChevronRight size={16} />
//                       }
//                     </span>
//                   )}
//                 </>
//               )}
//             </button>
//             {!collapsed && item.hasChildren && expandedItems.includes(item.id) && (
//               <div className="nav-children">
//                 {item.children?.map(child => (
//                   <button key={child.id} className="nav-child-link">
//                     <span>{child.label}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

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
import { Link } from 'react-router-dom';

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
    { id: 'home', label: 'Home', icon: Home, active: true, to: '/' },
    { id: 'alarms', label: 'Charts', icon: AlertTriangle, to: '/chart' },
    { id: 'dashboards', label: 'Dashboards', icon: BarChart3, to: '/' },
    {
      id: 'entities',
      label: 'Entities',
      icon: Layers,
      hasChildren: true,
      to: '/entities',
      children: [
        { id: 'devices', label: 'Devices', to: '/devices' },
        { id: 'assets', label: 'Assets', to: '/entities/assets' },
        { id: 'entity-views', label: 'Entity views', to: '/entities/entity-views' },
        { id: 'customers', label: 'Customers', to: '/customers' }
      ]
    },
    {
      id: 'profiles',
      label: 'Profiles',
      icon: User,
      hasChildren: true,
      to: '/profiles',
      children: [
        { id: 'device-profiles', label: 'Device profiles', to: '/profiles/device-profiles' },
        { id: 'asset-profiles', label: 'Asset profiles', to: '/profiles/asset-profiles' }
      ]
    },
    { id: 'customers', label: 'Customers', icon: Users, to: '/customers' },
    { id: 'rule-chains', label: 'Rule chains', icon: Zap, to: '/rule-chains' },
    {
      id: 'edge-management',
      label: 'Edge management',
      icon: Settings,
      hasChildren: true,
      to: '/edge-management',
      children: [
        { id: 'edge-instances', label: 'Edge instances', to: '/edge-management/edge-instances' },
        { id: 'edge-rule-chains', label: 'Edge rule chains', to: '/edge-management/edge-rule-chains' }
      ]
    },
    {
      id: 'advanced-features',
      label: 'Advanced features',
      icon: Settings,
      hasChildren: true,
      to: '/advanced-features',
      children: [
        { id: 'scheduler', label: 'Scheduler', to: '/advanced-features/scheduler' },
        { id: 'reporting', label: 'Reporting', to: '/advanced-features/reporting' }
      ]
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Settings,
      hasChildren: true,
      to: '/resources',
      children: [
        { id: 'js-libraries', label: 'JS libraries', to: '/resources/js-libraries' },
        { id: 'images', label: 'Images', to: '/resources/images' }
      ]
    },
    { id: 'notification-center', label: 'Notification center', icon: Bell, to: '/notification-center' },
    { id: 'mobile-center', label: 'Mobile center', icon: Smartphone, to: '/mobile-center' }
  ];

  const renderNavItem = (item) => {
    const content = (
      <>
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
      </>
    );

    if (item.hasChildren) {
      return (
        <button
          className={`nav-link ${item.active ? 'active' : ''}`}
          onClick={() => toggleExpanded(item.id)}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        to={item.to}
        className={`nav-link ${item.active ? 'active' : ''}`}
      >
        {content}
      </Link>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div key={item.id} className="nav-item">
            {renderNavItem(item)}
            {!collapsed && item.hasChildren && expandedItems.includes(item.id) && (
              <div className="nav-children">
                {item.children?.map(child => (
                  <Link key={child.id} to={child.to} className="nav-child-link">
                    <span>{child.label}</span>
                  </Link>
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
