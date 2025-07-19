import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import CustomerModal from './CustomerModal';
import axios from 'axios';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${API_BASE_URL}/customers/${customerId}`);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        await axios.put(`${API_BASE_URL}/customers/${editingCustomer.id}`, customerData);
        toast.success('Customer updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/customers`, customerData);
        toast.success('Customer added successfully');
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to save customer');
    }
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <button className="add-button" onClick={handleAddCustomer}>
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <div className="data-table">
        <table className="table">
          <thead>
            <tr>
              <th>Created Time</th>
              <th>Title</th>
              <th>Email</th>
              <th>Country</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <h3>No customers found</h3>
                  <p>Click "Add Customer" to create your first customer</p>
                </td>
              </tr>
            ) : (
              customers.map(customer => (
                <tr key={customer.id}>
                  <td>{new Date(customer.createdAt).toLocaleString()}</td>
                  <td>{customer.title}</td>
                  <td>{customer.email}</td>
                  <td>{customer.country}</td>
                  <td>{customer.city}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn" title="View">
                        <Eye size={14} />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditCustomer(customer)}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDeleteCustomer(customer.id)}
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
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerManagement;