import React, { useState, useEffect } from 'react';
import { Plus, X, Search, RefreshCw, MoreVertical, Users, Edit, Trash2, Info, RotateCcw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: '',
    city: '',
    state: '',
    zipCode: '',
    address: '',
    address2: '',
    phone: '',
    email: ''
  });

  // API base URL - matches your server route app.use('/customers', CustomerRoutes)
  const API_BASE_URL = 'https://thingsbackend-mh3j.onrender.com-mh3j.onrender.com-mh3j.onrender.com/customers';

  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Fetch all customers - GET /customers/all
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/all`);
      
      if (response.ok) {
        const data = await response.json();
        // Handle different response formats
        const customersArray = Array.isArray(data) ? data : (data.customers || data.data || []);
        setCustomers(customersArray);
        
        if (customersArray.length > 0) {
          toast.success(`Successfully loaded ${customersArray.length} customers`, toastConfig);
        }
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch customers: ${response.status} ${response.statusText}`);
        toast.error(`Failed to load customers: ${errorText}`, toastConfig);
      }
    } catch (error) {
      setError(`Connection error: ${error.message}. Make sure your server is running on port 1000.`);
      toast.error(`Connection error: ${error.message}`, toastConfig);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customer stats - GET /customers/stats
  const fetchCustomerStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (response.ok) {
        const stats = await response.json();
        setCustomerStats(stats);
        toast.info(`Customer stats loaded`, toastConfig);
      }
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    }
  };

  // Get customer by ID - GET /customers/:id
  const getCustomerById = async (customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}`);
      if (response.ok) {
        const customer = await response.json();
        toast.info(`Loaded customer: ${customer.title}`, toastConfig);
        return customer;
      } else {
        toast.error('Failed to load customer details', toastConfig);
        return null;
      }
    } catch (error) {
      toast.error(`Error loading customer: ${error.message}`, toastConfig);
      return null;
    }
  };

  // Create new customer - POST /customers/add
  const createCustomer = async (customerData) => {
    const loadingToast = toast.loading('Adding customer...', toastConfig);
    
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        const newCustomer = await response.json();
        setCustomers(prev => [newCustomer, ...prev]);
        toast.success('Customer added successfully! 🎉', toastConfig);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(`Failed to create customer: ${errorData.message || response.statusText}`);
        toast.error(`Failed to create customer: ${errorData.message || response.statusText}`, toastConfig);
        return false;
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      setError(`Connection error: ${error.message}. Make sure your server is running on port 1000.`);
      toast.error(`Network error: ${error.message}`, toastConfig);
      return false;
    }
  };

  // Update customer - PUT /customers/:id
  const updateCustomer = async (customerId, customerData) => {
    const loadingToast = toast.loading('Updating customer...', toastConfig);
    
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData)
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomers(prev => prev.map(customer => 
          customer._id === customerId ? updatedCustomer : customer
        ));
        toast.success('Customer updated successfully! 🎉', toastConfig);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        toast.error(`Failed to update customer: ${errorData.message || response.statusText}`, toastConfig);
        return false;
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Network error: ${error.message}`, toastConfig);
      return false;
    }
  };

  // Delete customer - DELETE /customers/:id
  const deleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const loadingToast = toast.loading('Deleting customer...', toastConfig);
      
      try {
        const response = await fetch(`${API_BASE_URL}/${customerId}`, {
          method: 'DELETE',
        });

        toast.dismiss(loadingToast);

        if (response.ok) {
          setCustomers(prev => prev.filter(customer => customer._id !== customerId));
          toast.success('Customer deleted successfully! 🗑️', toastConfig);
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          toast.error(`Failed to delete customer: ${errorData.message || response.statusText}`, toastConfig);
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(`Network error: ${error.message}`, toastConfig);
      }
    }
  };

  // Restore customer - PATCH /customers/:id/restore
  const restoreCustomer = async (customerId) => {
    const loadingToast = toast.loading('Restoring customer...', toastConfig);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${customerId}/restore`, {
        method: 'PATCH',
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        const restoredCustomer = await response.json();
        setCustomers(prev => prev.map(customer => 
          customer._id === customerId ? restoredCustomer : customer
        ));
        toast.success('Customer restored successfully! ↻', toastConfig);
        fetchCustomers(); // Refresh the list
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        toast.error(`Failed to restore customer: ${errorData.message || response.statusText}`, toastConfig);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Network error: ${error.message}`, toastConfig);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchCustomerStats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.title.trim()) {
      toast.error('Customer title is required', toastConfig);
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Customer email is required', toastConfig);
      return;
    }
    if (!formData.country.trim()) {
      toast.error('Country is required', toastConfig);
      return;
    }

    let success;
    if (editingCustomer) {
      success = await updateCustomer(editingCustomer._id, formData);
    } else {
      success = await createCustomer(formData);
    }
    
    if (success) {
      setIsModalOpen(false);
      setEditingCustomer(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      country: '',
      city: '',
      state: '',
      zipCode: '',
      address: '',
      address2: '',
      phone: '',
      email: ''
    });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      title: customer.title || '',
      description: customer.description || '',
      country: customer.country || '',
      city: customer.city || '',
      state: customer.state || '',
      zipCode: customer.zipCode || '',
      address: customer.address || '',
      address2: customer.address2 || '',
      phone: customer.phone || '',
      email: customer.email || ''
    });
    setIsModalOpen(true);
    toast.info(`Editing customer: ${customer.title}`, toastConfig);
  };

  const openModal = () => {
    setEditingCustomer(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    toast.info('Refreshing customers list...', toastConfig);
    fetchCustomers();
  };

  const filteredCustomers = Array.isArray(customers) 
    ? customers.filter(customer =>
        customer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.city?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(',', '');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6" />
          <h1 className="text-xl font-medium">Customers</h1>
        </div>
        <div className="flex items-center">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center">
            {customerStats?.total || customers.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white m-4 rounded shadow">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-medium">Customers</h2>
          <div className="flex items-center gap-2">
            <button 
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center transition-colors"
              onClick={openModal}
            >
              <Plus size={16} />
            </button>
            <button 
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created time <span className="text-gray-400">↓</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {isLoading ? 'Loading customers...' : 'No customers found'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    {customer.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => getCustomerById(customer._id)}
                        title="View Details"
                      >
                        <Info size={16} />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-800 p-1"
                        onClick={() => handleEdit(customer)}
                        title="Edit Customer"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-orange-600 hover:text-orange-800 p-1"
                        onClick={() => restoreCustomer(customer._id)}
                        title="Restore Customer"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 p-1"
                        onClick={() => deleteCustomer(customer._id)}
                        title="Delete Customer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-screen overflow-y-auto">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h3 className="text-lg font-medium">
                {editingCustomer ? 'Edit customer' : 'Add customer'}
              </h3>
              <button 
                className="text-white hover:text-gray-200"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Title*"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="country"
                  placeholder="Country*"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State / Province"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip / Postal Code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="address2"
                  placeholder="Address 2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white">
                  <option value="US">US</option>
                  <option value="IN">IN</option>
                  <option value="UK">UK</option>
                  <option value="DE">DE</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number in E.164 format. ex. +12015550123"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  {editingCustomer ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;