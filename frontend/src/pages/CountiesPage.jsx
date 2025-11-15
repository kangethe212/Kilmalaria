import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, TrendingUp, Search, Loader } from 'lucide-react'
import axios from 'axios'

const ML_SERVICE_URL = 'http://localhost:8000'

export default function CountiesPage() {
  const navigate = useNavigate()
  const [counties, setCounties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCounty, setSelectedCounty] = useState(null)
  const [countyStats, setCountyStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  useEffect(() => {
    fetchCounties()
  }, [])

  const fetchCounties = async () => {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/counties`)
      setCounties(response.data.counties || [])
    } catch (error) {
      console.error('Failed to fetch counties:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCountyStats = async (county) => {
    setStatsLoading(true)
    setSelectedCounty(county)
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/county_stats?county=${county}`)
      setCountyStats(response.data)
    } catch (error) {
      console.error('Failed to fetch county stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const filteredCounties = counties.filter(county =>
    county.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <h1 className="text-2xl font-bold text-blue-900">County-Level Insights</h1>
                <p className="text-sm text-gray-600">Detailed statistics for all Kenyan counties</p>
              </div>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Counties List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Select County</h2>
              
              {/* Search */}
              <div className="mb-4 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search counties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Counties List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  </div>
                ) : (
                  filteredCounties.map(county => (
                    <button
                      key={county}
                      onClick={() => fetchCountyStats(county)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCounty === county
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{county}</span>
                        <MapPin className="w-4 h-4" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* County Statistics */}
          <div className="lg:col-span-2">
            {statsLoading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 border border-blue-100 text-center">
                <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            ) : countyStats ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">{countyStats.county}</h2>
                  <p className="text-gray-600">Malaria Statistics & Insights</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Total Cases</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {countyStats.total_cases?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-sm text-gray-600 mb-1">Avg Cases/Month</p>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.round(countyStats.avg_cases)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Peak Cases</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {countyStats.max_cases}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                    <p className="text-sm text-gray-600 mb-1">Min Cases</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {countyStats.min_cases}
                    </p>
                  </div>
                </div>

                {/* Peak Information */}
                {countyStats.peak_month && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 mb-6 border border-red-100">
                    <h3 className="font-semibold text-red-900 mb-3">📈 Peak Period</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Peak Month</p>
                        <p className="text-lg font-bold text-red-900">{countyStats.peak_month}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cases During Peak</p>
                        <p className="text-lg font-bold text-red-900">{countyStats.max_cases}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Trends */}
                {countyStats.recent_cases && countyStats.recent_cases.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Trends (Last 6 Months)</h3>
                    <div className="space-y-3">
                      {countyStats.recent_cases.map((record, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-sm text-gray-600">{record.date}</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-semibold text-blue-900">
                              {record.cases} cases
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              record.cases > countyStats.avg_cases ? 'bg-red-500' : 'bg-green-500'
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => navigate('/predictions')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Get Predictions
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 border border-blue-100 text-center">
                <MapPin className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Select a county to view statistics
                </h3>
                <p className="text-gray-500">
                  Choose any of the {counties.length} counties to see detailed malaria insights
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

