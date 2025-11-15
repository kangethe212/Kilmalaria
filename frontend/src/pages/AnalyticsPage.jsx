import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, BarChart3, TrendingUp, MapPin, Calendar, Loader,
  Activity, AlertCircle, RefreshCw, Info
} from 'lucide-react'
import axios from 'axios'

const ML_SERVICE_URL = 'http://localhost:8000'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [counties, setCounties] = useState([])
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [stats, setStats] = useState(null)
  const [predictions, setPredictions] = useState(null)

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
      setError(null)
    } catch (error) {
      console.error('Failed to fetch counties:', error)
      setError('Failed to load counties')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setError(null)
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
      setError('Failed to load analytics data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getBarHeight = (value, max) => {
    return `${Math.max((value / max) * 100, 5)}%`
  }

  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'High') return 'from-red-500 to-red-400'
    if (riskLevel === 'Moderate') return 'from-yellow-500 to-yellow-400'
    return 'from-green-500 to-green-400'
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
                <p className="text-sm text-gray-600">Interactive charts & data visualizations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </button>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* County Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <MapPin className="w-4 h-4 inline mr-2" />
            Select County for Analysis
          </label>
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center mb-8">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-800 font-semibold mb-2">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-blue-100 text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading analytics...</p>
            <p className="text-sm text-gray-500 mt-2">Analyzing data for {selectedCounty}</p>
          </div>
        ) : !error && (
          <div className="space-y-8">
            {/* Key Metrics Dashboard */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <Activity className="w-8 h-8 text-blue-100" />
                    <span className="bg-blue-400 bg-opacity-50 px-3 py-1 rounded-full text-xs font-bold">
                      TOTAL
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm mb-2">Total Cases</p>
                  <p className="text-4xl font-black">{stats.total_cases?.toLocaleString() || 0}</p>
                  <p className="text-blue-100 text-xs mt-3">All time</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <TrendingUp className="w-8 h-8 text-green-100" />
                    <span className="bg-green-400 bg-opacity-50 px-3 py-1 rounded-full text-xs font-bold">
                      AVERAGE
                    </span>
                  </div>
                  <p className="text-green-100 text-sm mb-2">Monthly Average</p>
                  <p className="text-4xl font-black">{Math.round(stats.avg_cases || 0).toLocaleString()}</p>
                  <p className="text-green-100 text-xs mt-3">Historical</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <AlertCircle className="w-8 h-8 text-red-100" />
                    <span className="bg-red-400 bg-opacity-50 px-3 py-1 rounded-full text-xs font-bold">
                      PEAK
                    </span>
                  </div>
                  <p className="text-red-100 text-sm mb-2">Peak Cases</p>
                  <p className="text-4xl font-black">{stats.max_cases?.toLocaleString() || 0}</p>
                  <p className="text-red-100 text-xs mt-3">{stats.peak_month || 'N/A'}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <Calendar className="w-8 h-8 text-purple-100" />
                    <span className="bg-purple-400 bg-opacity-50 px-3 py-1 rounded-full text-xs font-bold">
                      LOWEST
                    </span>
                  </div>
                  <p className="text-purple-100 text-sm mb-2">Minimum Cases</p>
                  <p className="text-4xl font-black">{stats.min_cases?.toLocaleString() || 0}</p>
                  <p className="text-purple-100 text-xs mt-3">Best period</p>
                </div>
              </div>
            )}

            {/* Prediction Trend Chart */}
            {predictions && predictions.predictions && (
              <div className="bg-white rounded-xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900">📈 12-Month Prediction Trend</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedCounty} County Forecast</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">92.35% Accurate</span>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="flex items-end justify-between space-x-2 h-80 mb-6">
                  {predictions.predictions.slice(0, 12).map((pred, index) => {
                    const maxCases = Math.max(...predictions.predictions.slice(0, 12).map(p => p.predicted_cases))
                    const height = getBarHeight(pred.predicted_cases, maxCases)
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center h-full">
                        <div className="w-full flex items-end justify-center h-full relative group">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 bg-gradient-to-t ${getRiskColor(pred.risk_level)} hover:opacity-80 cursor-pointer`}
                            style={{ height }}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-10 pointer-events-none">
                              <div className="font-semibold">{Math.round(pred.predicted_cases)} cases</div>
                              <div className="text-gray-300">{pred.risk_level} Risk</div>
                              <div className="text-gray-400">{pred.month}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-xs font-semibold text-gray-900">
                            {pred.month.split(' ')[0].substring(0, 3)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(pred.predicted_cases)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600 font-medium">Low Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm text-gray-600 font-medium">Moderate Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-600 font-medium">High Risk</span>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-semibold mb-1">Total Predicted</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {Math.round(predictions.predictions.reduce((sum, p) => sum + p.predicted_cases, 0)).toLocaleString()}
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
            )}

            {/* Historical Trend */}
            {stats?.recent_cases && stats.recent_cases.length > 0 && (
              <div className="bg-white rounded-xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">📊 Recent Historical Data</h2>
                    <p className="text-sm text-gray-600">Last 6 months actual cases</p>
                  </div>
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>

                <div className="space-y-4">
                  {stats.recent_cases.map((record, index) => {
                    const percentage = Math.min((record.cases / stats.max_cases) * 100, 100)
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{record.date}</span>
                          <span className="text-sm font-bold text-blue-900">{record.cases} cases</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              record.cases > stats.avg_cases 
                                ? 'bg-gradient-to-r from-red-500 to-red-400' 
                                : 'bg-gradient-to-r from-green-500 to-green-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Risk Assessment */}
            {predictions && (
              <div className="bg-white rounded-xl shadow-xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-6">🎯 Risk Assessment Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Trend</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        {predictions.summary?.trend || 'Stable'}
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-blue-600 opacity-50" />
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Avg Cases</h3>
                      <p className="text-3xl font-bold text-green-600">
                        {Math.round(predictions.summary?.avg_predicted_cases || 0)}
                      </p>
                    </div>
                    <BarChart3 className="w-12 h-12 text-green-600 opacity-50" />
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-2">Risk Level</h3>
                      <p className="text-3xl font-bold text-purple-600">
                        {predictions.predictions?.[0]?.risk_level || 'N/A'}
                      </p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-purple-600 opacity-50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
