import { Link } from 'react-router-dom'
import { 
  Brain, Cloud, Map, BarChart3, Shield, Upload,
  Microscope, ArrowLeft, Zap, Target, CheckCircle
} from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: Brain,
      title: 'ML-Powered Predictions',
      description: 'Our machine learning model analyzes climate data and historical cases to predict malaria outbreaks with 99.32% accuracy.',
      badge: 'Core Feature',
      color: 'blue',
      stats: '99.32% Accuracy'
    },
    {
      icon: Cloud,
      title: 'Smart Chatbot',
      description: 'Get instant answers to malaria-related questions and guidance through our intelligent AI chatbot trained on WHO protocols.',
      badge: 'AI-Powered',
      color: 'green',
      stats: '24/7 Available'
    },
    {
      icon: Map,
      title: 'County-Level Insights',
      description: 'Access detailed predictions for all 47 Kenyan counties to target prevention efforts effectively with regional data.',
      badge: 'Geographic',
      color: 'indigo',
      stats: '47 Counties'
    },
    {
      icon: Cloud,
      title: 'Climate Data Integration',
      description: 'Input temperature, rainfall, and humidity data to generate accurate predictions based on current weather conditions.',
      badge: 'Real-Time',
      color: 'cyan',
      stats: 'Live Data'
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'View intuitive charts and visualizations to understand malaria trends, risk factors, and epidemiological patterns.',
      badge: 'Insights',
      color: 'purple',
      stats: 'Interactive'
    },
    {
      icon: Shield,
      title: 'Prevention Resources',
      description: 'Access comprehensive WHO-aligned information about malaria symptoms, prevention strategies, and treatment protocols.',
      badge: 'Medical',
      color: 'red',
      stats: 'WHO-Aligned'
    },
    {
      icon: Upload,
      title: 'Batch Predictions',
      description: 'Upload CSV/Excel files with weather data to generate comprehensive WHO Epidemiological Intelligence Reports for multiple locations.',
      badge: 'Professional',
      color: 'orange',
      stats: 'Bulk Processing'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600 border-blue-200',
      green: 'from-green-500 to-green-600 bg-green-50 text-green-600 border-green-200',
      indigo: 'from-indigo-500 to-indigo-600 bg-indigo-50 text-indigo-600 border-indigo-200',
      cyan: 'from-cyan-500 to-cyan-600 bg-cyan-50 text-cyan-600 border-cyan-200',
      purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600 border-purple-200',
      red: 'from-red-500 to-red-600 bg-red-50 text-red-600 border-red-200',
      orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600 border-orange-200'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-blue-100 transition mb-8 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition" />
            Back to Home
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white">Features</h1>
              <p className="text-xl text-blue-100 mt-2">Discover the power of Climalaria</p>
            </div>
          </div>
          
          <p className="text-lg text-blue-50 max-w-3xl">
            Our comprehensive suite of medical-grade tools combines artificial intelligence, 
            machine learning, and epidemiological science to revolutionize malaria outbreak prediction and prevention.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const [gradient, bgColor, textColor, borderColor] = getColorClasses(feature.color).split(' ')
            
            return (
              <Link
                key={index}
                to="/auth"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-r ${gradient} p-6`}>
                  <div className="flex justify-between items-start">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-xs font-bold border ${borderColor}`}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-4">{feature.title}</h3>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700">{feature.stats}</span>
                    </div>
                    <div className="text-blue-600 group-hover:text-blue-700 font-semibold text-sm flex items-center">
                      Try Now
                      <ArrowLeft className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 shadow-2xl">
          <Microscope className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join health professionals and researchers using Climalaria to predict and prevent malaria outbreaks.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-10 py-5 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-xl transform hover:scale-105"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Start Free Today</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

