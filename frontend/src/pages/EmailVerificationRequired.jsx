import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/firebase'
import { Mail, CheckCircle, Loader, ArrowLeft } from 'lucide-react'

export default function EmailVerificationRequired() {
  const { user, signOut, reloadUser } = useAuthStore()
  const navigate = useNavigate()
  const [resendingEmail, setResendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Reload user to check if email was verified
    const checkVerification = async () => {
      if (user) {
        try {
          await reloadUser()
          // Get updated user from store after reload
          const { user: updatedUser } = useAuthStore.getState()
          setChecking(false)
          // Check verification status after reload
          if (updatedUser && updatedUser.emailVerified) {
            navigate('/dashboard', { replace: true })
          }
        } catch {
          setChecking(false)
        }
      } else {
        navigate('/auth', { replace: true })
      }
    }
    checkVerification()
  }, [user, navigate, reloadUser])

  const handleResendVerification = async () => {
    if (!user) return
    setResendingEmail(true)
    try {
      await authService.resendEmailVerification(user)
      setEmailSent(true)
    } catch (error) {
      alert(`Failed to send verification email: ${error.message}`)
    } finally {
      setResendingEmail(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <Loader className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Checking verification status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <Mail className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Email Verification Required</h2>
          <p className="text-gray-600 mb-4">
            Please verify your email address to access Kilmalaria.
          </p>

          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                We've sent a verification link to your email. Please check your inbox and click the link to verify your account.
              </p>
            </div>
          )}

          {emailSent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">
                  Verification email sent! Please check your inbox.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              disabled={resendingEmail || emailSent}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendingEmail ? (
                <>
                  <Loader className="h-5 w-5 inline mr-2 animate-spin" />
                  Sending...
                </>
              ) : emailSent ? (
                <>
                  <CheckCircle className="h-5 w-5 inline mr-2" />
                  Email Sent!
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 inline mr-2" />
                  Resend Verification Email
                </>
              )}
            </button>

            <button
              onClick={async () => {
                if (user) {
                  try {
                    await user.reload()
                    // Get updated user from store
                    const { user: updatedUser } = useAuthStore.getState()
                    if (updatedUser && updatedUser.emailVerified) {
                      navigate('/dashboard', { replace: true })
                    } else {
                      alert('Email not verified yet. Please check your inbox and click the verification link.')
                    }
                  } catch (error) {
                    alert('Failed to check verification status. Please try again.')
                  }
                }
              }}
              className="w-full btn-secondary"
            >
              <CheckCircle className="h-5 w-5 inline mr-2" />
              I've Verified My Email
            </button>

            <button
              onClick={handleSignOut}
              className="w-full btn-secondary text-gray-600"
            >
              <ArrowLeft className="h-5 w-5 inline mr-2" />
              Sign Out
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

