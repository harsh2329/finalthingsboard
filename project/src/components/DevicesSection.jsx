import React from 'react';
import { FileText, Plus } from 'lucide-react';
import './DevicesSection.css';

const DevicesSection = () => {
  return (
    <div className="devices-section">
      <div className="section-header">
        <h3>Devices</h3>
        <div className="section-actions">
          <button className="action-btn">
            <FileText size={16} />
            View docs
          </button>
          <button className="action-btn primary">
            <Plus size={16} />
            Add device
          </button>
        </div>
      </div>
      
      <div className="devices-stats">
        <div className="stat-item">
          <div className="stat-label">Inactive</div>
          <div className="stat-value">32</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Active</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Total</div>
          <div className="stat-value">32</div>
        </div>
      </div>
    </div>
  );
};

export default DevicesSection;
