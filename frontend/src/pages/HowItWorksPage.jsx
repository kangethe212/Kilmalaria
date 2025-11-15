import { Link } from 'react-router-dom'
import { 
  Upload, Brain, BarChart3, Shield, ArrowLeft, 
  ArrowRight, CheckCircle, Microscope, Activity, Target
} from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Input Climate Data',
      description: 'Upload or input weather data including temperature, rainfall, and humidity for your region of interest.',
      details: [
        'CSV/Excel file upload supported',
        'Manual data entry available',
        'Real-time data integration',
        'Historical data analysis'
      ],
      color: 'blue'
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced machine learning model analyzes your data against 15,300+ historical records and climate patterns.',
      details: [
        '99.32% prediction accuracy',
        'Ensemble ML algorithms',
        'WHO-aligned protocols',
        'Real-time processing'
      ],
      color: 'green'
    },
    {
      number: '03',
      icon: BarChart3,
      title: 'Get Predictions',
      description: 'Receive comprehensive epidemiological forecasts with risk levels, case predictions, and intervention recommendations.',
      details: [
        'County-level predictions',
        'Up to 12 months ahead',
        'Risk classification',
        'Confidence intervals'
      ],
      color: 'purple'
    },
    {
      number: '04',
      icon: Shield,
      title: 'Take Action',
      description: 'Use insights to implement targeted prevention strategies, allocate resources, and protect communities.',
      details: [
        'Vector control guidance',
        'Resource allocation',
        'Intervention timelines',
        'Public health recommendations'
      ],
      color: 'red'
    }
  ]

  const workflow = [
    { step: 'Data Collection', icon: Upload, description: 'Gather climate & health data' },
    { step: 'ML Processing', icon: Brain, description: 'AI analyzes patterns' },
    { step: 'Forecasting', icon: BarChart3, description: 'Generate predictions' },
    { step: 'Decision Making', icon: Shield, description: 'Implement strategies' }
  ]

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
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white">How It Works</h1>
              <p className="text-xl text-blue-100 mt-2">From data to decisions in 4 simple steps</p>
            </div>
          </div>
          
          <p className="text-lg text-blue-50 max-w-3xl">
            Climalaria transforms complex epidemiological data into actionable insights using 
            state-of-the-art machine learning and public health intelligence.
          </p>
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Quick Workflow Overview</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {workflow.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex flex-col items-center text-center flex-1">
                  <div className="bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-2xl shadow-lg mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.step}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {index < workflow.length - 1 && (
                    <ArrowRight className="hidden md:block absolute right-0 w-6 h-6 text-gray-300" style={{ marginTop: '-50px', marginRight: '-30px' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detailed Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-black text-center text-gray-800 mb-16">Detailed Process</h2>
        
        <div className="space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            
            return (
              <div 
                key={index}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-blue-300 transition`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`text-6xl font-black bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 bg-clip-text text-transparent`}>
                      {step.number}
                    </span>
                    <div className={`bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 p-4 rounded-2xl shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                  
                  <div className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className={`w-5 h-5 text-${step.color}-600 flex-shrink-0`} />
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`flex-1 bg-gradient-to-br from-${step.color}-50 to-${step.color}-100 rounded-2xl p-8 flex items-center justify-center min-h-[300px]`}>
                  <Icon className={`w-48 h-48 text-${step.color}-300 opacity-50`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 shadow-2xl text-center">
          <Microscope className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">See It In Action</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience the power of AI-driven malaria prediction. Start analyzing data and generating forecasts today.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-10 py-5 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-xl transform hover:scale-105"
          >
            <Target className="w-6 h-6" />
            <span>Try Climalaria Free</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

