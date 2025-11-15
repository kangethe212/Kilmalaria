import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/firebase'
import { CheckCircle, XCircle, Mail, Loader } from 'lucide-react'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [error, setError] = useState('')
  const [actionCode, setActionCode] = useState('')

  useEffect(() => {
    const code = searchParams.get('oobCode')
    const mode = searchParams.get('mode')

    if (!code || mode !== 'verifyEmail') {
      setStatus('error')
      setError('Invalid verification link. Please check your email and try again.')
      return
    }

    setActionCode(code)
    verifyEmail(code)
  }, [searchParams])

  const verifyEmail = async (code) => {
    try {
      await authService.verifyEmail(code)
      setStatus('success')
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Failed to verify email. The link may have expired.')
    }
  }

  const handleResendVerification = async () => {
    try {
      const user = authService.auth.currentUser
      if (!user) {
        navigate('/auth')
        return
      }
      await authService.resendEmailVerification(user)
      setStatus('resent')
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {status === 'verifying' && (
            <>
              <Loader className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold mb-2">Verifying Your Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-green-600">Email Verified!</h2>
              <p className="text-gray-600 mb-4">
                Your email has been successfully verified. You'll be redirected to the dashboard shortly.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  className="w-full btn-primary"
                >
                  <Mail className="h-5 w-5 inline mr-2" />
                  Resend Verification Email
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full btn-secondary"
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}

          {status === 'resent' && (
            <>
              <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verification Email Sent</h2>
              <p className="text-gray-600 mb-4">
                We've sent a new verification email. Please check your inbox and click the verification link.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

