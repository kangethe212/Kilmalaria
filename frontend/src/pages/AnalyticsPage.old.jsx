import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, TrendingUp, MapPin, Calendar, Loader } from 'lucide-react'
import axios from 'axios'

const ML_SERVICE_URL = 'http://localhost:8000'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
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
          months_ahead: 6
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

  const getBarHeight = (value, max) => {
    return `${(value / max) * 100}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
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
                <h1 className="text-2xl font-bold text-blue-900">Visual Analytics</h1>
                <p className="text-sm text-gray-600">Interactive charts and data visualizations</p>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
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
          >
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-blue-100 text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-blue-100 text-sm mb-2">Total Cases</p>
                  <p className="text-3xl font-bold">{stats.total_cases?.toLocaleString()}</p>
                  <p className="text-blue-100 text-xs mt-2">All time</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-green-100 text-sm mb-2">Average/Month</p>
                  <p className="text-3xl font-bold">{Math.round(stats.avg_cases)}</p>
                  <p className="text-green-100 text-xs mt-2">Historical average</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-red-100 text-sm mb-2">Peak Cases</p>
                  <p className="text-3xl font-bold">{stats.max_cases}</p>
                  <p className="text-red-100 text-xs mt-2">{stats.peak_month}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-purple-100 text-sm mb-2">Lowest Cases</p>
                  <p className="text-3xl font-bold">{stats.min_cases}</p>
                  <p className="text-purple-100 text-xs mt-2">Best period</p>
                </div>
              </div>
            )}

            {/* Prediction Trend Chart */}
            {predictions && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">📈 6-Month Prediction Trend</h2>
                    <p className="text-sm text-gray-600">{selectedCounty} County</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>

                {/* Bar Chart */}
                <div className="flex items-end justify-between space-x-4 h-64">
                  {predictions.predictions?.map((pred, index) => {
                    const maxCases = Math.max(...predictions.predictions.map(p => p.predicted_cases))
                    const height = getBarHeight(pred.predicted_cases, maxCases)
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex items-end justify-center h-full">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              pred.risk_level === 'High' ? 'bg-gradient-to-t from-red-500 to-red-400' :
                              pred.risk_level === 'Moderate' ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
                              'bg-gradient-to-t from-green-500 to-green-400'
                            } hover:opacity-80 cursor-pointer relative group`}
                            style={{ height }}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                              <div className="font-semibold">{Math.round(pred.predicted_cases)} cases</div>
                              <div className="text-gray-300">{pred.risk_level} Risk</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-xs font-semibold text-gray-900">
                            {pred.month.split(' ')[0]}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.round(pred.predicted_cases)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Low Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm text-gray-600">Moderate Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-600">High Risk</span>
                  </div>
                </div>
              </div>
            )}

            {/* Historical Trend */}
            {stats?.recent_cases && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">📊 Recent Historical Data</h2>
                    <p className="text-sm text-gray-600">Last 6 months</p>
                  </div>
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>

                <div className="space-y-3">
                  {stats.recent_cases.map((record, index) => {
                    const percentage = (record.cases / stats.max_cases) * 100
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
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
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-6">🎯 Risk Assessment Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">Current Trend</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      {predictions.summary?.trend || 'Stable'}
                    </p>
                    <p className="text-sm text-gray-600">Overall direction of cases</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-3">Avg Predicted Cases</h3>
                    <p className="text-3xl font-bold text-green-600 mb-2">
                      {Math.round(predictions.summary?.avg_predicted_cases || 0)}
                    </p>
                    <p className="text-sm text-gray-600">Next 6 months average</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-3">Peak Expected</h3>
                    <p className="text-3xl font-bold text-purple-600 mb-2">
                      {predictions.summary?.peak_month?.split(' ')[0] || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Highest risk month</p>
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

