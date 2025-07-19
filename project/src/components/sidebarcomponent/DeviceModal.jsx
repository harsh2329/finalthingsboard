import React, { useState, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import './DeviceModal.css';

const DeviceModal = ({ device, customers, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    deviceProfile: 'default',
    isGateway: false,
    customerId: '',
    description: '',
    isPublic: false,
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (device) {
      setFormData(device);
    }
  }, [device]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Device name is required');
      return;
    }

    setLoading(true);
    
    try {
      const baseURL = 'http://localhost:1000';
      const url = device ? `${baseURL}/devices/${device.id}` : `${baseURL}/api/devices/create`;
      const method = device ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save device');
      }

      const savedDevice = await response.json();
      onSave(savedDevice);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <HelpCircle size={20} />
            <span>{device ? 'Edit Device' : 'Add new device'}</span>
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                {error}
              </div>
            )}
            
            <div className="form-section">
              <div className="section-header">
                <div className="section-number">1</div>
                <span>Device details</span>
              </div>

              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter device name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Label</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="Enter device label"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Device profile *</label>
                <select
                  name="deviceProfile"
                  value={formData.deviceProfile}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="default">default</option>
                  <option value="Valve">Valve</option>
                  <option value="Water sensor">Water sensor</option>
                  <option value="PH sensor">PH sensor</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="isGateway"
                  checked={formData.isGateway}
                  onChange={handleChange}
                  id="isGateway"
                  disabled={loading}
                />
                <label htmlFor="isGateway">Is gateway</label>
              </div>

              <div className="form-group">
                <label>Assign to customer</label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select customer</option>
                  {customers && customers.length > 0 ? (
                    customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.title}
                      </option>
                    ))
                  ) : (
                    <option disabled>No customers available</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter device description"
                  rows="4"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : (device ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceModal;