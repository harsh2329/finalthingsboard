
// import '../../assets/css/DeviceModal.css';
// import React, { useState, useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const DeviceManagement = () => {
//   const [devices, setDevices] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingDevice, setEditingDevice] = useState(null);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     label: '',
//     deviceProfile: 'default',
//     isGateway: false,
//     customerId: '',
//     description: ''
//   });

//   // Fixed device profiles to match schema
//   const deviceProfiles = [
//     'default',
//     'Air Qulaity Sensor ',  // Fixed typo to match schema
//     'Charging Port',
//     'Heat Sensor',
//     'sand Filter',
//     'Valve',
//     'Water sensor',
//     'PH sensor'
//   ];

//   // Toast configuration
//   const toastConfig = {
//     position: "top-right",
//     autoClose: 3000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//   };

//   // Fetch devices on component mount
//   useEffect(() => {
//     fetchDevices();
//   }, []);

//   const fetchDevices = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('Fetching devices from: http://localhost:1000/device/all');
      
//       const response = await fetch('http://localhost:1000/device/all', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Response status:', response.status);
//       console.log('Response headers:', response.headers);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Error response:', errorText);
//         toast.error(`Failed to fetch devices: ${errorText}`, toastConfig);
//         throw new Error(`HTTP ${response.status}: ${errorText}`);
//       }

//       const result = await response.json();
//       console.log('Fetched devices result:', result);
      
//       // Handle both possible response structures
//       const devicesData = result.data || result || [];
//       setDevices(Array.isArray(devicesData) ? devicesData : []);
      
//       if (devicesData.length > 0) {
//         toast.success(`Successfully loaded ${devicesData.length} devices`, toastConfig);
//       }
      
//     } catch (error) {
//       console.error('Error fetching devices:', error);
//       setError(error.message);
//       setDevices([]); // Set empty array on error
//       toast.error(`Error loading devices: ${error.message}`, toastConfig);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // Helper function to validate ObjectId format
//   const isValidObjectId = (id) => {
//     return /^[0-9a-fA-F]{24}$/.test(id);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Client-side validation
//     if (!formData.name.trim()) {
//       toast.error('Device name is required', toastConfig);
//       return;
//     }
//     if (!formData.label.trim()) {
//       toast.error('Device label is required', toastConfig);
//       return;
//     }

//     // Validate customerId if provided
//     if (formData.customerId && formData.customerId.trim()) {
//       if (!isValidObjectId(formData.customerId.trim())) {
//         toast.error('Invalid Customer ID format. Please enter a valid 24-character ObjectId.', toastConfig);
//         return;
//       }
//     }

//     // Prepare form data
//     const submitData = {
//       name: formData.name.trim(),
//       label: formData.label.trim(),
//       deviceProfile: formData.deviceProfile,
//       isGateway: formData.isGateway,
//       description: formData.description.trim()
//     };

//     // Only add customerId if it's not empty AND valid
//     if (formData.customerId && 
//         formData.customerId.trim() && 
//         formData.customerId.trim() !== '' &&
//         isValidObjectId(formData.customerId.trim())) {
//       submitData.customerId = formData.customerId.trim();
//     }

//     // Show loading toast
//     const loadingToast = toast.loading(
//       editingDevice ? 'Updating device...' : 'Adding device...', 
//       toastConfig
//     );

//     try {
//       const baseUrl = 'http://localhost:1000/device';
//       const url = editingDevice
//         ? `${baseUrl}/${editingDevice._id}`
//         : `${baseUrl}/add`;

//       const method = editingDevice ? 'PUT' : 'POST';

//       console.log('Submitting data:', submitData);

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(submitData),
//       });

//       const responseText = await response.text();
//       console.log('Response status:', response.status);
//       console.log('Response text:', responseText);

//       // Dismiss loading toast
//       toast.dismiss(loadingToast);

//       if (response.ok) {
//         let result = {};
//         try {
//           result = responseText ? JSON.parse(responseText) : {};
//         } catch (parseError) {
//           console.warn('Could not parse response as JSON:', parseError);
//         }
        
//         console.log(`Device ${editingDevice ? 'updated' : 'added'} successfully:`, result);
        
