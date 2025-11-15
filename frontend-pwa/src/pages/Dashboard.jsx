import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import NetworkStatus from '../components/NetworkStatus'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Network Status Banner */}
      <NetworkStatus />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❄️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Refrigeración Pro</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user?.nombre}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Nuevo Relevamiento */}
          <div className="card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Nuevo Relevamiento</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Crear un nuevo relevamiento técnico en campo
            </p>
            <Button fullWidth variant="outline">
              Crear Relevamiento
            </Button>
          </div>

          {/* Mis Relevamientos */}
          <div className="card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Mis Relevamientos</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ver todos los relevamientos realizados
            </p>
            <Button fullWidth variant="outline">
              Ver Relevamientos
            </Button>
          </div>

          {/* Presupuestos */}
          <div className="card cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Presupuestos</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Gestionar presupuestos de trabajos
            </p>
            <Button fullWidth variant="outline">
              Ver Presupuestos
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">Relevamientos</h4>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs opacity-75 mt-2">Total realizados</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">Presupuestos</h4>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs opacity-75 mt-2">Total generados</p>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">Pendientes</h4>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs opacity-75 mt-2">Por sincronizar</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No hay actividad reciente</p>
            <p className="text-xs mt-2">Los relevamientos y trabajos aparecerán aquí</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
