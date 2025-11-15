import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Info, Loader, AlertTriangle, Activity, Heart, Stethoscope, Clipboard } from 'lucide-react'
import axios from 'axios'

const ML_SERVICE_URL = 'http://localhost:8000'

export default function DataUploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase()
      if (['csv', 'xlsx', 'xls'].includes(fileType)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setResults(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict_from_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
      })

      setResults(response.data)
    } catch (err) {
      console.error('Upload error:', err)
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to process file. Please check the format and try again.'
      setError(errorMessage)
      // Also log full error details for debugging
      if (err.response?.data) {
        console.error('Error details:', err.response.data)
      }
    } finally {
      setUploading(false)
    }
  }

  const downloadSample = () => {
    const sampleData = `county,temperature,rainfall,humidity,month,year
Nairobi,25.5,120.3,65,3,2024
Mombasa,28.2,80.5,75,3,2024
Kisumu,26.8,150.0,70,3,2024
Nakuru,22.5,95.2,60,3,2024
Uasin Gishu,20.1,110.8,55,3,2024`

    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'climalaria_medical_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity) => {
    const colors = {
      'Epidemic Threshold': 'bg-red-600 text-white',
      'Very High Transmission': 'bg-red-500 text-white',
      'High Transmission': 'bg-orange-500 text-white',
      'Moderate Transmission': 'bg-yellow-500 text-white',
      'Low Transmission': 'bg-green-500 text-white'
    }
    return colors[severity] || 'bg-gray-500 text-white'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Medical Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-4 border-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Stethoscope className="w-6 h-6 text-white" />
                  <h1 className="text-2xl font-bold text-white">Clinical Intelligence Upload</h1>
                </div>
                <p className="text-sm text-blue-100">WHO-Aligned Epidemiological Analysis System</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
              <p className="text-white text-sm font-semibold">Medical Grade Analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-900">Data Upload</h2>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Clinical Data File (CSV/Excel)
                </label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer bg-blue-50">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileSpreadsheet className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    {file ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Select Clinical Data File</p>
                        <p className="text-xs text-gray-500 mt-1">CSV, XLSX, or XLS format</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 mr-2" />
                    Generate Clinical Report
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-md">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Data Format Specifications</h3>
                </div>
                <span className="text-blue-600 text-xl">{showInstructions ? '−' : '+'}</span>
              </button>
              
              {showInstructions && (
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <p className="font-semibold">Required Columns:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>county:</strong> County name (text)</li>
                    <li><strong>temperature:</strong> °C (numeric)</li>
                    <li><strong>rainfall:</strong> mm (numeric)</li>
                    <li><strong>humidity:</strong> % (numeric)</li>
                    <li><strong>month:</strong> 1-12 (integer)</li>
                    <li><strong>year:</strong> e.g., 2024 (integer)</li>
                  </ul>
                  
                  <button
                    onClick={downloadSample}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Medical Template
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Analysis Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results ? (
              <div className="space-y-6">
                {/* WHO Epidemiological Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">WHO Epidemiological Intelligence Report</h2>
                      <p className="text-blue-100 text-sm">Generated: {new Date(results.analysis_timestamp).toLocaleString()}</p>
                    </div>
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-blue-100 text-xs mb-1">Report Classification</p>
                      <p className="font-bold text-sm">{results.report_classification}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-blue-100 text-xs mb-1">Data Quality</p>
                      <p className="font-bold text-sm">{results.data_quality}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-blue-100 text-xs mb-1">Records Analyzed</p>
                      <p className="font-bold text-sm">{results.total_records_analyzed}</p>
                    </div>
                  </div>
                </div>

                {/* Epidemiological Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                    Epidemiological Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <p className="text-xs text-gray-600 mb-1">Total Predicted Cases</p>
                      <p className="text-2xl font-bold text-red-900">{Math.round(results.epidemiological_summary.total_predicted_cases)}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <p className="text-xs text-gray-600 mb-1">Estimated Deaths</p>
                      <p className="text-2xl font-bold text-orange-900">{results.epidemiological_summary.total_estimated_deaths}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <p className="text-xs text-gray-600 mb-1">Hospitalizations</p>
                      <p className="text-2xl font-bold text-yellow-900">{Math.round(results.epidemiological_summary.total_hospitalizations_required)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <p className="text-xs text-gray-600 mb-1">High Risk Counties</p>
                      <p className="text-2xl font-bold text-purple-900">{results.epidemiological_summary.counties_at_high_risk}</p>
                    </div>
                  </div>
                  <div className={`mt-4 p-4 rounded-lg ${
                    results.epidemiological_summary.overall_transmission_status === 'Epidemic Alert' ? 'bg-red-100 border border-red-300' :
                    results.epidemiological_summary.overall_transmission_status === 'High Alert' ? 'bg-orange-100 border border-orange-300' :
                    'bg-yellow-100 border border-yellow-300'
                  }`}>
                    <p className="font-semibold text-gray-900">Overall Status: {results.epidemiological_summary.overall_transmission_status}</p>
                  </div>
                </div>

                {/* Resource Requirements */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-6 h-6 text-green-600 mr-2" />
                    Resource Requirements
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <p className="text-xs text-gray-600 mb-1">ACT Courses Required</p>
                      <p className="text-xl font-bold text-green-900">{results.resource_requirements.total_act_courses_required.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="text-xs text-gray-600 mb-1">RDTs Required</p>
                      <p className="text-xl font-bold text-blue-900">{results.resource_requirements.total_rdts_required.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <p className="text-xs text-gray-600 mb-1">Hospital Beds</p>
                      <p className="text-xl font-bold text-purple-900">{results.resource_requirements.total_hospital_beds_required}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Predictions Table */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Clipboard className="w-6 h-6 text-blue-600 mr-2" />
                    Detailed County Analysis
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">County</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Predicted Cases</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">WHO Severity</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Clinical Priority</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.detailed_predictions.slice(0, 10).map((pred, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{pred.county}</td>
                            <td className="px-4 py-3 text-sm font-bold text-blue-900">
                              {Math.round(pred.epidemiological_forecast.predicted_cases)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(pred.who_classification.severity)}`}>
                                {pred.who_classification.severity}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700">{pred.who_classification.clinical_priority}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => setSelectedPrediction(pred)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                              >
                                View Details →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Detailed View Modal */}
                {selectedPrediction && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-bold">{selectedPrediction.county} - Clinical Report</h3>
                            <p className="text-blue-100 mt-1">Comprehensive Epidemiological Analysis</p>
                          </div>
                          <button
                            onClick={() => setSelectedPrediction(null)}
                            className="text-white hover:bg-white/20 rounded-lg p-2"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        {/* Epidemiological Forecast */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">📊 Epidemiological Forecast</h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Predicted Cases</p>
                              <p className="text-xl font-bold text-blue-900">{Math.round(selectedPrediction.epidemiological_forecast.predicted_cases)}</p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Est. Deaths</p>
                              <p className="text-xl font-bold text-red-900">{selectedPrediction.epidemiological_forecast.estimated_mortality}</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Hospitalizations</p>
                              <p className="text-xl font-bold text-orange-900">{Math.round(selectedPrediction.epidemiological_forecast.estimated_hospitalizations)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Clinical Preparedness */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">🏥 Clinical Preparedness Requirements</h4>
                          <div className="space-y-2 bg-green-50 p-4 rounded-lg">
                            {Object.entries(selectedPrediction.clinical_preparedness).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="font-semibold text-gray-900">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Vector Control */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">🦟 Vector Control Strategy</h4>
                          <p className="text-sm text-gray-700 bg-purple-50 p-4 rounded-lg">{selectedPrediction.vector_control_strategy}</p>
                        </div>

                        {/* Intervention Timeline */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">📅 Intervention Timeline</h4>
                          <div className="space-y-2">
                            {selectedPrediction.intervention_timeline.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                                <span className="font-bold text-blue-600">Week {item.week}:</span>
                                <span className="text-sm text-gray-700">{item.action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Public Health Recommendations */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">🎯 Public Health Recommendations</h4>
                          <div className="space-y-2 bg-yellow-50 p-4 rounded-lg">
                            {Object.entries(selectedPrediction.public_health_recommendations).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-semibold text-gray-900 capitalize">{key.replace(/_/g, ' ')}: </span>
                                <span className="text-gray-700">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 border-2 border-dashed border-gray-300 text-center">
                <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Upload clinical data to generate WHO-aligned report
                </h3>
                <p className="text-gray-500 mb-6">
                  Select a CSV or Excel file with weather data and receive comprehensive epidemiological analysis
                </p>
                <button
                  onClick={downloadSample}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-flex items-center shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Medical Template
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
