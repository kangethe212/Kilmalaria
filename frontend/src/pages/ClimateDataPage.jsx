import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Cloud, Droplets, Thermometer, Wind, TrendingUp, Loader } from 'lucide-react'
import axios from 'axios'

const ML_SERVICE_URL = 'http://localhost:8000'

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kakamega',
  'Bungoma', 'Kisii', 'Nyeri', 'Meru', 'Machakos', 'Kilifi',
  'Kwale', 'Turkana', 'Baringo', 'Homa Bay', 'Migori', 'Siaya'
]

export default function ClimateDataPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    county: 'Nairobi',
    temperature: 25,
    rainfall: 50,
    humidity: 65,
    months_ahead: 3
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'county' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict_regional`, {
        county: formData.county,
        months_ahead: formData.months_ahead,
        climate_data: {
          temperature: formData.temperature,
          rainfall: formData.rainfall,
          humidity: formData.humidity
        }
      })

      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate predictions')
    } finally {
      setLoading(false)
    }
  }

  const getClimateFeedback = () => {
    const { temperature, rainfall, humidity } = formData
    const feedback = []

    if (rainfall > 100) {
      feedback.push({ type: 'danger', text: '⚠️ High rainfall increases mosquito breeding' })
    } else if (rainfall > 50) {
      feedback.push({ type: 'warning', text: '📊 Moderate rainfall - monitor conditions' })
    } else {
      feedback.push({ type: 'success', text: '✅ Low rainfall - reduced risk' })
    }

    if (temperature > 28) {
      feedback.push({ type: 'warning', text: '🌡️ Warm temperatures favor mosquito activity' })
    } else if (temperature < 18) {
      feedback.push({ type: 'success', text: '❄️ Cooler temperatures slow mosquito growth' })
    }

    if (humidity > 70) {
      feedback.push({ type: 'warning', text: '💧 High humidity supports mosquito survival' })
    }

    return feedback
  }

  const feedback = getClimateFeedback()

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
                <h1 className="text-2xl font-bold text-blue-900">Climate Data Integration</h1>
                <p className="text-sm text-gray-600">Generate predictions based on climate conditions</p>
              </div>
            </div>
            <Cloud className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-blue-900 mb-6">Input Climate Data</h2>

              {/* County */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 County
                </label>
                <select
                  name="county"
                  value={formData.county}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {COUNTIES.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              {/* Temperature */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Thermometer className="w-4 h-4 inline mr-2" />
                  Temperature (°C)
                </label>
                <input
                  type="range"
                  name="temperature"
                  min="10"
                  max="40"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="w-full mb-2"
                />
                <div className="text-center text-2xl font-bold text-blue-600">
                  {formData.temperature}°C
                </div>
              </div>

              {/* Rainfall */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 inline mr-2" />
                  Rainfall (mm)
                </label>
                <input
                  type="range"
                  name="rainfall"
                  min="0"
                  max="200"
                  value={formData.rainfall}
                  onChange={handleInputChange}
                  className="w-full mb-2"
                />
                <div className="text-center text-2xl font-bold text-blue-600">
                  {formData.rainfall} mm
                </div>
              </div>

              {/* Humidity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Wind className="w-4 h-4 inline mr-2" />
                  Humidity (%)
                </label>
                <input
                  type="range"
                  name="humidity"
                  min="20"
                  max="100"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  className="w-full mb-2"
                />
                <div className="text-center text-2xl font-bold text-blue-600">
                  {formData.humidity}%
                </div>
              </div>

              {/* Months Ahead */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Prediction Period
                </label>
                <input
                  type="range"
                  name="months_ahead"
                  min="1"
                  max="12"
                  value={formData.months_ahead}
                  onChange={handleInputChange}
                  className="w-full mb-2"
                />
                <div className="text-center text-lg font-semibold text-blue-600">
                  {formData.months_ahead} Month{formData.months_ahead > 1 ? 's' : ''}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Generate Predictions
                  </>
                )}
              </button>
            </form>

            {/* Climate Feedback */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-4">Climate Analysis</h3>
              <div className="space-y-3">
                {feedback.map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    item.type === 'danger' ? 'bg-red-50 border border-red-200 text-red-800' :
                    item.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
                    'bg-green-50 border border-green-200 text-green-800'
                  }`}>
                    <p className="text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-800 font-medium">❌ {error}</p>
              </div>
            )}

            {result ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">
                    Climate-Based Predictions for {result.county}
                  </h2>
                  <p className="text-gray-600">Based on provided climate data</p>
                </div>

                {/* Climate Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6 border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-3">Input Conditions</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Thermometer className="w-6 h-6 text-red-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="font-bold text-gray-900">{formData.temperature}°C</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Rainfall</p>
                      <p className="font-bold text-gray-900">{formData.rainfall} mm</p>
                    </div>
                    <div className="text-center">
                      <Wind className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="font-bold text-gray-900">{formData.humidity}%</p>
                    </div>
                  </div>
                </div>

                {/* Predictions */}
                <div className="space-y-4">
                  {result.predictions?.map((pred, index) => (
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
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 border border-blue-100 text-center">
                <Cloud className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Input climate data to generate predictions
                </h3>
                <p className="text-gray-500">
                  Adjust temperature, rainfall, and humidity levels to see how climate affects malaria risk
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

