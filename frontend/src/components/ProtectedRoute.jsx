import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import EmailVerificationRequired from '../pages/EmailVerificationRequired'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Check if email is verified
  if (user.email && !user.emailVerified) {
    return <EmailVerificationRequired />
  }

  return children
}

