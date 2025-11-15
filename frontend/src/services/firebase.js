import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  applyActionCode,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Auth providers
const googleProvider = new GoogleAuthProvider()
const microsoftProvider = new OAuthProvider('microsoft.com')

// Auth functions
export const authService = {
  // Email/Password sign up
  signUpWithEmail: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update profile with displayName if provided
      if (displayName) {
        await updateProfile(user, { displayName })
      }
      
      // Send email verification
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false
      })
      
      return user
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Email/Password sign in
  signInWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Google sign in
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Microsoft sign in
  signInWithMicrosoft: async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider)
      return result.user
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Auth state observer
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback)
  },

  // Send email verification
  resendEmailVerification: async (user) => {
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false
      })
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Verify email with action code (from email link)
  verifyEmail: async (actionCode) => {
    try {
      await applyActionCode(auth, actionCode)
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Send password reset email
  sendPasswordReset: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/auth`,
        handleCodeInApp: false
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

// Firestore functions
export const firestoreService = {
  // Create new chat
  createChat: async (userId, title, firstMessage) => {
    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        userId,
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Add first message
      await addDoc(collection(db, `chats/${chatRef.id}/messages`), {
        ...firstMessage,
        timestamp: serverTimestamp()
      })

      return chatRef.id
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Get user's chats
  getUserChats: async (userId) => {
    try {
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Get chat messages
  getChatMessages: async (chatId) => {
    try {
      const q = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy('timestamp', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Add message to chat
  addMessage: async (chatId, message) => {
    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        ...message,
        timestamp: serverTimestamp()
      })

      // Update chat's updatedAt
      await updateDoc(doc(db, 'chats', chatId), {
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    try {
      // Delete all messages first
      const messagesSnapshot = await getDocs(collection(db, `chats/${chatId}/messages`))
      const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      // Delete chat
      await deleteDoc(doc(db, 'chats', chatId))
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Submit contact form
  submitContact: async (contactData) => {
    try {
      await addDoc(collection(db, 'contacts'), {
        ...contactData,
        submittedAt: serverTimestamp()
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export { auth, db }