//         // Success toast with custom messages
//         if (editingDevice) {
//           toast.success('Device updated successfully! 🎉', toastConfig);
//         } else {
//           toast.success('Device added successfully! 🎉', toastConfig);
//         }
        
//         fetchDevices(); // Refresh list
//         closeModal();
//       } else {
//         let errorMessage = 'An error occurred.';
//         try {
//           const error = JSON.parse(responseText);
//           errorMessage = error?.message || JSON.stringify(error);
//         } catch (err) {
//           errorMessage = responseText || errorMessage;
//         }
//         console.error('Error:', errorMessage);
//         toast.error(`Error: ${errorMessage}`, toastConfig);
//       }
//     } catch (error) {
//       // Dismiss loading toast
//       toast.dismiss(loadingToast);
//       console.error('Network/unexpected error:', error);
//       toast.error(`Network error: ${error.message}`, toastConfig);
//     }
//   };

//   const handleDelete = async (deviceId) => {
//     if (window.confirm('Are you sure you want to delete this device?')) {
//       // Show loading toast
//       const loadingToast = toast.loading('Deleting device...', toastConfig);
      
//       try {
//         const response = await fetch(`http://localhost:1000/device/${deviceId}`, {
//           method: 'DELETE',
//         });

//         // Dismiss loading toast
//         toast.dismiss(loadingToast);

//         if (response.ok) {
//           console.log('Device deleted successfully');
//           toast.success('Device deleted successfully! 🗑️', toastConfig);
//           fetchDevices(); // Refresh the list
//         } else {
//           const responseText = await response.text();
//           let errorMessage = 'Error deleting device';
//           try {
//             const error = JSON.parse(responseText);
//             errorMessage = error?.message || errorMessage;
//           } catch (err) {
//             errorMessage = responseText || errorMessage;
//           }
//           console.error('Error deleting device:', errorMessage);
//           toast.error(`Error deleting device: ${errorMessage}`, toastConfig);
//         }
//       } catch (error) {
//         // Dismiss loading toast
//         toast.dismiss(loadingToast);
//         console.error('Error deleting device:', error);
//         toast.error(`Network error: ${error.message}`, toastConfig);
//       }
//     }
//   };

//   const handleEdit = (device) => {
//     setEditingDevice(device);
    
//     // Better handling of customerId - only set if it exists and is valid
//     let customerIdValue = '';
//     if (device.customerId) {
//       if (typeof device.customerId === 'string') {
//         customerIdValue = device.customerId;
//       } else if (device.customerId._id) {
//         customerIdValue = device.customerId._id;
//       }
//     }
    
//     setFormData({
//       name: device.name || '',
//       label: device.label || '',
//       deviceProfile: device.deviceProfile || 'default',
//       isGateway: device.isGateway || false,
//       customerId: customerIdValue,
//       description: device.description || ''
//     });
//     setCurrentStep(1);
//     setShowModal(true);
    
//     toast.info(`Editing device: ${device.name}`, toastConfig);
//   };

//   const openModal = () => {
//     setEditingDevice(null);
//     setFormData({
//       name: '',
//       label: '',
//       deviceProfile: 'default',
//       isGateway: false,
//       customerId: '', // Ensure this is always an empty string, not undefined
//       description: ''
//     });
//     setCurrentStep(1);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingDevice(null);
//     setCurrentStep(1);
//   };

//   const nextStep = () => {
//     if (currentStep < 2) {
//       setCurrentStep(currentStep + 1);
//       toast.info('Moved to credentials step', toastConfig);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       toast.info('Back to device details', toastConfig);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString();
//   };

//   const handleRefresh = () => {
//     toast.info('Refreshing devices list...', toastConfig);
//     fetchDevices();
//   };

//   return (
//     <div className="device-management">
//       {/* Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />

//       {/* Header */}
//       <div className="header">
//         <div className="header-content">
//           <div className="header-left">
//             <div className="header-icon">📱</div>
//             <h1>Devices</h1>
//           </div>
//           <div className="header-right">
//             <button className="add-btn" onClick={openModal}>
//               <span className="plus-icon">+</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="content">
//         <div className="content-header">
//           <h2>Devices</h2>
//           <div className="content-actions">
//             <button className="filter-btn">🔽 Device Filter</button>
//             <button className="add-device-btn" onClick={openModal}>+</button>
//             <button className="refresh-btn" onClick={handleRefresh}>⟳</button>
//             <button className="search-btn">🔍</button>
//           </div>
//         </div>

