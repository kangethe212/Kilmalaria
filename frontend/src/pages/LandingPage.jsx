import { Link } from 'react-router-dom'
import { useState } from 'react'
// Icons we'll need throughout the page
import { 
  Activity, Map, MessageCircle, Shield, TrendingUp, Users, 
  Cloud, BarChart3, BookOpen, Mail, Phone, Send, 
  Brain, Eye, Heart, ChevronDown, ChevronUp, CheckCircle,
  Zap, Target, Database, Cpu, LineChart, AlertCircle,
  Microscope, Stethoscope, Clipboard, Award, Upload, Menu, X
} from 'lucide-react'

export default function LandingPage() {
  // FAQ accordion state - tracks which one is open
  const [openFaq, setOpenFaq] = useState(null)
  
  // Contact form state
  const [contactForm, setContactForm] = useState({ 
    name: '', 
    email: '', 
    message: '' 
  })
  
  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Simple FAQ toggle - if clicking the same one, close it
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Handle contact form - for now just shows alert
  // TODO: Connect to backend API later
  const handleContactSubmit = (e) => {
    e.preventDefault()
    // Simple feedback for now
    alert('Message sent! We will get back to you soon.')
    // Clear the form
    setContactForm({ name: '', email: '', message: '' })
  }

  // Helper to close mobile menu when navigating
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Main Navigation - sticky so it stays visible while scrolling */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            {/* Logo and branding */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Logo icon with gradient background */}
              <div className="bg-gradient-to-br from-blue-600 to-green-600 p-1.5 sm:p-2 rounded-xl shadow-lg">
                <Microscope className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                {/* Main logo text with gradient effect */}
                <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Kilmalaria
                </span>
                {/* Tagline - hidden on mobile to save space */}
                <p className="text-[10px] sm:text-xs text-gray-600 font-medium hidden sm:block">
                  AI-Powered Malaria Intelligence
                </p>
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/features" className="text-gray-700 hover:text-blue-600 transition font-medium">Features</Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 transition font-medium">How It Works</Link>
              <a href="#technology" className="text-gray-700 hover:text-blue-600 transition font-medium">Technology</a>
              <a href="#impact" className="text-gray-700 hover:text-blue-600 transition font-medium">Impact</a>
              <a href="#team" className="text-gray-700 hover:text-blue-600 transition font-medium">Team</a>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link to="/auth" className="text-blue-600 hover:text-blue-700 font-semibold transition">
                Log In
              </Link>
              <Link to="/auth" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base">
                Get Started Free
              </Link>
            </div>
            {/* Mobile hamburger menu - only visible on small screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile menu dropdown - slides down when opened */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
              <div className="flex flex-col space-y-3">
                <Link to="/features" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50">
                  Features
                </Link>
                <Link to="/how-it-works" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50">
                  How It Works
                </Link>
                <a href="#technology" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50">
                  Technology
                </a>
                <a href="#impact" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50">
                  Impact
                </a>
                <a href="#team" onClick={closeMobileMenu} className="text-gray-700 hover:text-blue-600 transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50">
                  Team
                </a>
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <Link to="/auth" onClick={closeMobileMenu} className="block text-blue-600 hover:text-blue-700 font-semibold transition py-2 px-2 rounded-lg hover:bg-blue-50">
                    Log In
                  </Link>
                  <Link to="/auth" onClick={closeMobileMenu} className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg text-center">
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - the big banner at the top */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Subtle pattern overlay for texture - makes it less flat */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Trust badge - shows we're aligned with WHO standards */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
              <Award className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">WHO-Aligned Medical Intelligence Platform</span>
            </div>

            {/* Main headline - big and bold */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight px-2">
              Revolutionizing Malaria
              <br />
              {/* Gradient text for the key phrase */}
              <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                Outbreak Prediction
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-10 max-w-4xl mx-auto leading-relaxed px-4">
              Advanced AI-powered epidemiological forecasting system combining machine learning, 
              climate science, and public health intelligence to predict and prevent malaria outbreaks across Kenya.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
              <Link 
                to="/auth" 
                className="bg-white text-blue-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all font-bold text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 touch-manipulation"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Start Predicting Now</span>
              </Link>
              <Link 
                to="/how-it-works" 
                className="bg-transparent text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all font-bold text-sm sm:text-base md:text-lg border-2 border-white backdrop-blur-sm flex items-center justify-center space-x-2 touch-manipulation"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>See How It Works</span>
              </Link>
            </div>

            {/* Key stats that build trust - shown as badges */}
            <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>76.67% ML Accuracy (Robust Model)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>12 Years Historical Data (2014-2025)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>40,042 Training Records</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>47 Counties • 100% Kenya Coverage</span>
              </div>
            </div>
          </div>

          {/* Stats cards - these numbers matter for credibility */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition border-t-4 border-blue-400">
              <Microscope className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-4xl font-black text-blue-600 mb-2">76.67%</div>
              <div className="text-gray-700 font-semibold">ML Accuracy (Robust)</div>
              <div className="text-xs text-gray-500 mt-2">Ensemble Model Performance</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition border-t-4 border-green-400">
              <Database className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-4xl font-black text-green-600 mb-2">40,042</div>
              <div className="text-gray-700 font-semibold">Training Records</div>
              <div className="text-xs text-gray-500 mt-2">67% from 2023-2025</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition border-t-4 border-purple-400">
              <Map className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-4xl font-black text-purple-600 mb-2">47</div>
              <div className="text-gray-700 font-semibold">Kenyan Counties</div>
              <div className="text-xs text-gray-500 mt-2">Complete National Coverage</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition border-t-4 border-red-400">
              <LineChart className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-black text-red-600 mb-2">12</div>
              <div className="text-gray-700 font-semibold">Months Ahead</div>
              <div className="text-xs text-gray-500 mt-2">Prediction Horizon</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - showcase what the platform can do */}
      <div id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Kilmalaria helps predict, prevent, and protect against malaria outbreaks.
            </p>
          </div>
          
          {/* Feature cards grid - responsive layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/auth" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer transform hover:scale-105 border-l-4 border-blue-600">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <Brain className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">ML-Powered Predictions</h3>
              <p className="text-gray-600 mb-4">
                Advanced ensemble machine learning models analyze 40,042 records to forecast malaria cases 1-12 months ahead with 76.67% robust accuracy. Select any county and prediction period for instant forecasts.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-blue-600 font-semibold">Try Now →</p>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">ML Prediction</span>
              </div>
            </Link>

            <Link to="/auth" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer transform hover:scale-105 border-l-4 border-green-600">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <MessageCircle className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Smart AI Chatbot</h3>
              <p className="text-gray-600 mb-4">
                Intelligent conversational AI trained on comprehensive malaria knowledge. Ask about symptoms, treatment, prevention, get predictions, or county statistics in natural language.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-green-600 font-semibold">Chat Now →</p>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">AI Chat</span>
              </div>
            </Link>

            <Link to="/auth" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer transform hover:scale-105 border-l-4 border-purple-600">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <Map className="h-8 w-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">County-Level Insights</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive malaria statistics for all 47 Kenyan counties. View historical data, peak periods, total cases, averages, and recent trends with interactive county selection.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-purple-600 font-semibold">View Counties →</p>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">47 Counties</span>
              </div>
            </Link>

            <Link to="/auth" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer transform hover:scale-105 border-l-4 border-yellow-600">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <Cloud className="h-8 w-8 text-yellow-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Climate Data Integration</h3>
              <p className="text-gray-600 mb-4">
                Input current weather conditions (temperature, rainfall, humidity) to generate climate-based predictions. Real-time analysis of how weather patterns affect malaria transmission risk.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-yellow-600 font-semibold">Get Started →</p>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Climate AI</span>
              </div>
            </Link>

            <Link to="/auth" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer transform hover:scale-105 border-l-4 border-red-600">
              <div className="bg-gradient-to-br from-red-100 to-red-200 w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <BarChart3 className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Visual Analytics</h3>
              <p className="text-gray-600 mb-4">
                Interactive data visualizations with color-coded risk levels, trend analysis, historical comparisons, and forecast charts. View 6-month predictions with graphical representations.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-red-600 font-semibold">Explore →</p>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Charts & Graphs</span>
              </div>
            </Link>

            <Link to="/auth" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer transform hover:scale-105 border-l-4 border-teal-600">
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <BookOpen className="h-8 w-8 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Prevention Resources</h3>
              <p className="text-gray-600 mb-4">
                WHO-aligned medical information: symptoms, prevention methods (LLINs, IRS), treatment options (ACTs), vulnerable groups (children, pregnant women), and emergency protocols.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-teal-600 font-semibold">Learn More →</p>
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">Medical Info</span>
              </div>
            </Link>

            <Link to="/auth" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer transform hover:scale-105 border-l-4 border-orange-600">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-md">
                <Upload className="h-8 w-8 text-orange-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Upload Weather Data</h3>
              <p className="text-gray-600 mb-4">
                Upload CSV/Excel files with weather data for batch predictions. Generate WHO Epidemiological Intelligence Reports with clinical preparedness requirements and resource allocation recommendations.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-orange-600 font-semibold">Upload Now →</p>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">Batch Analysis</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gradient-to-br from-white via-blue-50 to-green-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-6 py-2 rounded-full mb-6">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-semibold text-sm">CLINICAL WORKFLOW</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">How The System Works</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kilmalaria integrates advanced machine learning, epidemiological data, and climate science 
              to deliver real-time malaria outbreak predictions through a simple, intuitive interface.
            </p>
          </div>

          {/* System Architecture Flow */}
          <div className="mb-24">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Complete System Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500 h-full">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                    1
                  </div>
                  <Clipboard className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 text-center mb-2">Data Collection</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Historical malaria cases, climate data (rainfall, temp, humidity), population statistics
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="text-blue-500 text-3xl">→</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-green-500 h-full">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                    2
                  </div>
                  <Database className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 text-center mb-2">Data Processing</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Feature engineering, normalization, lagged variables, seasonal patterns
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="text-green-500 text-3xl">→</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-purple-500 h-full">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                    3
                  </div>
                  <Cpu className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 text-center mb-2">ML Training</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Ensemble models (RandomForest, GradientBoosting, ExtraTrees) trained on 6,204 records
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="text-purple-500 text-3xl">→</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-red-500 h-full">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                    4
                  </div>
                  <Target className="w-10 h-10 text-red-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 text-center mb-2">Prediction</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Real-time forecasting for 1-12 months ahead with 76.67% robust accuracy
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="text-red-500 text-3xl">→</div>
                </div>
              </div>

              {/* Step 5 */}
              <div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-yellow-500 h-full">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                    5
                  </div>
                  <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 text-center mb-2">Action</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Health workers receive actionable insights for prevention and resource planning
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Journey */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Your Journey with Kilmalaria</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-110 transition">
                  <Users className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">1. Create Account</h4>
                <p className="text-gray-600">
                  Sign up in 30 seconds with email or Google. Secure authentication powered by Firebase.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-110 transition">
                  <Map className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">2. Select County</h4>
                <p className="text-gray-600">
                  Choose from 47 Kenyan counties. View historical data, trends, and risk levels.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-110 transition">
                  <Cloud className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">3. Input Climate Data</h4>
                <p className="text-gray-600">
                  Enter temperature, rainfall, humidity. Or use our AI chatbot for instant answers.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-110 transition">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900">4. Get Predictions</h4>
                <p className="text-gray-600">
                  Receive month-by-month forecasts with risk levels, trends, and actionable insights.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Predicting?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join healthcare professionals using Kilmalaria to save lives through early malaria detection.
            </p>
            <Link 
              to="/auth" 
              className="bg-white text-blue-600 px-12 py-5 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 inline-flex items-center space-x-3"
            >
              <Zap className="w-6 h-6" />
              <span>Start Free Now</span>
            </Link>
            <p className="text-blue-100 mt-4 text-sm">No credit card required • Free forever</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Kilmalaria</h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Kilmalaria is an intelligent malaria prediction platform designed to assist in the early detection and 
              proactive management of malaria outbreaks across Kenyan counties. This innovative application harnesses 
              the power of machine learning, trained on three years of historical data—including monthly malaria case 
              reports, temperature trends, and rainfall patterns—for all counties in Kenya.
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Mission</h3>
            <p className="text-xl text-center text-gray-700 mb-12 max-w-3xl mx-auto">
              To empower communities and health workers with actionable insights for predicting, preventing, 
              and protecting against malaria outbreaks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Predict</h4>
                <p className="text-gray-600">
                  Leverage machine learning to forecast malaria outbreaks with precision.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Prevent</h4>
                <p className="text-gray-600">
                  Enable proactive resource allocation and targeted prevention efforts.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Protect</h4>
                <p className="text-gray-600">
                  Safeguard communities through early warning and education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div id="technology" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-6 py-2 rounded-full mb-6">
              <Cpu className="w-5 h-5 text-purple-600" />
              <span className="text-purple-900 font-semibold text-sm">ADVANCED TECHNOLOGY STACK</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">Powered by Cutting-Edge AI</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kilmalaria leverages state-of-the-art machine learning algorithms and modern web technologies 
              to deliver accurate, reliable malaria predictions in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Machine Learning Stack */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-10 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Machine Learning</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Ensemble Models</p>
                    <p className="text-gray-600 text-sm">RandomForest, GradientBoosting, ExtraTrees combined for optimal accuracy</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Feature Engineering</p>
                    <p className="text-gray-600 text-sm">37 engineered features including lagged variables, climate interactions, seasonal patterns</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Training Data</p>
                    <p className="text-gray-600 text-sm">40,042 records spanning 12 years (2014-2025) across 47 counties, with 72% focus on recent years (2022-2025)</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Performance Metrics</p>
                    <p className="text-gray-600 text-sm">76.67% R² score, MAE: 75.36 cases, GradientBoosting ensemble with daily/weekly granularity</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-10 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-600 p-3 rounded-xl">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Technology Stack</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Backend API</p>
                    <p className="text-gray-600 text-sm">Python Flask, Scikit-learn, Pandas, NumPy, Joblib</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Frontend</p>
                    <p className="text-gray-600 text-sm">React, Vite, Tailwind CSS, Zustand, Axios</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Authentication & Database</p>
                    <p className="text-gray-600 text-sm">Firebase Auth, Firestore for secure user data</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">AI Chatbot</p>
                    <p className="text-gray-600 text-sm">Custom NLP engine with comprehensive malaria knowledge base</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div id="impact" className="bg-gradient-to-br from-green-50 via-blue-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-6 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 text-green-600" />
              <span className="text-green-900 font-semibold text-sm">REAL-WORLD IMPACT</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6">Making a Difference</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kilmalaria empowers healthcare professionals and communities to fight malaria through data-driven insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-10 shadow-xl text-center border-t-4 border-blue-500 hover:shadow-2xl transition">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Early Detection</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Predict outbreaks up to 12 months in advance, enabling proactive intervention and resource allocation.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl text-center border-t-4 border-green-500 hover:shadow-2xl transition">
              <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Prevention</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Target high-risk areas with preventive measures, reducing malaria transmission and saving lives.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl text-center border-t-4 border-red-500 hover:shadow-2xl transition">
              <div className="bg-red-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Lives Saved</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Reduce malaria mortality through early warning systems and evidence-based healthcare planning.
              </p>
            </div>
          </div>

          {/* WHO Alignment */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-center shadow-2xl">
            <Award className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">WHO-Aligned Methodology</h3>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our prediction models align with World Health Organization guidelines for malaria surveillance, 
              incorporating Kenya Ministry of Health protocols and international epidemiological standards.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div id="team" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About the Developer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The mind behind Kilmalaria - combining technology and innovation to combat malaria.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Benson Maina */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-12 text-center hover:shadow-xl transition">
              <div className="bg-blue-600 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Benson Maina</h3>
              <p className="text-blue-600 font-semibold text-xl mb-4">Full Stack Developer</p>
              <p className="text-gray-700 text-lg mb-6">
                Machakos University
              </p>
              <p className="text-gray-600 leading-relaxed">
                Passionate about leveraging machine learning and web technologies to solve real-world health challenges. 
                Developed the complete Kilmalaria platform - from ML models to the interactive frontend - to democratize 
                access to malaria prediction insights across Kenya.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Machine Learning</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Full Stack Development</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">NLP & AI</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Public Health Tech</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about Kilmalaria.
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-lg text-gray-900">How accurate are the predictions?</span>
                {openFaq === 0 ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-blue-600" />}
              </button>
              {openFaq === 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">
                    Our machine learning model has been trained on three years of historical data and continuously improves 
                    with new data. The predictions typically achieve high accuracy rates for county-level forecasting.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-lg text-gray-900">What data do I need to make a prediction?</span>
                {openFaq === 1 ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-blue-600" />}
              </button>
              {openFaq === 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">
                    You'll need to select a county, month, and input temperature and rainfall data. The platform will 
                    guide you through the process to ensure accurate predictions.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-lg text-gray-900">Is my data secure?</span>
                {openFaq === 2 ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-blue-600" />}
              </button>
              {openFaq === 2 && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">
                    Yes, we take data security seriously. All user data is encrypted and stored securely. We do not share 
                    your personal information with third parties.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-lg text-gray-900">Can I use Kilmalaria on mobile devices?</span>
                {openFaq === 3 ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-blue-600" />}
              </button>
              {openFaq === 3 && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">
                    Yes, Kilmalaria is fully responsive and works on all devices, including smartphones and tablets, 
                    allowing you to access predictions on the go.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to predict malaria outbreaks?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Kilmalaria today and help protect communities across Kenya.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/auth" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg text-lg">
              Sign Up Now
            </Link>
            <Link to="/auth" className="bg-blue-800 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-lg text-lg">
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@kilmalaria.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">+254 112 211 691</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows="5"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Kilmalaria</span>
              </div>
              <p className="text-gray-400">
                Predict, prevent, and protect against malaria outbreaks with data-driven insights.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#team" className="text-gray-400 hover:text-white transition">Team</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Malaria Information</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Prevention Tips</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Research Papers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API Documentation</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Data Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Kilmalaria. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

