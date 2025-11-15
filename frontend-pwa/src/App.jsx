import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { setupServiceWorker, setupNetworkDetection } from './services/registerSW'
import syncService from './services/syncService'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    // Registrar Service Worker para PWA
    setupServiceWorker()

    // Setup detección de red (online/offline)
    setupNetworkDetection()

    // Setup sincronización automática si está autenticado
    if (isAuthenticated) {
      syncService.setupAutoSync()
    }
  }, [isAuthenticated])

  return (
    <Router>
      <div className="h-full">
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
            }
          />

          {/* 404 - Redirigir a login o dashboard */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