//         {/* Loading and Error States */}
//         {loading && (
//           <div style={{textAlign: 'center', padding: '20px'}}>
//             Loading devices...
//           </div>
//         )}

//         {error && (
//           <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>
//             Error: {error}
//             <br />
//             <button onClick={fetchDevices} style={{marginTop: '10px'}}>
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Table */}
//         {!loading && !error && (
//           <div className="table-container">
//             <table className="devices-table">
//               <thead>
//                 <tr>
//                   <th><input type="checkbox" /></th>
//                   <th>Created time ↑</th>
//                   <th>Name</th>
//                   <th>Device profile</th>
//                   <th>Label</th>
//                   <th>State</th>
//                   <th>Customer</th>
//                   <th>Public</th>
//                   <th>Is gateway</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {devices.length === 0 ? (
//                   <tr>
//                     <td colSpan="10" style={{textAlign: 'center'}}>No devices found</td>
//                   </tr>
//                 ) : (
//                   devices.map((device) => (
//                     <tr key={device._id}>
//                       <td><input type="checkbox" /></td>
//                       <td>{formatDate(device.createdAt || Date.now())}</td>
//                       <td>{device.name}</td>
//                       <td>
//                         <span className="device-profile">{device.deviceProfile}</span>
//                       </td>
//                       <td>{device.label}</td>
//                       <td>
//                         <span className="state inactive">Inactive</span>
//                       </td>
//                       <td>{device.customerId?.name || '-'}</td>
//                       <td>
//                         <input type="checkbox" disabled />
//                       </td>
//                       <td>
//                         <input type="checkbox" checked={device.isGateway} disabled />
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           <button className="action-btn share" title="Share">📤</button>
//                           <button className="action-btn assign" title="Assign">👤</button>
//                           <button className="action-btn manage" title="Manage">⚙️</button>
//                           <button className="action-btn copy" title="Copy">📋</button>
//                           <button className="action-btn info" title="Info">ℹ️</button>
//                           <button 
//                             className="action-btn edit" 
//                             title="Edit"
//                             onClick={() => handleEdit(device)}
//                           >✏️</button>
//                           <button 
//                             className="action-btn delete" 
//                             title="Delete"
//                             onClick={() => handleDelete(device._id)}
//                           >🗑️</button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>{editingDevice ? 'Edit device' : 'Add new device'}</h3>
//               <div className="modal-actions">
//                 <button className="help-btn">?</button>
//                 <button className="close-btn" onClick={closeModal}>×</button>
//               </div>
//             </div>

//             <div className="modal-steps">
//               <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
//                 <span className="step-number">1</span>
//                 <span className="step-label">Device details</span>
//               </div>
//               <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
//                 <span className="step-number">2</span>
//                 <div className="step-info">
//                   <span className="step-label">Credentials</span>
//                   <span className="step-optional">Optional</span>
//                 </div>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="modal-form">
//               <div className="form-content">
//                 {currentStep === 1 && (
//                   <>
//                     <div className="form-group">
//                       <label htmlFor="name">Name*</label>
//                       <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         required
//                         placeholder="Enter device name"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="label">Label*</label>
//                       <input
//                         type="text"
//                         id="label"
//                         name="label"
//                         value={formData.label}
//                         onChange={handleInputChange}
//                         required
//                         placeholder="Enter device label"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="deviceProfile">Device profile*</label>
//                       <select
//                         id="deviceProfile"
//                         name="deviceProfile"
//                         value={formData.deviceProfile}
//                         onChange={handleInputChange}
//                         required
//                       >
//                         {deviceProfiles.map(profile => (
//                           <option key={profile} value={profile}>{profile}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="form-group checkbox-group">
//                       <input
//                         type="checkbox"
//                         id="isGateway"
//                         name="isGateway"
//                         checked={formData.isGateway}
//                         onChange={handleInputChange}
//                       />
//                       <label htmlFor="isGateway">Is gateway</label>
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="customerId">Assign to customer</label>
//                       <input
//                         type="text"
//                         id="customerId"
//                         name="customerId"
//                         value={formData.customerId}
//                         onChange={handleInputChange}
//                         placeholder="Customer ID (24-character ObjectId, optional)"
//                         title="Enter a valid 24-character MongoDB ObjectId or leave empty"
//                       />
//                       <small style={{color: '#666', fontSize: '12px'}}>
//                         Format: 24-character hex string (e.g., 507f1f77bcf86cd799439011)
//                       </small>
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="description">Description</label>
//                       <textarea
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         rows="4"
//                         placeholder="Enter device description"
//                       />
//                     </div>
//                   </>
//                 )}

