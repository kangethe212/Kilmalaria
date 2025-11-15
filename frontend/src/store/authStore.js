import { create } from 'zustand'
import { authService } from '../services/firebase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  checkAuth: () => {
    authService.onAuthStateChanged((user) => {
      set({ user, loading: false })
    })
  },

  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null })
    try {
      const user = await authService.signUpWithEmail(email, password, displayName)
      set({ user, loading: false })
      return user
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const user = await authService.signInWithEmail(email, password)
      set({ user, loading: false })
      return user
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      const user = await authService.signInWithGoogle()
      set({ user, loading: false })
      return user
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  signInWithMicrosoft: async () => {
    set({ loading: true, error: null })
    try {
      const user = await authService.signInWithMicrosoft()
      set({ user, loading: false })
      return user
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  signOut: async () => {
    set({ loading: true, error: null })
    try {
      await authService.signOut()
      set({ user: null, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  clearError: () => set({ error: null })
}))

