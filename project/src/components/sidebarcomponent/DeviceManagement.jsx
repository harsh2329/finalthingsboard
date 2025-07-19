import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import DeviceModal from './DeviceModal';
import axios from 'axios';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    fetchDevices();
    fetchCustomers();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/devices`);
      setDevices(response.data);
    } catch (error) {
      toast.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers');
    }
  };

  const handleAddDevice = () => {
    setEditingDevice(null);
    setIsModalOpen(true);
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setIsModalOpen(true);
  };

  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await axios.delete(`${API_BASE_URL}/devices/${deviceId}`);
        toast.success('Device deleted successfully');
        fetchDevices();
      } catch (error) {
        toast.error('Failed to delete device');
      }
    }
  };

  const handleSaveDevice = async (deviceData) => {
    try {
      if (editingDevice) {
        await axios.put(`${API_BASE_URL}/devices/${editingDevice.id}`, deviceData);
        toast.success('Device updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/devices`, deviceData);
        toast.success('Device added successfully');
      }
      setIsModalOpen(false);
      fetchDevices();
    } catch (error) {
      toast.error('Failed to save device');
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.title : 'Unassigned';
  };

  if (loading) {
    return <div className="loading">Loading devices...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Devices</h1>
        <button className="add-button" onClick={handleAddDevice}>
          <Plus size={20} />
          Add Device
        </button>
      </div>

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>Created Time</th>
              <th>Name</th>
              <th>Device Profile</th>
              <th>Label</th>
              <th>State</th>
              <th>Customer</th>
              <th>Public</th>
              <th>Is Gateway</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-state">
                  <h3>No devices found</h3>
                  <p>Click "Add Device" to create your first device</p>
                </td>
              </tr>
            ) : (
              devices.map(device => (
                <tr key={device.id}>
                  <td>{new Date(device.createdAt).toLocaleString()}</td>
                  <td>{device.name}</td>
                  <td>{device.deviceProfile}</td>
                  <td>{device.label}</td>
                  <td>
                    <span className={`status-badge ${device.isActive ? 'status-active' : 'status-inactive'}`}>
                      {device.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{getCustomerName(device.customerId)}</td>
                  <td className="checkbox-cell">
                    <input type="checkbox" checked={device.isPublic} readOnly />
                  </td>
                  <td className="checkbox-cell">
                    <input type="checkbox" checked={device.isGateway} readOnly />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn" title="View">
                        <Eye size={14} />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditDevice(device)}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDeleteDevice(device.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <DeviceModal
          device={editingDevice}
          customers={customers}
          onSave={handleSaveDevice}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DeviceManagement;