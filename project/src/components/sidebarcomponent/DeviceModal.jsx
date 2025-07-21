// import React, { useState, useEffect } from 'react';
// import '../../assets/css/DeviceModal.css';

// const DeviceManagement = () => {
//   const [devices, setDevices] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingDevice, setEditingDevice] = useState(null);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: '',
//     label: '',
//     deviceProfile: 'default',
//     isGateway: false,
//     customerId: '',
//     description: ''
//   });

//   const deviceProfiles = [
//     'default',
//     'Air Quality Sensor',
//     'Charging Port',
//     'Heat Sensor',
//     'sand Filter',
//     'Valve',
//     'Water sensor',
//     'PH sensor'
//   ];

//   // Fetch devices on component mount
//   useEffect(() => {
//     fetchDevices();
//   }, []);

//   const fetchDevices = async () => {
//     try {
//       const response = await fetch('/api/devices/all');
//       if (response.ok) {
//         const result = await response.json();
//         setDevices(result.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching devices:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const url = editingDevice ? `/devices/${editingDevice._id}` : '/devices/add';
//   //     const method = editingDevice ? 'PUT' : 'POST';
      
//   //     const response = await fetch(url, {
//   //       method,
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(formData),
//   //     });

//   //     if (response.ok) {
//   //       const result = await response.json();
//   //       console.log(`Device ${editingDevice ? 'updated' : 'added'} successfully:`, result);
//   //       fetchDevices(); // Refresh the list
//   //       closeModal();
//   //     } else {
//   //       const error = await response.json();
//   //       console.error('Error:', error.message);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error submitting form:', error);
//   //   }
//   // };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const baseUrl = 'http://localhost:1000/device'; // Your backend base URL

//   try {
//     const url = editingDevice
//       ? `${baseUrl}/${editingDevice._id}`
//       : `${baseUrl}/add`;

//     const method = editingDevice ? 'PUT' : 'POST';

//     const response = await fetch(url, {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     });

//     const responseText = await response.text(); // Only read body once

//     if (response.ok) {
//       const result = responseText ? JSON.parse(responseText) : {};
//       console.log(`Device ${editingDevice ? 'updated' : 'added'} successfully:`, result);
//       fetchDevices(); // Refresh list
//       closeModal();
//     } else {
//       let errorMessage = 'An error occurred.';
//       try {
//         const error = JSON.parse(responseText);
//         errorMessage = error?.message || JSON.stringify(error);
//       } catch (err) {
//         errorMessage = responseText || errorMessage;
//       }
//       console.error('Error:', errorMessage);
//       alert(`Error: ${errorMessage}`);
//     }
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     alert(`Unexpected error: ${error.message}`);
//   }
// };


//   const handleDelete = async (deviceId) => {
//     if (window.confirm('Are you sure you want to delete this device?')) {
//       try {
//         const response = await fetch(`/api/devices/${deviceId}`, {
//           method: 'DELETE',
//         });

//         if (response.ok) {
//           console.log('Device deleted successfully');
//           fetchDevices(); // Refresh the list
//         } else {
//           const error = await response.json();
//           console.error('Error deleting device:', error.message);
//         }
//       } catch (error) {
//         console.error('Error deleting device:', error);
//       }
//     }
//   };

//   const handleEdit = (device) => {
//     setEditingDevice(device);
//     setFormData({
//       name: device.name || '',
//       label: device.label || '',
//       deviceProfile: device.deviceProfile || 'default',
//       isGateway: device.isGateway || false,
//       customerId: device.customerId?._id || '',
//       description: device.description || ''
//     });
//     setCurrentStep(1);
//     setShowModal(true);
//   };

//   const openModal = () => {
//     setEditingDevice(null);
//     setFormData({
//       name: '',
//       label: '',
//       deviceProfile: 'default',
//       isGateway: false,
//       customerId: '',
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
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString();
//   };

