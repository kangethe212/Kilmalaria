import { create } from 'zustand'
import { authService } from '../services/firebase'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  checkAuth: () => {
    authService.onAuthStateChanged(async (user) => {
      // Reload user to get latest email verification status
      if (user) {
        try {
          await user.reload()
        } catch (error) {
          console.warn('Failed to reload user:', error)
        }
      }
      set({ user, loading: false })
    })
  },

  reloadUser: async () => {
    const { user } = get()
    if (user) {
      try {
        await user.reload()
        set({ user })
        return user
      } catch (error) {
        console.error('Failed to reload user:', error)
        throw error
      }
    }
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

