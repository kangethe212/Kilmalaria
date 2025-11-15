import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import ChatMessage from '../components/ChatMessage'
import { 
  Activity, 
  Send, 
  ArrowLeft, 
  Loader,
  Bot 
} from 'lucide-react'
import { format } from 'date-fns'

export default function ChatPage() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    messages, 
    currentChat, 
    loadMessages, 
    sendMessage, 
    createNewChat, 
    sending,
    error
  } = useChatStore()
  
  const [input, setInput] = useState('')
  const [isNewChat, setIsNewChat] = useState(!chatId)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (chatId && chatId !== currentChat) {
      loadMessages(chatId).catch(err => {
        console.warn('Failed to load messages from Firestore:', err)
        // Continue anyway - messages will be in local state
      })
      setIsNewChat(false)
    } else if (!chatId) {
      setIsNewChat(true)
    }
  }, [chatId, currentChat, loadMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return
    
    // Check if user is logged in
    if (!user || !user.uid) {
      alert('Please log in to use the chatbot')
      navigate('/auth')
      return
    }

    const messageText = input.trim()
    setInput('')

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
      } else {
        // Add to existing chat
        await sendMessage(currentChat, user.uid, messageText)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Error: ${error.message || 'Failed to send message. Please try again.'}`)
    }
  }
  
  const handleSuggestionClick = async (messageText) => {
    if (sending) return
    
    // Check if user is logged in
    if (!user || !user.uid) {
      alert('Please log in to use the chatbot')
      navigate('/auth')
      return
    }
    
    // Set input and send immediately
    setInput(messageText)
    
    // Use the message text directly instead of relying on state update
    const message = messageText.trim()
    setInput('')

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
      } else {
        // Add to existing chat
        await sendMessage(currentChat, user.uid, message)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Error: ${error.message || 'Failed to send message. Please try again.'}`)
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">Climalaria</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Bot className="h-4 w-4" />
            <span>AI Assistant</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {isNewChat && messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Start a Conversation
              </h2>
              <p className="text-gray-600 mb-6">
                Ask me about malaria predictions, statistics, or information
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
                <div className="text-center py-12 text-gray-500">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No messages yet. Start the conversation!</p>
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
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mx-4 mb-4">
              <p className="text-red-800 font-semibold">⚠️ Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => useChatStore.getState().clearError()}
                className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex space-x-4">
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
              className="btn-primary px-6 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Ask about malaria predictions, statistics, symptoms, or prevention
          </p>
        </div>
      </div>
    </div>
  )
}

