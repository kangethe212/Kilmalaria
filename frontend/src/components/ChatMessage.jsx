import { User, Bot } from 'lucide-react'

// Simple markdown parser - converts bot markdown to JSX
function parseMarkdown(text) {
  if (!text) return null
  
  const lines = text.split('\n')
  const elements = []
  
  lines.forEach((line, index) => {
    if (!line.trim()) {
      elements.push(<br key={`br-${index}`} />)
      return
    }
    
    // Check for bold text **text**
    if (line.includes('**')) {
      const parts = line.split('**')
      const formatted = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={`bold-${index}-${i}`} className="font-bold text-gray-900">{part}</strong> : part
      )
      elements.push(<p key={`line-${index}`} className="mb-2">{formatted}</p>)
      return
    }
    
    // Check for bullet points
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      const text = line.replace(/^[•\-]\s*/, '')
      elements.push(
        <div key={`bullet-${index}`} className="flex items-start mb-1">
          <span className="mr-2">•</span>
          <span>{text}</span>
        </div>
      )
      return
    }
    
    // Regular text
    elements.push(<p key={`line-${index}`} className="mb-2">{line}</p>)
  })
  
  return <div>{elements}</div>
}

export default function ChatMessage({ message, formatTime }) {
  const isUser = message.sender === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-gray-600'}`}>
          {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
        </div>

        {/* Message Bubble */}
        <div className={`px-4 py-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white' : 'bg-white shadow-sm text-gray-800'}`}>
          <div className="leading-relaxed text-sm">
            {isUser ? (
              <div className="text-white">{message.text}</div>
            ) : (
              parseMarkdown(message.text)
            )}
          </div>
          {message.timestamp && (
            <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatTime(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

