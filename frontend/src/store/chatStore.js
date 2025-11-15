import { create } from 'zustand'
import { firestoreService } from '../services/firebase'
import rasaService from '../services/rasaService'

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  sending: false,
  error: null,

  // Load user's chats from Firestore
  loadChats: async (userId) => {
    set({ loading: true, error: null })
    try {
      const chats = await firestoreService.getUserChats(userId)
      set({ chats, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Load messages for a specific chat
  loadMessages: async (chatId) => {
    set({ loading: true, error: null })
    try {
      // Try to load from Firestore
      try {
        const messages = await firestoreService.getChatMessages(chatId)
        set({ messages, currentChat: chatId, loading: false })
      } catch (firestoreError) {
        console.warn('Failed to load messages from Firestore:', firestoreError)
        // If it's a local chat ID, just set empty messages
        if (chatId.startsWith('local-')) {
          set({ messages: [], currentChat: chatId, loading: false })
        } else {
          // For real chat IDs, try to continue with empty messages
          set({ messages: [], currentChat: chatId, loading: false })
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      set({ error: error.message, loading: false, messages: [] })
    }
  },

  // Create new chat
  createNewChat: async (userId, title, firstMessage) => {
    set({ loading: true, error: null })
    try {
      // Try to create chat in Firestore
      let chatId
      try {
        chatId = await firestoreService.createChat(userId, title, firstMessage)
        console.log('Chat created in Firestore:', chatId)
      } catch (firestoreError) {
        console.warn('Failed to create chat in Firestore, using local ID:', firestoreError)
        // Generate a local chat ID if Firestore fails
        chatId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      
      // Try to reload chats (but don't fail if it doesn't work)
      try {
        const chats = await firestoreService.getUserChats(userId)
        set({ chats, currentChat: chatId, loading: false })
      } catch (firestoreError) {
        console.warn('Failed to reload chats from Firestore:', firestoreError)
        // Continue with just setting the current chat
        set({ currentChat: chatId, loading: false })
      }
      
      return chatId
    } catch (error) {
      console.error('Error creating new chat:', error)
      set({ error: error.message, loading: false })
      // Still return a local chat ID so the user can continue
      const localChatId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      set({ currentChat: localChatId, loading: false })
      return localChatId
    }
  },

  // Send message
  sendMessage: async (chatId, userId, messageText) => {
    set({ sending: true, error: null })
    
    try {
      // Add user message to local state first (for immediate UI update)
      const userMessage = {
        sender: 'user',
        text: messageText,
        id: Date.now()
      }
      
      const currentMessages = get().messages
      set({ messages: [...currentMessages, userMessage] })
      
      // Try to save to Firestore (but don't fail if it doesn't work)
      try {
        await firestoreService.addMessage(chatId, {
          sender: 'user',
          text: messageText
        })
      } catch (firestoreError) {
        console.warn('Failed to save user message to Firestore:', firestoreError)
        // Continue anyway - message is already in local state
      }
      
      // Send to chatbot and get response
      console.log('Sending message to chatbot:', messageText)
      const botResponses = await rasaService.sendMessage(messageText, userId)
      console.log('Bot responses received:', botResponses)
      
      const botText = rasaService.formatResponses(botResponses)
      console.log('Formatted bot text:', botText.substring(0, 100))
      
      // Add bot response to local state
      const botMessage = {
        sender: 'bot',
        text: botText,
        id: Date.now() + 1
      }
      
      const updatedMessages = get().messages
      set({ 
        messages: [...updatedMessages, botMessage],
        sending: false 
      })
      
      // Try to save bot response to Firestore (but don't fail if it doesn't work)
      try {
        await firestoreService.addMessage(chatId, {
          sender: 'bot',
          text: botText
        })
      } catch (firestoreError) {
        console.warn('Failed to save bot message to Firestore:', firestoreError)
        // Continue anyway - message is already in local state
      }
      
    } catch (error) {
      console.error('Error in sendMessage:', error)
      set({ error: error.message, sending: false })
      
      // Add error message to chat
      const errorMessage = {
        sender: 'bot',
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        id: Date.now()
      }
      
      const currentMessages = get().messages
      set({ messages: [...currentMessages, errorMessage] })
    }
  },

  // Delete chat
  deleteChat: async (chatId, userId) => {
    set({ loading: true, error: null })
    try {
      await firestoreService.deleteChat(chatId)
      
      // Reload chats
      const chats = await firestoreService.getUserChats(userId)
      set({ 
        chats, 
        currentChat: null, 
        messages: [], 
        loading: false 
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Clear current chat
  clearCurrentChat: () => {
    set({ currentChat: null, messages: [] })
  },

  clearError: () => set({ error: null })
}))

