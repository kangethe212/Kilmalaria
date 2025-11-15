import { useState, useRef, useEffect } from 'react'
import { Activity, Send, Bot, User, Loader } from 'lucide-react'
import axios from 'axios'

export default function TestChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Hello! I\'m Climalaria AI - Your Malaria Expert!\n\nI can help with:\n\n📊 Malaria Predictions\n🏥 Symptoms & Prevention\n💊 Treatment Information\n🗺️ County Statistics\n\nTry asking: "What are malaria symptoms?" or "Predict malaria in Kisumu"'
    }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return

    const messageText = input.trim()
    setInput('')

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageText
    }
    setMessages(prev => [...prev, userMessage])

    setSending(true)

    try {
      console.log('Sending to backend:', messageText)
      
      // Send to ML service chatbot
      const response = await axios.post('http://localhost:8000/chat', {
        message: messageText,
        sender: 'test-user'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      })

      console.log('Backend response:', response.data)

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.data.response || 'No response received'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Full error:', error)
      console.error('Error response:', error.response)
      
      let errorText = '⚠️ Connection Error\n\n'
      
      if (error.response) {
        errorText += `Server responded with error: ${error.response.status}\n`
        errorText += `Details: ${JSON.stringify(error.response.data)}`
      } else if (error.request) {
        errorText += 'Cannot connect to ML service.\n\n'
        errorText += '✅ Make sure ML service is running:\n'
        errorText += 'cd "C:\\Users\\Malaria final project\\ml-service"\n'
        errorText += 'python app.py\n\n'
        errorText += 'Then refresh this page and try again.'
      } else {
        errorText += `Error: ${error.message}`
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: errorText
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Climalaria AI Test</span>
          </div>
          <div className="text-sm text-green-600 font-semibold">
            ✅ Chatbot Active
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>

                  {/* Message */}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="bg-gray-50 border-t border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">⚡ Quick Actions - Click to Try:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setInput('Predict malaria in Kisumu for 6 months')
                  document.querySelector('input').focus()
                }}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                📊 Get Predictions
              </button>
              <button
                onClick={() => {
                  setInput('What are malaria symptoms?')
                  document.querySelector('input').focus()
                }}
                className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                🌡️ Symptoms
              </button>
              <button
                onClick={() => {
                  setInput('How to prevent malaria?')
                  document.querySelector('input').focus()
                }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                🛡️ Prevention
              </button>
              <button
                onClick={() => {
                  setInput('List all counties')
                  document.querySelector('input').focus()
                }}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                🗺️ Counties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </div>
    </div>
  )
}

