import React from 'react';
import { Edit, AlertTriangle, BarChart3, Smartphone, FileText } from 'lucide-react';
import './QuickLinks.css';

const QuickLinks = () => {
  const links = [
    { icon: AlertTriangle, label: 'Alarms', color: '#f44336' },
    { icon: BarChart3, label: 'Dashboards', color: '#2196f3' },
    { icon: Smartphone, label: 'Devices', color: '#4caf50' },
    { icon: FileText, label: 'Documentation', color: '#ff9800' }
  ];

  return (
    <div className="quick-links">
      <div className="section-header">
        <h3>Quick links</h3>
        <button className="edit-btn">
          <Edit size={16} />
        </button>
      </div>
      
      <div className="links-grid">
        {links.map((link, index) => (
          <button key={index} className="link-item">
            <link.icon size={20} style={{ color: link.color }} />
            <span>{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
