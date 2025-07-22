import React, { useState, useEffect, useRef } from 'react';
import { Activity, Gauge, TrendingUp, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import * as Chart from 'chart.js';

// Register Chart.js components
Chart.Chart.register(
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.PointElement,
  Chart.LineElement,
  Chart.BarElement,
  Chart.Title,
  Chart.Tooltip,
  Chart.Legend,
  Chart.Filler
);

const GasPressureMonitor = () => {
  const [pressureData, setPressureData] = useState([]);
  const [currentPressure, setCurrentPressure] = useState(0);
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [alertStatus, setAlertStatus] = useState('normal');
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // ThingsBoard Configuration
  const THINGSBOARD_CONFIG = {
    host: 'demo.thingsboard.io',
    // For demo purposes, we'll simulate the API calls
    // In real implementation, you would need:
    // - JWT token for authentication
    // - Actual device IDs
    // - Proper API endpoints
  };

  // Simulate ThingsBoard telemetry data
  const generateThingsBoardData = () => {
    const now = Date.now();
    const baseTime = now - (20 * 60 * 1000); // 20 minutes ago
    
    return Array.from({ length: 20 }, (_, i) => ({
      ts: baseTime + (i * 60 * 1000), // 1 minute intervals
      values: {
        pressure: Math.random() * 50 + 75 + Math.sin(i * 0.5) * 15, // Realistic pressure variation
        temperature: Math.random() * 10 + 22 + Math.sin(i * 0.3) * 3, // Temperature variation
        humidity: Math.random() * 20 + 45 + Math.sin(i * 0.4) * 10 // Humidity variation
      }
    }));
  };

  // Fetch telemetry data from ThingsBoard-like API
  const fetchTelemetryData = async () => {
    try {
      // In real implementation, this would be:
      // const response = await fetch(`https://${THINGSBOARD_CONFIG.host}/api/plugins/telemetry/DEVICE/{deviceId}/values/timeseries`, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Authorization': `Bearer ${jwtToken}`
      //   }
      // });
      
      // Simulate ThingsBoard API response structure
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const mockTelemetryData = generateThingsBoardData();
      
      // Process the data similar to how ThingsBoard returns it
      const processedData = mockTelemetryData.map(item => ({
        timestamp: new Date(item.ts).toLocaleTimeString(),
        pressure: item.values.pressure,
        temperature: item.values.temperature,
        humidity: item.values.humidity,
        status: item.values.pressure > 120 ? 'high' : 
                item.values.pressure < 60 ? 'low' : 'normal'
      }));

      return processedData;
    } catch (error) {
      console.error('Error fetching ThingsBoard telemetry:', error);
      setIsConnected(false);
      return null;
    }
  };

  // Fetch latest telemetry values
  const fetchLatestTelemetry = async () => {
    try {
      // Simulate getting latest values
      const latestData = generateThingsBoardData().slice(-1)[0];
      
      return {
        pressure: latestData.values.pressure,
        temperature: latestData.values.temperature,
        humidity: latestData.values.humidity,
        timestamp: new Date(latestData.ts).toLocaleTimeString(),
        status: latestData.values.pressure > 120 ? 'high' : 
                latestData.values.pressure < 60 ? 'low' : 'normal'
      };
    } catch (error) {
      console.error('Error fetching latest telemetry:', error);
      return null;
    }
  };

  // Initialize charts
  useEffect(() => {
    const initCharts = () => {
      // Line Chart
      if (lineChartRef.current) {
        const ctx = lineChartRef.current.getContext('2d');
        lineChartInstance.current = new Chart.Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [
              {
                label: 'Pressure (PSI)',
                data: [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                yAxisID: 'y'
              },
              {
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 3,
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Real-time Telemetry Data from ThingsBoard',
                font: { size: 16, weight: 'bold' },
                color: '#1f2937'
              },
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Time',
                  font: { weight: 'bold' }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Pressure (PSI)',
                  font: { weight: 'bold' }
                },
                min: 40,
                max: 160,
                grid: {
                  color: 'rgba(59, 130, 246, 0.2)'
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Temperature (°C)',
                  font: { weight: 'bold' }
                },
                min: 15,
                max: 35,
                grid: {
                  drawOnChartArea: false,
                },
              }
            },
            animation: {
              duration: 750,
              easing: 'easeInOutQuart'
            }
          }
        });
      }

      // Bar Chart
      if (barChartRef.current) {
        const ctx = barChartRef.current.getContext('2d');
        barChartInstance.current = new Chart.Chart(ctx, {
          type: 'bar',
          data: {
            labels: [],
            datasets: [{
              label: 'Pressure Readings (PSI)',
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
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Latest Pressure Readings Distribution',
                font: { size: 16, weight: 'bold' },
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
                  text: 'Recent Time Points',
                  font: { weight: 'bold' }
                },
                grid: {
                  display: false
                }
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Pressure (PSI)',
                  font: { weight: 'bold' }
                },
                min: 40,
                max: 160,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
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

    initCharts();

    // Cleanup function
    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
    };
  }, []);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      const telemetryData = await fetchTelemetryData();
      if (telemetryData) {
        setPressureData(telemetryData);
        setIsConnected(true);
        
        // Update charts with initial data
        if (lineChartInstance.current) {
          const chart = lineChartInstance.current;
          chart.data.labels = telemetryData.map(d => d.timestamp);
          chart.data.datasets[0].data = telemetryData.map(d => d.pressure);
          chart.data.datasets[1].data = telemetryData.map(d => d.temperature);
          chart.update();
        }

        if (barChartInstance.current) {
          const chart = barChartInstance.current;
          const last5 = telemetryData.slice(-5);
          chart.data.labels = last5.map(d => d.timestamp);
          chart.data.datasets[0].data = last5.map(d => d.pressure);
          chart.update();
        }
      }
    };

    loadInitialData();
  }, []);

  // Fetch real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const latestData = await fetchLatestTelemetry();
      if (latestData) {
        setCurrentPressure(latestData.pressure);
        setCurrentTemperature(latestData.temperature);
        setCurrentHumidity(latestData.humidity);
        setAlertStatus(latestData.status);
        setLastUpdateTime(latestData.timestamp);
        setIsConnected(true);

        // Update pressure data array
        setPressureData(prev => {
          const updated = [...prev, latestData];
          return updated.slice(-20); // Keep last 20 readings
        });

        // Update line chart
        if (lineChartInstance.current) {
          const chart = lineChartInstance.current;
          chart.data.labels.push(latestData.timestamp);
          chart.data.datasets[0].data.push(latestData.pressure);
          chart.data.datasets[1].data.push(latestData.temperature);
          
          // Keep only last 15 points for better visibility
          if (chart.data.labels.length > 15) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
          }
          
          chart.update('none');
        }

        // Update bar chart with last 5 readings
        if (barChartInstance.current) {
          const chart = barChartInstance.current;
          setPressureData(currentData => {
            const last5 = [...currentData, latestData].slice(-5);
            chart.data.labels = last5.map(d => d.timestamp);
            chart.data.datasets[0].data = last5.map(d => d.pressure);
            chart.update('none');
            return currentData;
          });
        }
      } else {
        setIsConnected(false);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  const getStatusIcon = () => {
    if (alertStatus === 'high' || alertStatus === 'low') {
      return <AlertTriangle className="w-5 h-5" />;
    }
    return <Gauge className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Activity className="w-10 h-10 text-blue-600" />
            ThingsBoard Gas Pressure Monitor
          </h1>
          <p className="text-gray-600">Real-time telemetry data from ThingsBoard IoT platform</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Connected to demo.thingsboard.io</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">Connection lost</span>
              </>
            )}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Current Pressure */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gas Pressure</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentPressure.toFixed(1)} <span className="text-lg text-gray-500">PSI</span>
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Gauge className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temperature</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentTemperature.toFixed(1)} <span className="text-lg text-gray-500">°C</span>
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a4 4 0 00-4 4v5.2a6 6 0 108 0V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v4.2a4 4 0 11-4 0V6z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Humidity</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentHumidity.toFixed(0)} <span className="text-lg text-gray-500">%</span>
                </p>
              </div>
              <div className="bg-cyan-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L6.5 9H4a2 2 0 000 4h12a2 2 0 100-4h-2.5L10 2z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(alertStatus)}`}>
                  {getStatusIcon()}
                  {alertStatus.toUpperCase()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Last: {lastUpdateTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="h-96">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="h-96">
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Recent Data Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Recent Telemetry Data
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pressure (PSI)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature (°C)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pressureData.slice(-8).reverse().map((reading, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {reading.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {reading.pressure.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reading.temperature ? reading.temperature.toFixed(1) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reading.humidity ? reading.humidity.toFixed(0) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reading.status)}`}>
                        {reading.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Information */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">ThingsBoard Integration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700"><strong>Platform:</strong> ThingsBoard Community Edition</p>
              <p className="text-blue-700"><strong>Demo Server:</strong> demo.thingsboard.io</p>
              <p className="text-blue-700"><strong>Update Frequency:</strong> 3 seconds</p>
            </div>
            <div>
              <p className="text-blue-700"><strong>Data Points:</strong> Pressure, Temperature, Humidity</p>
              <p className="text-blue-700"><strong>Storage:</strong> In-memory (demo mode)</p>
              <p className="text-blue-700"><strong>Status:</strong> {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasPressureMonitor;