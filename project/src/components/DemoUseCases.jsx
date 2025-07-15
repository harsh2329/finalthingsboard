import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DemoUseCases.css';

const DemoUseCases = () => {
  const useCases = [
    {
      id: 'environmental',
      title: 'Environmental monitoring',
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 'air-quality',
      title: 'Air quality',
      image: 'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 'ev-charging',
      title: 'EV charging stations',
      image: 'https://images.pexels.com/photos/7841419/pexels-photo-7841419.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 'swimming-pool',
      title: 'Swimming pool SCADA',
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 'device-claiming',
      title: 'Device claiming',
      image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    }
  ];

  return (
    <div className="demo-use-cases">
      <div className="demo-header">
        <h2>Demo use cases</h2>
        <div className="demo-navigation">
          <button className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <button className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="demo-grid">
        {useCases.map(useCase => (
          <div key={useCase.id} className="demo-card">
            <div className="demo-image">
              <img src={useCase.image} alt={useCase.title} />
            </div>
            <div className="demo-title">{useCase.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoUseCases;
