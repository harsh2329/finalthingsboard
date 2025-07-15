import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import './DashboardsSection.css';

const DashboardsSection: React.FC = () => {
  return (
    <div className="dashboards-section">
      <div className="section-header">
        <h3>Dashboards</h3>
        <button className="add-dashboard-btn">
          <Plus size={16} />
          Add dashboard
        </button>
      </div>
      
      <div className="dashboard-filter">
        <button className="filter-btn">
          Last viewed
          <ChevronDown size={16} />
        </button>
      </div>
      
      <div className="no-dashboards">
        <div className="empty-icon">✨</div>
        <div className="empty-text">No last viewed dashboards yet</div>
      </div>
    </div>
  );
};

export default DashboardsSection;