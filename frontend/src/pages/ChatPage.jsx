import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import ChatMessage from '../components/ChatMessage'
// Icons for the chat interface
import { 
  Activity, 
  Send, 
  ArrowLeft, 
  Loader,
  Bot,
  AlertCircle,
  CheckCircle,
  Info,
  X
} from 'lucide-react'
import { format } from 'date-fns'

export default function ChatPage() {
  // Get chat ID from URL params
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  // Chat store - handles messages and chat state
  const { 
    messages, 
    currentChat, 
    loadMessages, 
    sendMessage, 
    createNewChat, 
    sending,
    error
  } = useChatStore()
  
  // Local state
  const [input, setInput] = useState('')
  const [isNewChat, setIsNewChat] = useState(!chatId)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  
  // Ref for auto-scrolling to bottom when new messages arrive
  const messagesEndRef = useRef(null)

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  // Auto-dismiss success messages after 3 seconds (shorter since they're less critical)
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Load messages when chat ID changes
  useEffect(() => {
    if (chatId && chatId !== currentChat) {
      // Try to load from Firestore, but don't fail if it doesn't work
      loadMessages(chatId).catch(err => {
        console.warn('Failed to load messages from Firestore:', err)
        // Continue anyway - messages will be in local state
      })
      setIsNewChat(false)
    } else if (!chatId) {
      // No chat ID means it's a new chat
      setIsNewChat(true)
    }
  }, [chatId, currentChat, loadMessages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getErrorMessage = (error) => {
    const message = error.message || error.toString()
    
    if (message.includes('timeout') || message.includes('ECONNABORTED')) {
      return {
        title: 'Request Timeout',
        message: 'The chatbot is taking longer than expected to respond.',
        action: 'Please wait a moment and try again. The service may be processing your request.'
      }
    }
    
    if (message.includes('network') || message.includes('ECONNREFUSED') || message.includes('Failed to fetch')) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the chatbot service.',
        action: 'Please check your internet connection and ensure the ML service is running on port 8000.'
      }
    }
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return {
        title: 'Authentication Required',
        message: 'You need to be logged in to use the chatbot.',
        action: 'Please sign in to continue.'
      }
    }
    
    return {
      title: 'Error Sending Message',
      message: message || 'Something went wrong while sending your message.',
      action: 'Please try again in a moment.'
    }
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return
    
    // Check if user is logged in
    if (!user || !user.uid) {
      setErrorMessage({
        title: 'Sign In Required',
        message: 'Please sign in to use the chatbot.',
        action: 'Redirecting to sign in page...'
      })
      setTimeout(() => navigate('/auth'), 1500)
      return
    }

    const messageText = input.trim()
    setInput('')
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      if (isNewChat) {
        // Create new chat with first message
        const title = messageText.slice(0, 50) + (messageText.length > 50 ? '...' : '')
        const firstMessage = {
          sender: 'user',
          text: messageText
        }
        
        const newChatId = await createNewChat(user.uid, title, firstMessage)
        
        // Navigate to the new chat
        navigate(`/chat/${newChatId}`, { replace: true })
        setIsNewChat(false)
        
        // Send to chatbot and get response
        await sendMessage(newChatId, user.uid, messageText)
        setSuccessMessage('Message sent successfully!')
      } else {
        // Add to existing chat
        await sendMessage(currentChat, user.uid, messageText)
        setSuccessMessage('Message sent successfully!')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorInfo = getErrorMessage(error)
      setErrorMessage(errorInfo)
    }
  }
  
  const handleSuggestionClick = async (messageText) => {
    if (sending) return
    
    // Check if user is logged in
    if (!user || !user.uid) {
      setErrorMessage({
        title: 'Sign In Required',
        message: 'Please sign in to use the chatbot.',
        action: 'Redirecting to sign in page...'
      })
      setTimeout(() => navigate('/auth'), 1500)
      return
    }
    
    // Use the message text directly
    const message = messageText.trim()
    setInput('')
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      if (isNewChat) {
        // Create new chat with first message
        const title = message.slice(0, 50) + (message.length > 50 ? '...' : '')
        const firstMessage = {
          sender: 'user',
          text: message
        }
        
        const newChatId = await createNewChat(user.uid, title, firstMessage)
        
        // Navigate to the new chat
        navigate(`/chat/${newChatId}`, { replace: true })
        setIsNewChat(false)
        
        // Send to chatbot and get response
        await sendMessage(newChatId, user.uid, message)
        setSuccessMessage('Question sent! Getting response...')
      } else {
        // Add to existing chat
        await sendMessage(currentChat, user.uid, message)
        setSuccessMessage('Question sent! Getting response...')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorInfo = getErrorMessage(error)
      setErrorMessage(errorInfo)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return format(date, 'HH:mm')
    } catch {
      return ''
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target flex-shrink-0"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 min-w-0">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
              <span className="text-lg sm:text-xl font-bold text-blue-600 truncate">Kilmalaria</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 flex-shrink-0">
            <Bot className="h-4 w-4" />
            <span>AI Assistant</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {isNewChat && messages.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Bot className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Start a Conversation
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                Ask me about malaria predictions, statistics, or information
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto px-2">
                <button
                  onClick={() => handleSuggestionClick('Predict malaria in Nairobi for 6 months')}
                  className="card text-left hover:shadow-md transition-shadow"
                  disabled={sending}
                >
                  <p className="font-medium text-gray-900">📊 Get Predictions</p>
                  <p className="text-sm text-gray-600">Predict malaria in Nairobi for 6 months</p>
                </button>
                
                <button
                  onClick={() => handleSuggestionClick('List all counties')}
                  className="card text-left hover:shadow-md transition-shadow"
                  disabled={sending}
                >
                  <p className="font-medium text-gray-900">🗺️ View Counties</p>
                  <p className="text-sm text-gray-600">List all available counties</p>
                </button>
                
                <button
                  onClick={() => handleSuggestionClick('What are malaria symptoms?')}
                  className="card text-left hover:shadow-md transition-shadow"
                  disabled={sending}
                >
                  <p className="font-medium text-gray-900">🏥 Learn About Malaria</p>
                  <p className="text-sm text-gray-600">What are malaria symptoms?</p>
                </button>
                
                <button
                  onClick={() => handleSuggestionClick('Show me Kisumu statistics')}
                  className="card text-left hover:shadow-md transition-shadow"
                  disabled={sending}
                >
                  <p className="font-medium text-gray-900">📈 County Stats</p>
                  <p className="text-sm text-gray-600">Show me Kisumu statistics</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
                  <p className="text-gray-500 mb-4">Start the conversation by sending a message!</p>
                  <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto text-left">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">💡 Tip:</span> Try asking about predictions, 
                        county statistics, or malaria information. I'm here to help!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id || index} 
                    message={message} 
                    formatTime={formatTime}
                  />
                ))
              )}

              {/* Sending indicator */}
              {sending && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white shadow-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
          
          {/* Error Display */}
          {(error || errorMessage) && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mx-4 mb-4 shadow-md animate-in slide-in-from-top-2">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-900 font-semibold mb-1">
                    {errorMessage?.title || 'Error'}
                  </h3>
                  <p className="text-red-800 text-sm mb-2">
                    {errorMessage?.message || error}
                  </p>
                  {errorMessage?.action && (
                    <p className="text-red-700 text-xs bg-red-100 rounded px-2 py-1 inline-block">
                      {errorMessage.action}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setErrorMessage(null)
                    useChatStore.getState().clearError?.()
                  }}
                  className="text-red-600 hover:text-red-800 ml-2"
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mx-4 mb-4 shadow-md animate-in slide-in-from-top-2">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <p className="text-green-800 font-medium flex-1">{successMessage}</p>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-600 hover:text-green-800 ml-2"
                  aria-label="Dismiss success message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area - fixed at bottom with proper mobile sizing */}
      <div className="bg-white border-t shadow-lg sticky bottom-0 z-30">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex gap-2 sm:gap-3 items-stretch">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 input-field"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="px-4 sm:px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[56px] sm:min-w-[80px] min-h-[48px] flex-shrink-0"
            >
              {sending ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5 sm:mr-1" />
                  <span className="hidden sm:inline ml-1">Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center px-2">
            Ask about malaria predictions, statistics, symptoms, or prevention
          </p>
        </div>
      </div>
    </div>
  )
}

