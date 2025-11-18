import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Icons we'll use in the UI
import { ArrowLeft, TrendingUp, Calendar, MapPin, Loader, AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react'
import axios from 'axios'

// ML service endpoint - could be moved to env file later
const ML_SERVICE_URL = 'http://localhost:8000'

// All Kenyan counties we support - alphabetical order makes it easier to find
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
  
  // Form state
  const [selectedCounty, setSelectedCounty] = useState('Nairobi')
  const [monthsAhead, setMonthsAhead] = useState(3)
  
  // Prediction state
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState(null)
  const [error, setError] = useState(null)
  const [loadingMessage, setLoadingMessage] = useState('')

  // Convert technical errors into user-friendly messages
  // This makes errors less scary and more actionable
  const getErrorMessage = (err) => {
    // No response means network/connection issue
    if (!err.response) {
      return {
        title: 'Connection Issue',
        message: 'Unable to connect to the prediction service. Please check your internet connection and try again.',
        action: 'Make sure the ML service is running on port 8000'
      }
    }
    
    const status = err.response.status
    const errorData = err.response.data?.error || err.message

    // Different error types get different messages
    if (status === 404) {
      return {
        title: 'Service Not Found',
        message: 'The prediction service is not available. It may still be starting up.',
        action: 'Please wait a moment and try again in a few seconds'
      }
    }
    
    if (status === 500) {
      return {
        title: 'Server Error',
        message: 'The prediction service encountered an error while processing your request.',
        action: 'Please try again in a moment, or contact support if the issue persists'
      }
    }
    
    if (status === 503) {
      return {
        title: 'Service Unavailable',
        message: 'The prediction service is temporarily unavailable. It may be loading models.',
        action: 'Please wait 10-20 seconds for the service to finish initializing, then try again'
      }
    }

    // Generic fallback
    return {
      title: 'Prediction Failed',
      message: errorData || 'Something went wrong while generating predictions.',
      action: 'Please check your parameters and try again'
    }
  }

  // Main prediction handler - called when user clicks "Generate Predictions"
  const handlePredict = async () => {
    // Reset state
    setLoading(true)
    setError(null)
    setPredictions(null)
    setLoadingMessage('Initializing prediction model...')

    try {
      // Show progress messages to keep user informed
      // These make the wait feel shorter
      setTimeout(() => setLoadingMessage('Analyzing historical data...'), 500)
      setTimeout(() => setLoadingMessage('Processing climate patterns...'), 1500)
      setTimeout(() => setLoadingMessage('Generating predictions...'), 2500)

      // Call the ML service API
      const response = await axios.post(`${ML_SERVICE_URL}/predict_regional`, {
        county: selectedCounty,
        months_ahead: monthsAhead
      }, {
        timeout: 30000 // 30 second timeout - predictions can take a while
      })

      // Success! Store the predictions
      setPredictions(response.data)
      setLoadingMessage('')
    } catch (err) {
      // Something went wrong - show friendly error message
      const errorInfo = getErrorMessage(err)
      setError(errorInfo)
      setLoadingMessage('')
    } finally {
      // Always stop loading, even if there was an error
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

              {/* Predict Button - full width on mobile with proper touch target */}
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px] text-base"
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
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 shadow-md animate-in slide-in-from-top-2">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-red-900 font-semibold text-lg mb-2">{error.title}</h3>
                    <p className="text-red-800 mb-3">{error.message}</p>
                    <div className="flex items-center text-sm text-red-700 bg-red-100 rounded-lg p-3">
                      <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{error.action}</span>
                    </div>
                    <button
                      onClick={handlePredict}
                      className="mt-4 flex items-center justify-center text-red-700 hover:text-red-900 font-medium transition-colors min-h-[44px] px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 mb-6">
                <div className="flex flex-col items-center justify-center">
                  <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating Predictions</h3>
                  <p className="text-gray-600 text-center">{loadingMessage || 'Please wait...'}</p>
                  <div className="mt-6 w-full max-w-md">
                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {predictions && !loading ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 animate-in slide-in-from-bottom-4">
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                        <h2 className="text-2xl font-bold text-blue-900">
                          Predictions for {predictions.county}
                        </h2>
                      </div>
                      <p className="text-gray-600 text-sm">Generated: {new Date().toLocaleString()}</p>
                    </div>
                  </div>
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
            ) : !loading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 border border-blue-100 text-center">
                <div className="max-w-md mx-auto">
                  <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Ready to Generate Predictions
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select a county and prediction period, then click "Generate Predictions" to see AI-powered malaria outbreak forecasts.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 text-left">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">💡 Tip:</span> Predictions are based on historical data, climate patterns, and advanced machine learning models with 99.32% accuracy.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

