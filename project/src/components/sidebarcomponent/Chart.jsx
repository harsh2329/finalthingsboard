import React, { useState, useEffect, useRef } from 'react';
import { Activity, Plus, RefreshCw, AlertTriangle, Gauge, TrendingUp, X, Save, Thermometer, Droplets, Trash2 } from 'lucide-react';
import * as Chart from 'chart.js';

// Register Chart.js components
Chart.Chart.register(
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.PointElement,
  Chart.LineElement,
  Chart.BarElement,
  Chart.LineController,
  Chart.BarController,
  Chart.Title,
  Chart.Tooltip,
  Chart.Legend,
  Chart.Filler
);

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-xs`}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const GasPressureDashboard = () => {
  const [readings, setReadings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [formData, setFormData] = useState({
    pressure: '',
    sensorId: 'SENSOR_001',
    location: 'Main Pipeline',
    temperature: 25,
    humidity: 50
  });

  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const individualBarChartRef = useRef(null);
  const separateBarChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const individualBarChartInstance = useRef(null);
  const separateBarChartInstance = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Initialize charts
  useEffect(() => {
    initCharts();
    fetchReadings();

    return () => {
      [lineChartInstance, barChartInstance, individualBarChartInstance, separateBarChartInstance].forEach(chartRef => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
      });
    };
  }, []);

  // Update charts when readings change
  useEffect(() => {
    updateCharts();
  }, [readings]);

  const initCharts = () => {
    // Destroy existing charts first
    [lineChartInstance, barChartInstance, individualBarChartInstance, separateBarChartInstance].forEach(chartRef => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    });

    // Line Chart
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      lineChartInstance.current = new Chart.Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Gas Pressure (PSI)',
            data: [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Pressure Trend Over Time',
              font: { size: 14, weight: 'bold' },
              color: '#1f2937'
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: { size: 12 }
              }
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Time',
                font: { weight: 'bold', size: 11 }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                font: { size: 10 },
                maxRotation: 45
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Pressure (PSI)',
                font: { weight: 'bold', size: 11 }
              },
              min: 0,
              max: 200,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                font: { size: 10 }
              }
            }
          },
          animation: {
            duration: 750,
            easing: 'easeInOutQuart'
          }
        }
      });
    }

    // Average Bar Chart by Sensor
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      barChartInstance.current = new Chart.Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Average Pressure by Sensor',
            data: [],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(168, 85, 247, 0.8)'
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)',
              'rgb(168, 85, 247)'
            ],
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Average Pressure by Sensor',
              font: { size: 14, weight: 'bold' },
              color: '#1f2937'
            },
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Sensor ID',
                font: { weight: 'bold', size: 11 }
              },
              grid: {
                display: false
              },
              ticks: {
                font: { size: 10 }
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Average Pressure (PSI)',
                font: { weight: 'bold', size: 11 }
              },
              min: 0,
              max: 200,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                font: { size: 10 }
              }
            }
          },
          animation: {
            duration: 500,
            easing: 'easeInOutQuart'
          }
        }
      });
    }

    // Individual Bar Chart (Recent Readings)
    if (individualBarChartRef.current) {
      const ctx = individualBarChartRef.current.getContext('2d');
      individualBarChartInstance.current = new Chart.Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Recent Pressure Readings',
            data: [],
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Recent Individual Readings',
              font: { size: 14, weight: 'bold' },
              color: '#1f2937'
            },
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Reading Index',
                font: { weight: 'bold', size: 11 }
              },
              grid: {
                display: false
              },
              ticks: {
                font: { size: 10 },
                maxRotation: 45
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Pressure (PSI)',
                font: { weight: 'bold', size: 11 }
              },
              min: 0,
              max: 200,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                font: { size: 10 }
              }
            }
          },
          animation: {
            duration: 500,
            easing: 'easeInOutQuart'
          }
        }
      });
    }

    // Separate Bar Chart for Each Entry
    if (separateBarChartRef.current) {
      const ctx = separateBarChartRef.current.getContext('2d');
      separateBarChartInstance.current = new Chart.Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'All Individual Readings',
            data: [],
            backgroundColor: readings.map((_, index) => {
              const colors = [
                'rgba(239, 68, 68, 0.8)',   // red
                'rgba(34, 197, 94, 0.8)',   // green
                'rgba(59, 130, 246, 0.8)',  // blue
                'rgba(245, 158, 11, 0.8)',  // yellow
                'rgba(168, 85, 247, 0.8)',  // purple
                'rgba(236, 72, 153, 0.8)',  // pink
                'rgba(20, 184, 166, 0.8)',  // teal
                'rgba(251, 113, 133, 0.8)'  // rose
              ];
              return colors[index % colors.length];
            }),
            borderColor: readings.map((_, index) => {
              const colors = [
                'rgb(239, 68, 68)',   // red
                'rgb(34, 197, 94)',   // green
                'rgb(59, 130, 246)',  // blue
                'rgb(245, 158, 11)',  // yellow
                'rgb(168, 85, 247)',  // purple
                'rgb(236, 72, 153)',  // pink
                'rgb(20, 184, 166)',  // teal
                'rgb(251, 113, 133)'  // rose
              ];
              return colors[index % colors.length];
            }),
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'All Separate Pressure Readings',
              font: { size: 14, weight: 'bold' },
              color: '#1f2937'
            },
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Reading Time',
                font: { weight: 'bold', size: 11 }
              },
              grid: {
                display: false
              },
              ticks: {
                font: { size: 9 },
                maxRotation: 45
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Pressure (PSI)',
                font: { weight: 'bold', size: 11 }
              },
              min: 0,
              max: 200,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                font: { size: 10 }
              }
            }
          },
          animation: {
            duration: 500,
            easing: 'easeInOutQuart'
          }
        }
      });
    }
  };

  const updateCharts = () => {
    if (!readings.length) return;

    // Update line chart with last 20 readings
    if (lineChartInstance.current) {
      const chart = lineChartInstance.current;
      const last20 = readings.slice(-20);
      
      chart.data.labels = last20.map(r => new Date(r.timestamp).toLocaleTimeString());
      chart.data.datasets[0].data = last20.map(r => r.pressure);
      chart.update('none');
    }

    // Update bar chart with average pressure by sensor
    if (barChartInstance.current) {
      const chart = barChartInstance.current;
      
      const sensorGroups = readings.reduce((acc, reading) => {
        if (!acc[reading.sensorId]) {
          acc[reading.sensorId] = [];
        }
        acc[reading.sensorId].push(reading.pressure);
        return acc;
      }, {});

      const sensorAverages = Object.entries(sensorGroups).map(([sensorId, pressures]) => ({
        sensorId,
        avgPressure: pressures.reduce((sum, p) => sum + p, 0) / pressures.length
      }));

      chart.data.labels = sensorAverages.map(s => s.sensorId);
      chart.data.datasets[0].data = sensorAverages.map(s => s.avgPressure);
      chart.update('none');
    }

    // Update individual bar chart (recent readings)
    if (individualBarChartInstance.current) {
      const chart = individualBarChartInstance.current;
      const last15 = readings.slice(-15);
      
      chart.data.labels = last15.map((r, index) => `#${readings.length - 14 + index}`);
      chart.data.datasets[0].data = last15.map(r => r.pressure);
      chart.update('none');
    }

    // Update separate bar chart for all entries
    if (separateBarChartInstance.current) {
      const chart = separateBarChartInstance.current;
      
      chart.data.labels = readings.map(r => new Date(r.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
      chart.data.datasets[0].data = readings.map(r => r.pressure);
      
      // Update colors dynamically
      const colors = [
        'rgba(239, 68, 68, 0.8)',   // red
        'rgba(34, 197, 94, 0.8)',   // green
        'rgba(59, 130, 246, 0.8)',  // blue
        'rgba(245, 158, 11, 0.8)',  // yellow
        'rgba(168, 85, 247, 0.8)',  // purple
        'rgba(236, 72, 153, 0.8)',  // pink
        'rgba(20, 184, 166, 0.8)',  // teal
        'rgba(251, 113, 133, 0.8)'  // rose
      ];
      
      chart.data.datasets[0].backgroundColor = readings.map((_, index) => 
        colors[index % colors.length]
      );
      chart.data.datasets[0].borderColor = readings.map((_, index) => 
        colors[index % colors.length].replace('0.8', '1')
      );
      
      chart.update('none');
    }
  };

  const fetchReadings = async () => {
    setIsLoading(true);
    try {
      // Simulated data for demo
      const simulatedData = [
        {
          _id: '1',
          pressure: 85.5,
          timestamp: new Date(Date.now() - 10000),
          sensorId: 'SENSOR_001',
          location: 'Main Pipeline',
          status: 'normal',
          temperature: 24,
          humidity: 48
        },
        {
          _id: '2',
          pressure: 92.3,
          timestamp: new Date(Date.now() - 20000),
          sensorId: 'SENSOR_002',
          location: 'Secondary Line',
          status: 'normal',
          temperature: 26,
          humidity: 52
        },
        {
          _id: '3',
          pressure: 158.7,
          timestamp: new Date(Date.now() - 30000),
          sensorId: 'SENSOR_001',
          location: 'Main Pipeline',
          status: 'high',
          temperature: 28,
          humidity: 55
        },
        {
          _id: '4',
          pressure: 76.2,
          timestamp: new Date(Date.now() - 40000),
          sensorId: 'SENSOR_003',
          location: 'Backup Line',
          status: 'normal',
          temperature: 23,
          humidity: 45
        },
        {
          _id: '5',
          pressure: 112.8,
          timestamp: new Date(Date.now() - 50000),
          sensorId: 'SENSOR_002',
          location: 'Secondary Line',
          status: 'normal',
          temperature: 25,
          humidity: 50
        },
        {
          _id: '6',
          pressure: 195.2,
          timestamp: new Date(Date.now() - 60000),
          sensorId: 'SENSOR_001',
          location: 'Main Pipeline',
          status: 'critical',
          temperature: 30,
          humidity: 60
        }
      ];
      
      setReadings(simulatedData);
      showToast('Data refreshed successfully');
    } catch (error) {
      console.error('Error fetching readings:', error);
      showToast('Error fetching readings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.pressure || formData.pressure === '') {
      showToast('Please enter a pressure value', 'error');
      return;
    }
    
    setIsLoading(true);

    try {
      const getStatus = (pressure) => {
        if (pressure < 50) return 'low';
        if (pressure > 150) return 'high';
        if (pressure > 180) return 'critical';
        return 'normal';
      };

      const newReading = {
        _id: Date.now().toString(),
        ...formData,
        pressure: parseFloat(formData.pressure),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        status: getStatus(parseFloat(formData.pressure)),
        timestamp: new Date()
      };

      setReadings(prev => [...prev, newReading]);
      setShowForm(false);
      setFormData({
        pressure: '',
        sensorId: 'SENSOR_001',
        location: 'Main Pipeline',
        temperature: 25,
        humidity: 50
      });
      showToast('Reading added successfully');
    } catch (error) {
      console.error('Error adding reading:', error);
      showToast('Error adding reading', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (readingId) => {
    if (!window.confirm('Are you sure you want to delete this reading?')) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call to /gas/cleanup
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate successful API response
          resolve({
            ok: true,
            json: () => Promise.resolve({ 
              message: 'Reading deleted successfully',
              deletedId: readingId
            })
          });
        }, 500);
      });

      if (response.ok) {
        setReadings(prev => prev.filter(reading => reading._id !== readingId));
        showToast('Reading deleted successfully');
      } else {
        throw new Error('Failed to delete reading');
      }
    } catch (error) {
      console.error('Error deleting reading:', error);
      showToast('Error deleting reading', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'low': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-green-700 bg-green-100 border-green-200';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'high' || status === 'low' || status === 'critical') {
      return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
    return <Gauge className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  const currentStats = {
    totalReadings: readings.length,
    averagePressure: readings.length > 0 ? 
      (readings.reduce((sum, r) => sum + r.pressure, 0) / readings.length).toFixed(1) : 0,
    alertCount: readings.filter(r => r.status !== 'normal').length
  };

  return (
    <div className="responsive-wrapper">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-8">
      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Gas Pressure Monitor</h1>
                <p className="text-xs sm:text-sm text-gray-600">Real-time monitoring dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm flex-1 sm:flex-none justify-center"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">Add Reading</span>
                <span className="xs:hidden">Add</span>
              </button>
              
              <button
                onClick={fetchReadings}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Add New Reading</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pressure (PSI) *
                  </label>
                  <input
                    type="number"
                    name="pressure"
                    value={formData.pressure}
                    onChange={handleInputChange}
                    min="0"
                    max="1000"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter pressure value"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sensor ID
                  </label>
                  <select
                    name="sensorId"
                    value={formData.sensorId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="SENSOR_001">SENSOR_001</option>
                    <option value="SENSOR_002">SENSOR_002</option>
                    <option value="SENSOR_003">SENSOR_003</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Saving...' : 'Save Reading'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
     {/* Stats Cards */}
     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-blue-100 rounded-lg">
             <Activity className="w-6 h-6 text-blue-600" />
           </div>
           <div>
             <p className="text-sm text-gray-600">Total Readings</p>
             <p className="text-xl sm:text-2xl font-bold text-gray-800">{currentStats.totalReadings}</p>
           </div>
         </div>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-green-100 rounded-lg">
             <Gauge className="w-6 h-6 text-green-600" />
           </div>
           <div>
             <p className="text-sm text-gray-600">Avg Pressure</p>
             <p className="text-xl sm:text-2xl font-bold text-gray-800">{currentStats.averagePressure} PSI</p>
           </div>
         </div>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-red-100 rounded-lg">
             <AlertTriangle className="w-6 h-6 text-red-600" />
           </div>
           <div>
             <p className="text-sm text-gray-600">Alerts</p>
             <p className="text-xl sm:text-2xl font-bold text-gray-800">{currentStats.alertCount}</p>
           </div>
         </div>
       </div>
     </div>

     {/* Charts Grid */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
       {/* Line Chart */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
         <div className="h-64 sm:h-80">
           <canvas ref={lineChartRef}></canvas>
         </div>
       </div>

       {/* Average Bar Chart */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
         <div className="h-64 sm:h-80">
           <canvas ref={barChartRef}></canvas>
         </div>
       </div>

       {/* Individual Bar Chart */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
         <div className="h-64 sm:h-80">
           <canvas ref={individualBarChartRef}></canvas>
         </div>
       </div>

       {/* Separate Bar Chart */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
         <div className="h-64 sm:h-80">
           <canvas ref={separateBarChartRef}></canvas>
         </div>
       </div>
     </div>

     {/* Recent Readings Table */}
     <div className="bg-white rounded-xl shadow-sm border border-gray-200">
       <div className="p-4 sm:p-6 border-b border-gray-200">
         <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
           <TrendingUp className="w-5 h-5 text-blue-600" />
           Recent Readings
         </h2>
       </div>
       
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-gray-50">
             <tr>
               <th className="text-left py-3 px-4 sm:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Sensor & Location
               </th>
               <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Pressure
               </th>
               <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Status
               </th>
               <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Conditions
               </th>
               <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Time
               </th>
               <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Actions
               </th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {readings.slice().reverse().map((reading) => (
               <tr key={reading._id} className="hover:bg-gray-50">
                 <td className="py-3 px-4 sm:px-6">
                   <div>
                     <p className="text-sm font-medium text-gray-900">{reading.sensorId}</p>
                     <p className="text-xs text-gray-500">{reading.location}</p>
                   </div>
                 </td>
                 <td className="py-3 px-4">
                   <span className="text-sm font-semibold text-gray-900">{reading.pressure} PSI</span>
                 </td>
                 <td className="py-3 px-4">
                   <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reading.status)}`}>
                     {getStatusIcon(reading.status)}
                     {reading.status}
                   </span>
                 </td>
                 <td className="py-3 px-4">
                   <div className="flex items-center gap-3 text-xs text-gray-600">
                     <div className="flex items-center gap-1">
                       <Thermometer className="w-3 h-3" />
                       {reading.temperature}°C
                     </div>
                     <div className="flex items-center gap-1">
                       <Droplets className="w-3 h-3" />
                       {reading.humidity}%
                     </div>
                   </div>
                 </td>
                 <td className="py-3 px-4">
                   <span className="text-xs text-gray-500">
                     {new Date(reading.timestamp).toLocaleString()}
                   </span>
                 </td>
                 <td className="py-3 px-4">
                   <button
                     onClick={() => handleDelete(reading._id)}
                     disabled={isLoading}
                     className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                     title="Delete reading"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </td>
               </tr>
             ))}
             {readings.length === 0 && (
               <tr>
                 <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                   No readings available. Add some readings to get started.
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>
     </div>
   </div>
 </div>
 </div>
 );
};

export default GasPressureDashboard;