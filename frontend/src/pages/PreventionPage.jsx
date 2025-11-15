import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, AlertTriangle, Pill, Heart, Baby, Users, MessageCircle } from 'lucide-react'

export default function PreventionPage() {
  const navigate = useNavigate()

  const symptoms = [
    { icon: '🤒', title: 'High Fever', description: 'Sudden fever above 38°C (100.4°F)' },
    { icon: '🥶', title: 'Chills & Sweating', description: 'Cyclical chills followed by sweating' },
    { icon: '🤕', title: 'Severe Headache', description: 'Intense headaches and body aches' },
    { icon: '🤮', title: 'Nausea & Vomiting', description: 'Feeling sick with possible vomiting' },
    { icon: '😫', title: 'Fatigue', description: 'Extreme tiredness and weakness' },
    { icon: '💊', title: 'Muscle Pain', description: 'Body and joint aches' }
  ]

  const preventionMethods = [
    {
      icon: Shield,
      title: 'Mosquito Nets',
      description: 'Sleep under insecticide-treated bed nets (ITNs) every night',
      effectiveness: '95%',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Indoor Spraying',
      description: 'Use indoor residual spraying (IRS) in high-risk areas',
      effectiveness: '90%',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Repellents',
      description: 'Apply mosquito repellents containing DEET, especially at dusk/dawn',
      effectiveness: '85%',
      color: 'purple'
    },
    {
      icon: Pill,
      title: 'Antimalarial Drugs',
      description: 'Take preventive medications if traveling to endemic areas',
      effectiveness: '90%',
      color: 'red'
    },
    {
      icon: Shield,
      title: 'Protective Clothing',
      description: 'Wear long sleeves and pants during peak mosquito hours',
      effectiveness: '70%',
      color: 'yellow'
    },
    {
      icon: Shield,
      title: 'Eliminate Breeding Sites',
      description: 'Remove standing water where mosquitoes breed',
      effectiveness: '80%',
      color: 'teal'
    }
  ]

  const treatments = [
    {
      name: 'Artemisinin-based Combination Therapies (ACTs)',
      description: 'First-line treatment recommended by WHO',
      duration: '3 days',
      effectiveness: '95%+'
    },
    {
      name: 'Coartem (Artemether-Lumefantrine)',
      description: 'Most commonly used ACT in Kenya',
      duration: '3 days',
      effectiveness: '97%'
    },
    {
      name: 'Quinine',
      description: 'Alternative for severe malaria or treatment failure',
      duration: '7 days',
      effectiveness: '90%'
    }
  ]

  const vulnerableGroups = [
    {
      icon: Baby,
      title: 'Children Under 5',
      risk: 'Highest',
      description: 'Immature immune systems make young children extremely vulnerable. Account for 67% of malaria deaths globally.',
      precautions: ['Regular ITN use', 'Prompt treatment', 'Preventive drugs', 'Regular check-ups']
    },
    {
      icon: Heart,
      title: 'Pregnant Women',
      risk: 'Very High',
      description: 'Pregnancy reduces immunity to malaria. Can cause severe anemia, premature birth, and low birth weight.',
      precautions: ['IPTp (preventive treatment)', 'ITN use', 'Early ANC visits', 'Prompt diagnosis']
    },
    {
      icon: Users,
      title: 'HIV/AIDS Patients',
      risk: 'High',
      description: 'Weakened immune systems increase susceptibility and severity of malaria infections.',
      precautions: ['Co-trimoxazole prophylaxis', 'ITN use', 'Early treatment', 'Regular monitoring']
    }
  ]

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
                <h1 className="text-2xl font-bold text-blue-900">Prevention & Treatment Resources</h1>
                <p className="text-sm text-gray-600">Comprehensive malaria information & guidance</p>
              </div>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Emergency Alert */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">⚠️ Seek Immediate Medical Attention If:</h2>
              <ul className="space-y-1 text-sm">
                <li>• Fever persists for more than 48 hours</li>
                <li>• Severe headache with confusion or seizures</li>
                <li>• Difficulty breathing or chest pain</li>
                <li>• Inability to eat or drink</li>
                <li>• Signs of severe anemia (pale skin, rapid heartbeat)</li>
              </ul>
              <p className="mt-3 font-semibold">📞 Emergency Hotline: 0800 721 316 (Kenya MOH)</p>
            </div>
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">🩺 Malaria Symptoms</h2>
          <p className="text-gray-600 mb-6">
            Symptoms typically appear 10-15 days after infection. Early detection is crucial for effective treatment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {symptoms.map((symptom, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 border border-blue-100">
                <div className="text-3xl mb-2">{symptom.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{symptom.title}</h3>
                <p className="text-sm text-gray-600">{symptom.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention Methods */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">🛡️ Prevention Methods</h2>
          <p className="text-gray-600 mb-6">
            Prevention is the most effective way to combat malaria. Combining multiple methods provides the best protection.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preventionMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <div key={index} className={`bg-${method.color}-50 rounded-lg p-5 border border-${method.color}-100`}>
                  <Icon className={`w-8 h-8 text-${method.color}-600 mb-3`} />
                  <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Effectiveness</span>
                    <span className={`text-lg font-bold text-${method.color}-600`}>{method.effectiveness}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Treatment Options */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">💊 Treatment Options</h2>
          <p className="text-gray-600 mb-6">
            Malaria is curable if diagnosed and treated promptly. All treatments should be administered under medical supervision.
          </p>
          <div className="space-y-4">
            {treatments.map((treatment, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-5 border border-green-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{treatment.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{treatment.description}</p>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {treatment.effectiveness}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span>⏱️ Duration: {treatment.duration}</span>
                  <span>✅ WHO Approved</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> Always complete the full course of treatment, even if symptoms improve. 
              Never self-medicate or share medications.
            </p>
          </div>
        </div>

        {/* Vulnerable Groups */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">👨‍👩‍👧‍👦 Vulnerable Groups</h2>
          <p className="text-gray-600 mb-6">
            Certain groups face higher risk and require special protection measures.
          </p>
          <div className="space-y-6">
            {vulnerableGroups.map((group, index) => {
              const Icon = group.icon
              return (
                <div key={index} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-100">
                  <div className="flex items-start space-x-4">
                    <Icon className="w-10 h-10 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-lg">{group.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          group.risk === 'Highest' ? 'bg-red-600 text-white' :
                          group.risk === 'Very High' ? 'bg-orange-600 text-white' :
                          'bg-yellow-600 text-white'
                        }`}>
                          {group.risk} Risk
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{group.description}</p>
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Recommended Precautions:</p>
                        <ul className="grid grid-cols-2 gap-2">
                          {group.precautions.map((precaution, i) => (
                            <li key={i} className="text-sm text-gray-600">✓ {precaution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center shadow-xl">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Have Questions?</h2>
          <p className="mb-6">Our AI chatbot can answer your malaria-related questions 24/7</p>
          <button
            onClick={() => navigate('/chat')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Chat with AI Assistant
          </button>
        </div>
      </div>
    </div>
  )
}

