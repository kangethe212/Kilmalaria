import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { authService } from '../services/firebase'
import { 
  Activity, 
  MessageCircle, 
  Map, 
  TrendingUp, 
  LogOut,
  Plus,
  Trash2,
  Clock,
  BarChart3,
  Cloud,
  Shield,
  Upload,
  Mail,
  X
} from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard() {
  const { user, signOut } = useAuthStore()
  const { chats, loadChats, deleteChat, clearCurrentChat } = useChatStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [showVerificationBanner, setShowVerificationBanner] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)

  useEffect(() => {
    if (user) {
      loadChats(user.uid).finally(() => setLoading(false))
      // Check if email is verified
      if (user.email && !user.emailVerified) {
        setShowVerificationBanner(true)
      }
    }
  }, [user, loadChats])

  const handleResendVerification = async () => {
    if (!user) return
    setResendingEmail(true)
    try {
      await authService.resendEmailVerification(user)
      alert('Verification email sent! Please check your inbox.')
    } catch (error) {
      alert(`Failed to send verification email: ${error.message}`)
    } finally {
      setResendingEmail(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleNewChat = () => {
    clearCurrentChat()
    navigate('/chat')
  }

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this conversation?')) {
      await deleteChat(chatId, user.uid)
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Recently'
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return format(date, 'MMM d, yyyy')
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">Climalaria</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.displayName || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Email Verification Banner */}
        {showVerificationBanner && user && !user.emailVerified && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <Mail className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">Verify Your Email Address</h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Please verify your email address ({user.email}) to access all features. 
                    Check your inbox for the verification link.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={resendingEmail}
                    className="text-sm text-yellow-700 hover:text-yellow-900 underline font-medium disabled:opacity-50"
                  >
                    {resendingEmail ? 'Sending...' : 'Resend verification email'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowVerificationBanner(false)}
                className="text-yellow-600 hover:text-yellow-800 ml-4"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || 'there'}!
          </h1>
          <p className="text-gray-600">
            Get malaria predictions and insights through our AI chatbot
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/predictions')}
            className="card hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 text-left transform hover:scale-105"
          >
            <TrendingUp className="h-12 w-12 text-blue-600 mb-3" />
            <h3 className="text-lg font-bold text-blue-900 mb-2">ML-Powered Predictions</h3>
            <p className="text-sm text-gray-600">Analyze climate data and predict malaria outbreaks</p>
            <p className="text-blue-600 font-semibold text-sm mt-3">Try Now →</p>
          </button>

          <button
            onClick={handleNewChat}
            className="card hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 text-left transform hover:scale-105"
          >
            <MessageCircle className="h-12 w-12 text-green-600 mb-3" />
            <h3 className="text-lg font-bold text-green-900 mb-2">Smart Chatbot</h3>
            <p className="text-sm text-gray-600">Get instant answers to malaria-related questions</p>
            <p className="text-green-600 font-semibold text-sm mt-3">Chat Now →</p>
          </button>

          <button
            onClick={() => navigate('/counties')}
            className="card hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 text-left transform hover:scale-105"
          >
            <Map className="h-12 w-12 text-purple-600 mb-3" />
            <h3 className="text-lg font-bold text-purple-900 mb-2">County-Level Insights</h3>
            <p className="text-sm text-gray-600">Detailed predictions for all Kenyan counties</p>
            <p className="text-purple-600 font-semibold text-sm mt-3">View Counties →</p>
          </button>

          <button
            onClick={() => navigate('/climate')}
            className="card hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 text-left transform hover:scale-105"
          >
            <Cloud className="h-12 w-12 text-yellow-600 mb-3" />
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Climate Data Integration</h3>
            <p className="text-sm text-gray-600">Input temperature and rainfall for predictions</p>
            <p className="text-yellow-600 font-semibold text-sm mt-3">Get Started →</p>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="card hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 text-left transform hover:scale-105"
          >
            <BarChart3 className="h-12 w-12 text-red-600 mb-3" />
            <h3 className="text-lg font-bold text-red-900 mb-2">Visual Analytics</h3>
            <p className="text-sm text-gray-600">View charts and visualizations of trends</p>
            <p className="text-red-600 font-semibold text-sm mt-3">Explore →</p>
          </button>

          <button
            onClick={() => navigate('/prevention')}
            className="card hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 text-left transform hover:scale-105"
          >
            <Shield className="h-12 w-12 text-teal-600 mb-3" />
            <h3 className="text-lg font-bold text-teal-900 mb-2">Prevention Resources</h3>
            <p className="text-sm text-gray-600">Learn about symptoms, prevention, and treatment</p>
            <p className="text-teal-600 font-semibold text-sm mt-3">Learn More →</p>
          </button>

          <button
            onClick={() => navigate('/upload')}
            className="card hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 text-left transform hover:scale-105"
          >
            <Upload className="h-12 w-12 text-orange-600 mb-3" />
            <h3 className="text-lg font-bold text-orange-900 mb-2">Upload Data File</h3>
            <p className="text-sm text-gray-600">Upload your weather data for batch predictions</p>
            <p className="text-orange-600 font-semibold text-sm mt-3">Upload Now →</p>
          </button>
        </div>

        {/* Recent Conversations */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Conversations</h2>
            <button onClick={handleNewChat} className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No conversations yet</p>
              <button onClick={handleNewChat} className="btn-primary">
                Start Your First Chat
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <MessageCircle className="h-5 w-5 text-primary-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {chat.title || 'Untitled Chat'}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimestamp(chat.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => {
              clearCurrentChat()
              navigate('/chat')
            }}
            className="card bg-blue-50 hover:bg-blue-100 cursor-pointer text-left transition transform hover:scale-105"
          >
            <h3 className="font-semibold mb-2">💬 Ask about predictions</h3>
            <p className="text-sm text-gray-600 mb-3">
              "Predict malaria in Nairobi for 6 months"
            </p>
            <p className="text-blue-600 font-semibold text-sm">Click to try →</p>
          </button>
          
          <button 
            onClick={() => {
              clearCurrentChat()
              navigate('/chat')
            }}
            className="card bg-green-50 hover:bg-green-100 cursor-pointer text-left transition transform hover:scale-105"
          >
            <h3 className="font-semibold mb-2">📊 Get statistics</h3>
            <p className="text-sm text-gray-600 mb-3">
              "Show me Kisumu county statistics"
            </p>
            <p className="text-green-600 font-semibold text-sm">Click to try →</p>
          </button>
          
          <button 
            onClick={() => {
              clearCurrentChat()
              navigate('/chat')
            }}
            className="card bg-purple-50 hover:bg-purple-100 cursor-pointer text-left transition transform hover:scale-105"
          >
            <h3 className="font-semibold mb-2">🏥 Learn about malaria</h3>
            <p className="text-sm text-gray-600 mb-3">
              "What are malaria symptoms?"
            </p>
            <p className="text-purple-600 font-semibold text-sm">Click to try →</p>
          </button>
        </div>
      </div>
    </div>
  )
}

