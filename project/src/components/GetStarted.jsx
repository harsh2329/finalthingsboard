import React from 'react';
import { FileText } from 'lucide-react';
import './GetStarted.css';

const GetStarted = () => {
  const steps = [
    {
      number: 1,
      title: 'Create device',
      description: "Let's provision your first device to the platform via UI. Follow the documentation on how to do it:",
      hasLink: true
    },
    {
      number: 2,
      title: 'Connect device',
      description: ''
    },
    {
      number: 3,
      title: 'Create dashboard',
      description: ''
    },
    {
      number: 4,
      title: 'Configure alarm rules',
      description: ''
    },
    {
      number: 5,
      title: 'Create alarm',
      description: ''
    },
    {
      number: 6,
      title: 'Create customer and assign dashboard',
      description: ''
    }
  ];

  return (
    <div className="get-started">
      <h3>Get started</h3>
      
      <div className="steps-list">
        {steps.map(step => (
          <div key={step.number} className="step-item">
            <div className="step-number">{step.number}</div>
            <div className="step-content">
              <div className="step-title">{step.title}</div>
              {step.description && (
                <div className="step-description">{step.description}</div>
              )}
              {step.hasLink && (
                <div className="step-actions">
                  <button className="doc-link">
                    <FileText size={16} />
                    How to create Device
                  </button>
                  <button className="devices-link">Devices</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetStarted;
