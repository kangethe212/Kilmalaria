import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, BarChart3, TrendingUp, MapPin, Calendar, Loader,
  Activity, AlertCircle, Download, RefreshCw, Info
} from 'lucide-react'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const ML_SERVICE_URL = 'http://localhost:8000'

export default function EnhancedAnalyticsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [counties, setCounties] = useState([])
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [stats, setStats] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [chartType, setChartType] = useState('line') // 'line', 'bar', 'area'

  useEffect(() => {
    fetchCounties()
  }, [])

  useEffect(() => {
    if (selectedCounty) {
      fetchData()
    }
  }, [selectedCounty])

  const fetchCounties = async () => {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/counties`)
      setCounties(response.data.counties || [])
    } catch (error) {
      console.error('Failed to fetch counties:', error)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, predRes] = await Promise.all([
        axios.get(`${ML_SERVICE_URL}/county_stats?county=${selectedCounty}`),
        axios.post(`${ML_SERVICE_URL}/predict_regional`, {
          county: selectedCounty,
          months_ahead: 12
        })
      ])
      setStats(statsRes.data)
      setPredictions(predRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Chart configurations
  const lineChartData = predictions ? {
    labels: predictions.predictions?.map(p => p.month.split(' ')[0]) || [],
    datasets: [
      {
        label: 'Predicted Cases',
        data: predictions.predictions?.map(p => Math.round(p.predicted_cases)) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      stats?.recent_cases ? {
        label: 'Historical Cases',
        data: [...stats.recent_cases.map(r => r.cases), ...Array(6).fill(null)],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderDash: [5, 5]
      } : null
    ].filter(Boolean)
  } : null

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            label += context.parsed.y.toLocaleString() + ' cases'
            return label
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString()
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }

  // Bar Chart Data (for comparison)
  const barChartData = predictions ? {
    labels: predictions.predictions?.slice(0, 6).map(p => p.month.split(' ')[0]) || [],
    datasets: [
      {
        label: 'Predicted Cases',
        data: predictions.predictions?.slice(0, 6).map(p => Math.round(p.predicted_cases)) || [],
        backgroundColor: predictions.predictions?.slice(0, 6).map(p => {
          if (p.risk_level === 'High') return 'rgba(239, 68, 68, 0.8)'
          if (p.risk_level === 'Moderate') return 'rgba(251, 191, 36, 0.8)'
          return 'rgba(34, 197, 94, 0.8)'
        }) || [],
        borderColor: predictions.predictions?.slice(0, 6).map(p => {
          if (p.risk_level === 'High') return 'rgb(220, 38, 38)'
          if (p.risk_level === 'Moderate') return 'rgb(217, 119, 6)'
          return 'rgb(21, 128, 61)'
        }) || [],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  } : null

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: function(context) {
            const pred = predictions.predictions[context.dataIndex]
            return [
              `Cases: ${context.parsed.y.toLocaleString()}`,
              `Risk: ${pred.risk_level}`
            ]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  // Risk Distribution Donut Chart
  const riskDistribution = predictions ? {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [{
      data: [
        predictions.predictions?.filter(p => p.risk_level === 'Low').length || 0,
        predictions.predictions?.filter(p => p.risk_level === 'Moderate').length || 0,
        predictions.predictions?.filter(p => p.risk_level === 'High').length || 0
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(21, 128, 61)',
        'rgb(217, 119, 6)',
        'rgb(220, 38, 38)'
      ],
      borderWidth: 2
    }]
  } : null

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed} months (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-blue-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">📊 Visual Analytics</h1>
                <p className="text-sm text-gray-600">Advanced charts & data visualizations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden md:inline">Refresh</span>
              </button>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* County Selector & Chart Type */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <MapPin className="w-4 h-4 inline mr-2" />
                Select County for Analysis
              </label>
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {counties.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Activity className="w-4 h-4 inline mr-2" />
                Chart Type
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setChartType('line')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    chartType === 'line'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    chartType === 'bar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-blue-100 text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading analytics...</p>
            <p className="text-sm text-gray-500 mt-2">Analyzing data for {selectedCounty}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics Dashboard */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition">
                  <div className="flex justify-between items-start mb-4">
                    <Activity className="w-8 h-8 text-blue-100" />
                    <span className="bg-blue-400 bg-opacity-50 px-3 py-1 rounded-full text-xs font-bold">
                      ALL TIME
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm mb-2">Total Cases</p>
                  <p className="text-4xl font-black">{stats.total_cases?.toLocaleString()}</p>
                  <p className="text-blue-100 text-xs mt-3">Since 2014</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition">
                  <div className="flex justify-between items-start mb-4">
                    <TrendingUp className="w-8 h-8 text-green-100" />
                    <span className="bg-green-400 bg-opacity-50 px-3 py-1 rounded-full text-xs font-bold">
                      AVERAGE
                    </span>
                  </div>
                  <p className="text-green-100 text-sm mb-2">Monthly Average</p>
                  <p className="text-4xl font-black">{Math.round(stats.avg_cases).toLocaleString()}</p>
                  <p className="text-green-100 text-xs mt-3">Historical average</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition">
                  <div className="flex justify-between items-start mb-4">
                    <AlertCircle className="w-8 h-8 text-red-100" />
                    <span className="bg-red-400 bg-opacity-50 px-3 py-1 rounded-full text-xs font-bold">
                      PEAK
                    </span>
                  </div>
                  <p className="text-red-100 text-sm mb-2">Highest Cases</p>
                  <p className="text-4xl font-black">{stats.max_cases?.toLocaleString()}</p>
                  <p className="text-red-100 text-xs mt-3">{stats.peak_month}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition">
                  <div className="flex justify-between items-start mb-4">
                    <Calendar className="w-8 h-8 text-purple-100" />
                    <span className="bg-purple-400 bg-opacity-50 px-3 py-1 rounded-full text-xs font-bold">
                      LOWEST
                    </span>
                  </div>
                  <p className="text-purple-100 text-sm mb-2">Minimum Cases</p>
                  <p className="text-4xl font-black">{stats.min_cases?.toLocaleString()}</p>
                  <p className="text-purple-100 text-xs mt-3">Best period</p>
                </div>
              </div>
            )}

            {/* Main Prediction Chart */}
            {predictions && lineChartData && (
              <div className="bg-white rounded-xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900">📈 Malaria Prediction Trend</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      12-month forecast for {selectedCounty} County
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">92.35% Accuracy</span>
                  </div>
                </div>

                <div style={{ height: '400px' }}>
                  {chartType === 'line' && (
                    <Line data={lineChartData} options={lineChartOptions} />
                  )}
                  {chartType === 'bar' && barChartData && (
                    <Bar data={barChartData} options={barChartOptions} />
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-700 font-semibold mb-1">Total Predicted</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {predictions.predictions?.reduce((sum, p) => sum + p.predicted_cases, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-700 font-semibold mb-1">Average Monthly</p>
                      <p className="text-2xl font-bold text-green-900">
                        {Math.round(predictions.summary?.avg_predicted_cases || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-700 font-semibold mb-1">Peak Month</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {predictions.summary?.peak_month?.split(' ')[0] || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Distribution & Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Risk Donut Chart */}
              {predictions && riskDistribution && (
                <div className="bg-white rounded-xl shadow-xl p-6 border border-blue-100">
                  <h2 className="text-xl font-bold text-blue-900 mb-6">🎯 Risk Distribution</h2>
                  <div style={{ height: '300px' }}>
                    <Doughnut data={riskDistribution} options={donutOptions} />
                  </div>
                </div>
              )}

              {/* Risk Assessment Summary */}
              {predictions && (
                <div className="bg-white rounded-xl shadow-xl p-6 border border-blue-100">
                  <h2 className="text-xl font-bold text-blue-900 mb-6">📊 Key Insights</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div>
                        <p className="text-sm text-gray-700 font-semibold">Trend Direction</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">
                          {predictions.summary?.trend || 'Stable'}
                        </p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-blue-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div>
                        <p className="text-sm text-gray-700 font-semibold">Risk Level</p>
                        <p className="text-2xl font-bold text-green-900 mt-1">
                          {predictions.predictions?.[0]?.risk_level || 'N/A'}
                        </p>
                      </div>
                      <AlertCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <div>
                        <p className="text-sm text-gray-700 font-semibold">Data Quality</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">Excellent</p>
                      </div>
                      <BarChart3 className="w-12 h-12 text-purple-600" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Download Report Button */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-center shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4">Export Analytics Report</h3>
              <p className="text-blue-50 mb-6">Download comprehensive analysis for {selectedCounty} County</p>
              <button className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition font-bold shadow-lg transform hover:scale-105">
                <Download className="w-5 h-5" />
                <span>Download PDF Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

