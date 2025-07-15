import React from 'react';
import { Edit } from 'lucide-react';
import './Documentation.css';

const Documentation: React.FC = () => {
  const docLinks = [
    { label: 'Getting started', category: 'basics' },
    { label: 'Rule engine', category: 'advanced' },
    { label: 'API', category: 'development' },
    { label: 'Device profiles', category: 'devices' }
  ];

  return (
    <div className="documentation">
      <div className="section-header">
        <h3>Documentation</h3>
        <button className="edit-btn">
          <Edit size={16} />
        </button>
      </div>
      
      <div className="doc-links">
        {docLinks.map((link, index) => (
          <button key={index} className="doc-link">
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Documentation;