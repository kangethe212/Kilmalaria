import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Calendar, MapPin, Loader } from 'lucide-react'
import axios from 'axios'

const ML_SERVICE_URL = 'http://localhost:8000'

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kakamega',
  'Bungoma', 'Kisii', 'Nyeri', 'Meru', 'Machakos', 'Kilifi',
  'Kwale', 'Turkana', 'Baringo', 'Homa Bay', 'Migori', 'Siaya',
  'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Tana River',
  'Lamu', 'Taita Taveta', 'Kajiado', 'Makueni', 'Nyandarua', 'Nyamira',
  'Kirinyaga', 'Murang\'a', 'Kiambu', 'Embu', 'Tharaka-Nithi', 'Kitui',
  'Laikipia', 'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet',
  'Nandi', 'Baringo', 'West Pokot', 'Kericho', 'Bomet', 'Vihiga'
]

export default function PredictionsPage() {
  const navigate = useNavigate()
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [monthsAhead, setMonthsAhead] = useState(3)
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState(null)
  const [error, setError] = useState(null)

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    setPredictions(null)

    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict_regional`, {
        county: selectedCounty,
        months_ahead: monthsAhead
      })

      setPredictions(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get predictions. Please try again.')
    } finally {
      setLoading(false)
    }
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
                <h1 className="text-2xl font-bold text-blue-900">ML-Powered Predictions</h1>
                <p className="text-sm text-gray-600">Predict malaria outbreaks using AI</p>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-blue-900 mb-6">Prediction Parameters</h2>

              {/* County Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Select County
                </label>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {COUNTIES.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              {/* Months Ahead */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Prediction Period
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={monthsAhead}
                    onChange={(e) => setMonthsAhead(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-semibold text-blue-600">
                    {monthsAhead} Month{monthsAhead > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Predict Button */}
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Generate Predictions
                  </>
                )}
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-xl p-6 mt-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ AI analyzes historical data</li>
                <li>✅ Considers climate patterns</li>
                <li>✅ Uses ensemble ML models</li>
                <li>✅ 99.32% accuracy rate</li>
              </ul>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-800 font-medium">❌ {error}</p>
              </div>
            )}

            {predictions ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">
                    Predictions for {predictions.county}
                  </h2>
                  <p className="text-gray-600">Generated: {new Date().toLocaleString()}</p>
                </div>

                {/* Monthly Predictions */}
                <div className="space-y-4">
                  {predictions.predictions.map((pred, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{pred.month}</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {Math.round(pred.predicted_cases)} cases
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            pred.trend === 'increasing' ? 'text-red-600' :
                            pred.trend === 'decreasing' ? 'text-green-600' :
                            'text-gray-600'
                          }`}>
                            {pred.trend === 'increasing' && '📈 Increasing'}
                            {pred.trend === 'decreasing' && '📉 Decreasing'}
                            {pred.trend === 'stable' && '➡️ Stable'}
                          </p>
                          <p className={`text-xs ${
                            pred.risk_level === 'High' ? 'text-red-600' :
                            pred.risk_level === 'Moderate' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            Risk: {pred.risk_level}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                {predictions.summary && (
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                      <p className="text-sm text-gray-600">Average Cases</p>
                      <p className="text-xl font-bold text-blue-900">
                        {Math.round(predictions.summary.avg_predicted_cases)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                      <p className="text-sm text-gray-600">Peak Month</p>
                      <p className="text-xl font-bold text-green-900">
                        {predictions.summary.peak_month?.split(' ')[0]}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
                      <p className="text-sm text-gray-600">Peak Cases</p>
                      <p className="text-xl font-bold text-purple-900">
                        {Math.round(predictions.summary.peak_cases)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 border border-blue-100 text-center">
                <TrendingUp className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Select parameters and generate predictions
                </h3>
                <p className="text-gray-500">
                  Choose a county and time period to see AI-powered malaria predictions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