//                 {currentStep === 2 && (
//                   <div className="credentials-step">
//                     <p>Credentials configuration (Optional)</p>
//                     <p>This step is optional and can be configured later.</p>
//                   </div>
//                 )}
//               </div>

//               <div className="modal-footer">
//                 <div className="footer-left">
//                   {currentStep === 2 && (
//                     <button type="button" onClick={prevStep} className="prev-btn">
//                       Previous
//                     </button>
//                   )}
//                 </div>
//                 <div className="footer-right">
//                   {currentStep === 1 && (
//                     <button type="button" onClick={nextStep} className="next-btn">
//                       Next: Credentials
//                     </button>
//                   )}
//                   <button type="button" onClick={closeModal} className="cancel-btn">
//                     Cancel
//                   </button>
//                   <button type="submit" className="add-submit-btn">
//                     {editingDevice ? 'Update' : 'Add'}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeviceManagement;

import '../../assets/css/DeviceModal.css';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [customers, setCustomers] = useState([]); // New state for customers
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false); // New loading state for customers
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    deviceProfile: 'default',
    isGateway: false,
    customerId: '', // This will now store the selected customer's ObjectId
    description: ''
  });

  // Fixed device profiles to match schema
  const deviceProfiles = [
    'default',
    'Air Qulaity Sensor ',  // Fixed typo to match schema
    'Charging Port',
    'Heat Sensor',
    'sand Filter',
    'Valve',
    'Water sensor',
    'PH sensor'
  ];

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

  // Fetch devices and customers on component mount
  useEffect(() => {
    fetchDevices();
    fetchCustomers();
  }, []);

  // New function to fetch customers
  const fetchCustomers = async () => {
    setCustomersLoading(true);
    
    try {
      console.log('Fetching customers from: http://localhost:1000/customers/all');
      
      const response = await fetch('http://localhost:1000/customers/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Customers response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching customers:', errorText);
        toast.error(`Failed to fetch customers: ${errorText}`, toastConfig);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Fetched customers result:', result);
      
      // Handle both possible response structures
      const customersData = result.data || result || [];
      setCustomers(Array.isArray(customersData) ? customersData : []);
      
      console.log(`Successfully loaded ${customersData.length} customers`);
      
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]); // Set empty array on error
      toast.error(`Error loading customers: ${error.message}`, toastConfig);
    } finally {
      setCustomersLoading(false);
    }
  };

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching devices from: http://localhost:1000/device/all');
      
      const response = await fetch('http://localhost:1000/device/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to fetch devices: ${errorText}`, toastConfig);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Fetched devices result:', result);
      
      // Handle both possible response structures
      const devicesData = result.data || result || [];
      setDevices(Array.isArray(devicesData) ? devicesData : []);
      
      if (devicesData.length > 0) {
        toast.success(`Successfully loaded ${devicesData.length} devices`, toastConfig);
      }
      
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError(error.message);
      setDevices([]); // Set empty array on error
      toast.error(`Error loading devices: ${error.message}`, toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error('Device name is required', toastConfig);
      return;
    }
    if (!formData.label.trim()) {
      toast.error('Device label is required', toastConfig);
      return;
    }

    // Prepare form data
    const submitData = {
      name: formData.name.trim(),
      label: formData.label.trim(),
      deviceProfile: formData.deviceProfile,
      isGateway: formData.isGateway,
      description: formData.description.trim()
    };

    // Only add customerId if it's selected and not empty
    if (formData.customerId && formData.customerId.trim() && formData.customerId !== '') {
      submitData.customerId = formData.customerId.trim();
    }

    // Show loading toast
    const loadingToast = toast.loading(
      editingDevice ? 'Updating device...' : 'Adding device...', 
      toastConfig
    );

    try {
      const baseUrl = 'http://localhost:1000/device';
      const url = editingDevice
        ? `${baseUrl}/${editingDevice._id}`
        : `${baseUrl}/add`;

      const method = editingDevice ? 'PUT' : 'POST';

      console.log('Submitting data:', submitData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        let result = {};
        try {
          result = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.warn('Could not parse response as JSON:', parseError);
        }
        
        console.log(`Device ${editingDevice ? 'updated' : 'added'} successfully:`, result);
        
        // Success toast with custom messages
        if (editingDevice) {
          toast.success('Device updated successfully! 🎉', toastConfig);
        } else {
          toast.success('Device added successfully! 🎉', toastConfig);
        }
        
        fetchDevices(); // Refresh list
        closeModal();
      } else {
        let errorMessage = 'An error occurred.';
        try {
          const error = JSON.parse(responseText);
          errorMessage = error?.message || JSON.stringify(error);
        } catch (err) {
          errorMessage = responseText || errorMessage;
        }
        console.error('Error:', errorMessage);
        toast.error(`Error: ${errorMessage}`, toastConfig);
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      console.error('Network/unexpected error:', error);
      toast.error(`Network error: ${error.message}`, toastConfig);
    }
  };

  const handleDelete = async (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      // Show loading toast
      const loadingToast = toast.loading('Deleting device...', toastConfig);
      
      try {
        const response = await fetch(`http://localhost:1000/device/${deviceId}`, {
          method: 'DELETE',
        });

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        if (response.ok) {
          console.log('Device deleted successfully');
          toast.success('Device deleted successfully! 🗑️', toastConfig);
          fetchDevices(); // Refresh the list
        } else {
          const responseText = await response.text();
          let errorMessage = 'Error deleting device';
          try {
            const error = JSON.parse(responseText);
            errorMessage = error?.message || errorMessage;
          } catch (err) {
            errorMessage = responseText || errorMessage;
          }
          console.error('Error deleting device:', errorMessage);
          toast.error(`Error deleting device: ${errorMessage}`, toastConfig);
        }
      } catch (error) {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        console.error('Error deleting device:', error);
        toast.error(`Network error: ${error.message}`, toastConfig);
      }
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    
    // Better handling of customerId - extract the ObjectId from populated customer
    let customerIdValue = '';
    if (device.customerId) {
      if (typeof device.customerId === 'string') {
        customerIdValue = device.customerId;
      } else if (device.customerId._id) {
        customerIdValue = device.customerId._id;
      }
    }
    
    setFormData({
      name: device.name || '',
      label: device.label || '',
      deviceProfile: device.deviceProfile || 'default',
      isGateway: device.isGateway || false,
      customerId: customerIdValue,
      description: device.description || ''
    });
    setCurrentStep(1);
    setShowModal(true);
    
    toast.info(`Editing device: ${device.name}`, toastConfig);
  };

  const openModal = () => {
    setEditingDevice(null);
    setFormData({
      name: '',
      label: '',
      deviceProfile: 'default',
      isGateway: false,
      customerId: '', // Ensure this is always an empty string, not undefined
      description: ''
    });
    setCurrentStep(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDevice(null);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      toast.info('Moved to credentials step', toastConfig);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      toast.info('Back to device details', toastConfig);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleRefresh = () => {
    toast.info('Refreshing devices list...', toastConfig);
    fetchDevices();
  };

  // Helper function to get customer name by ID
  const getCustomerNameById = (customerId) => {
    if (!customerId) return '-';
    
    // If customerId is populated (object with _id and name)
    if (typeof customerId === 'object' && customerId.name) {
      return customerId.name;
    }
    
    // If customerId is just an ObjectId string, find the customer
    const customer = customers.find(c => c._id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  return (
    <div className="device-management">
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
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">📱</div>
            <h1>Devices</h1>
          </div>
          <div className="header-right">
            <button className="add-btn" onClick={openModal}>
              <span className="plus-icon">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <div className="content-header">
          <h2>Devices</h2>
          <div className="content-actions">
            <button className="filter-btn">🔽 Device Filter</button>
            <button className="add-device-btn" onClick={openModal}>+</button>
            <button className="refresh-btn" onClick={handleRefresh}>⟳</button>
            <button className="search-btn">🔍</button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div style={{textAlign: 'center', padding: '20px'}}>
            Loading devices...
          </div>
        )}

        {error && (
          <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>
            Error: {error}
            <br />
            <button onClick={fetchDevices} style={{marginTop: '10px'}}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="table-container">
            <table className="devices-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Created time ↑</th>
                  <th>Name</th>
                  <th>Device profile</th>
                  <th>Label</th>
                  <th>State</th>
                  <th>Customer</th>
                  <th>Public</th>
                  <th>Is gateway</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{textAlign: 'center'}}>No devices found</td>
                  </tr>
                ) : (
                  devices.map((device) => (
                    <tr key={device._id}>
                      <td><input type="checkbox" /></td>
                      <td>{formatDate(device.createdAt || Date.now())}</td>
                      <td>{device.name}</td>
                      <td>
                        <span className="device-profile">{device.deviceProfile}</span>
                      </td>
                      <td>{device.label}</td>
                      <td>
                        <span className="state inactive">Inactive</span>
                      </td>
                      <td>{getCustomerNameById(device.customerId)}</td>
                      <td>
                        <input type="checkbox" disabled />
                      </td>
                      <td>
                        <input type="checkbox" checked={device.isGateway} disabled />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn share" title="Share">📤</button>
                          <button className="action-btn assign" title="Assign">👤</button>
                          <button className="action-btn manage" title="Manage">⚙️</button>
                          <button className="action-btn copy" title="Copy">📋</button>
                          <button className="action-btn info" title="Info">ℹ️</button>
                          <button 
                            className="action-btn edit" 
                            title="Edit"
                            onClick={() => handleEdit(device)}
                          >✏️</button>
                          <button 
                            className="action-btn delete" 
                            title="Delete"
                            onClick={() => handleDelete(device._id)}
                          >🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingDevice ? 'Edit device' : 'Add new device'}</h3>
              <div className="modal-actions">
                <button className="help-btn">?</button>
                <button className="close-btn" onClick={closeModal}>×</button>
              </div>
            </div>

            <div className="modal-steps">
              <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Device details</span>
              </div>
              <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <div className="step-info">
                  <span className="step-label">Credentials</span>
                  <span className="step-optional">Optional</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-content">
                {currentStep === 1 && (
                  <>
                    <div className="form-group">
                      <label htmlFor="name">Name*</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter device name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="label">Label*</label>
                      <input
                        type="text"
                        id="label"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter device label"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="deviceProfile">Device profile*</label>
                      <select
                        id="deviceProfile"
                        name="deviceProfile"
                        value={formData.deviceProfile}
                        onChange={handleInputChange}
                        required
                      >
                        {deviceProfiles.map(profile => (
                          <option key={profile} value={profile}>{profile}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="isGateway"
                        name="isGateway"
                        checked={formData.isGateway}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isGateway">Is gateway</label>
                    </div>

                    {/* Updated Customer Selection Dropdown */}
                    <div className="form-group">
                      <label htmlFor="customerId">Assign to customer</label>
                      <select
                        id="customerId"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a customer (optional)</option>
                        {customersLoading ? (
                          <option disabled>Loading customers...</option>
                        ) : (
                          customers.map((customer) => (
                            <option key={customer._id} value={customer._id}>
                              {customer.name} {customer.email ? `(${customer.email})` : ''}
                            </option>
                          ))
                        )}
                      </select>
                      {customersLoading && (
                        <small style={{color: '#666', fontSize: '12px'}}>
                          Loading customers...
                        </small>
                      )}
                      {!customersLoading && customers.length === 0 && (
                        <small style={{color: '#666', fontSize: '12px'}}>
                          No customers available. Create a customer first.
                        </small>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Enter device description"
                      />
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <div className="credentials-step">
                    <p>Credentials configuration (Optional)</p>
                    <p>This step is optional and can be configured later.</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <div className="footer-left">
                  {currentStep === 2 && (
                    <button type="button" onClick={prevStep} className="prev-btn">
                      Previous
                    </button>
                  )}
                </div>
                <div className="footer-right">
                  {currentStep === 1 && (
                    <button type="button" onClick={nextStep} className="next-btn">
                      Next: Credentials
                    </button>
                  )}
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="add-submit-btn">
                    {editingDevice ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;