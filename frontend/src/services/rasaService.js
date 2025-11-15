import axios from 'axios'

const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000'

class ChatbotService {
  constructor() {
    this.baseURL = `${ML_SERVICE_URL}/chat`
  }

  /**
   * Send message to AI chatbot
   * @param {string} message - User message
   * @param {string} sender - Unique sender ID
   * @returns {Promise<Array>} - Bot responses
   */
  async sendMessage(message, sender) {
    try {
      console.log('📤 Sending message to chatbot:', message)
      console.log('📤 Endpoint:', this.baseURL)
      
      const response = await axios.post(this.baseURL, {
        message: message,
        sender: sender
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      })

      console.log('✅ Chatbot response received:', {
        status: response.status,
        hasResponse: !!response.data.response,
        responseLength: response.data.response?.length || 0,
        preview: response.data.response?.substring(0, 100) || 'No response'
      })

      // Check if response exists
      if (!response.data || !response.data.response) {
        console.error('❌ Invalid response format:', response.data)
        throw new Error('Invalid response from chatbot service')
      }

      // Format response to match expected format
      const formattedResponse = [{
        text: response.data.response
      }]
      
      console.log('✅ Formatted response:', formattedResponse)
      return formattedResponse
    } catch (error) {
      console.error('❌ Chatbot service error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      })
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - the service took too long to respond')
      } else if (error.response) {
        const errorMsg = error.response.data?.error || `Server error: ${error.response.status}`
        throw new Error(errorMsg)
      } else if (error.request) {
        throw new Error('Cannot connect to chatbot service. Please ensure the ML service is running on port 8000.')
      } else {
        throw new Error(error.message || 'An error occurred while sending the message')
      }
    }
  }

  /**
   * Format bot responses to display
   * @param {Array} responses - Bot responses
   * @returns {string} - Formatted message
   */
  formatResponses(responses) {
    if (!responses || responses.length === 0) {
      return "I'm sorry, I didn't receive a response. Please try again."
    }

    return responses.map(r => r.text).join('\n\n')
  }
}

export default new ChatbotService()

