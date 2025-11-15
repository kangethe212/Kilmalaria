import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect, lazy, Suspense } from 'react'

// Lazy load pages - only load when clicked!
const LandingPage = lazy(() => import('./pages/LandingPage'))
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const TestChat = lazy(() => import('./pages/TestChat'))
const PredictionsPage = lazy(() => import('./pages/PredictionsPage'))
const CountiesPage = lazy(() => import('./pages/CountiesPage'))
const ClimateDataPage = lazy(() => import('./pages/ClimateDataPage'))
const PreventionPage = lazy(() => import('./pages/PreventionPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const DataUploadPage = lazy(() => import('./pages/DataUploadPage'))
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'))

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-semibold">Loading...</p>
      </div>
    </div>
  )
}

function App() {
  const { user, loading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/test" element={<TestChat />} />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" /> : <AuthPage />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/chat" 
            element={user ? <ChatPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/chat/:chatId" 
            element={user ? <ChatPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/predictions" 
            element={user ? <PredictionsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/counties" 
            element={user ? <CountiesPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/climate" 
            element={user ? <ClimateDataPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/prevention" 
            element={user ? <PreventionPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/analytics" 
            element={user ? <AnalyticsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/upload" 
            element={user ? <DataUploadPage /> : <Navigate to="/auth" />} 
          />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App

