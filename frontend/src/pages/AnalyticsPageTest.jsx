import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function AnalyticsPageTest() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <button onClick={() => navigate('/dashboard')} className="mb-4 flex items-center space-x-2 text-blue-600">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>
      
      <h1 className="text-4xl font-bold text-blue-900 mb-4">Analytics Test Page</h1>
      <p className="text-xl text-gray-700 mb-4">✅ If you can see this, the page is loading correctly!</p>
      
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Test Content</h2>
        <p>This is a simple test to verify the page loads without errors.</p>
      </div>
    </div>
  )
}