//   return (
//     <div className="device-management">
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
//             <button className="refresh-btn">⟳</button>
//             <button className="search-btn">🔍</button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="table-container">
//           <table className="devices-table">
//             <thead>
//               <tr>
//                 <th><input type="checkbox" /></th>
//                 <th>Created time ↑</th>
//                 <th>Name</th>
//                 <th>Device profile</th>
//                 <th>Label</th>
//                 <th>State</th>
//                 <th>Customer</th>
//                 <th>Public</th>
//                 <th>Is gateway</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {devices.map((device) => (
//                 <tr key={device._id}>
//                   <td><input type="checkbox" /></td>
//                   <td>{formatDate(device.createdAt || Date.now())}</td>
//                   <td>{device.name}</td>
//                   <td>
//                     <span className="device-profile">{device.deviceProfile}</span>
//                   </td>
//                   <td>{device.label}</td>
//                   <td>
//                     <span className="state inactive">Inactive</span>
//                   </td>
//                   <td>{device.customerId?.name || '-'}</td>
//                   <td>
//                     <input type="checkbox" disabled />
//                   </td>
//                   <td>
//                     <input type="checkbox" checked={device.isGateway} disabled />
//                   </td>
//                   <td>
//                     <div className="action-buttons">
//                       <button className="action-btn share" title="Share">📤</button>
//                       <button className="action-btn assign" title="Assign">👤</button>
//                       <button className="action-btn manage" title="Manage">⚙️</button>
//                       <button className="action-btn copy" title="Copy">📋</button>
//                       <button className="action-btn info" title="Info">ℹ️</button>
//                       <button 
//                         className="action-btn edit" 
//                         title="Edit"
//                         onClick={() => handleEdit(device)}
//                       >✏️</button>
//                       <button 
//                         className="action-btn delete" 
//                         title="Delete"
//                         onClick={() => handleDelete(device._id)}
//                       >🗑️</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
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
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="label">Label</label>
//                       <input
//                         type="text"
//                         id="label"
//                         name="label"
//                         value={formData.label}
//                         onChange={handleInputChange}
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
//                         placeholder="Customer ID"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="description">Description</label>
//                       <textarea
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         rows="4"
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
// import React, { useState, useEffect } from 'react';
// import '../../assets/css/DeviceModal.css';import React, { useState, useEffect } from 'react';
import '../../assets/css/DeviceModal.css';
import React, { useState, useEffect } from 'react';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    deviceProfile: 'default',
    isGateway: false,
    customerId: '',
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

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:1000/device/all');
      if (response.ok) {
        const result = await response.json();
        setDevices(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper function to validate ObjectId format
  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      alert('Device name is required');
      return;
    }
    if (!formData.label.trim()) {
      alert('Device label is required');
      return;
    }

    // Validate customerId if provided
    if (formData.customerId && formData.customerId.trim()) {
      if (!isValidObjectId(formData.customerId.trim())) {
        alert('Invalid Customer ID format. Please enter a valid 24-character ObjectId.');
        return;
      }
    }

    // Prepare form data
    const submitData = {
      name: formData.name.trim(),
      label: formData.label.trim(),
      deviceProfile: formData.deviceProfile,
      isGateway: formData.isGateway,
      description: formData.description.trim()
    };

    // Only add customerId if it's not empty AND valid
    if (formData.customerId && 
        formData.customerId.trim() && 
        formData.customerId.trim() !== '' &&
        isValidObjectId(formData.customerId.trim())) {
      submitData.customerId = formData.customerId.trim();
    }

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

      if (response.ok) {
        let result = {};
        try {
          result = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.warn('Could not parse response as JSON:', parseError);
        }
        
        console.log(`Device ${editingDevice ? 'updated' : 'added'} successfully:`, result);
        alert(`Device ${editingDevice ? 'updated' : 'added'} successfully!`);
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
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Network/unexpected error:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  const handleDelete = async (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        const response = await fetch(`http://localhost:1000/device/${deviceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Device deleted successfully');
          alert('Device deleted successfully!');
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
          alert(`Error deleting device: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error deleting device:', error);
        alert(`Network error: ${error.message}`);
      }
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    
    // Better handling of customerId - only set if it exists and is valid
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
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="device-management">
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
            <button className="refresh-btn" onClick={fetchDevices}>⟳</button>
            <button className="search-btn">🔍</button>
          </div>
        </div>

        {/* Table */}
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
                    <td>{device.customerId?.name || '-'}</td>
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

                    <div className="form-group">
                      <label htmlFor="customerId">Assign to customer</label>
                      <input
                        type="text"
                        id="customerId"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleInputChange}
                        placeholder="Customer ID (24-character ObjectId, optional)"
                        title="Enter a valid 24-character MongoDB ObjectId or leave empty"
                      />
                      <small style={{color: '#666', fontSize: '12px'}}>
                        Format: 24-character hex string (e.g., 507f1f77bcf86cd799439011)
                      </small>
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
