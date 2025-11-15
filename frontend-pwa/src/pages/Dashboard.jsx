import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../db/database'
import { useSyncStatus } from '../hooks/useSyncStatus'
import Button from '../components/Button'
import NetworkStatus from '../components/NetworkStatus'
import SyncIndicator from '../components/SyncIndicator'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { pendingCount } = useSyncStatus()

  // Obtener estadísticas en tiempo real de IndexedDB
  const totalRelevamientos = useLiveQuery(
    async () => await db.relevamientos.count()
  )

  const totalPresupuestos = useLiveQuery(
    async () => await db.presupuestos.count()
  )

  // Relevamientos recientes
  const recentRelevamientos = useLiveQuery(
    async () => await db.relevamientos.orderBy('created_at').reverse().limit(5).toArray()
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const TIPOS_TRABAJO = {
    instalacion: 'Instalación',
    mantenimiento: 'Mantenimiento',
    reparacion: 'Reparación'
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
        {/* Sync Indicator */}
        {pendingCount && pendingCount.total > 0 && (
          <div className="mb-6">
            <SyncIndicator />
          </div>
        )}

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
            <Button fullWidth variant="outline" onClick={() => navigate('/relevamientos/nuevo')}>
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
            <Button fullWidth variant="outline" onClick={() => navigate('/relevamientos')}>
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
            <Button fullWidth variant="outline" disabled>
              Próximamente
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">Relevamientos</h4>
            <p className="text-3xl font-bold">{totalRelevamientos || 0}</p>
            <p className="text-xs opacity-75 mt-2">Total realizados</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">Presupuestos</h4>
            <p className="text-3xl font-bold">{totalPresupuestos || 0}</p>
            <p className="text-xs opacity-75 mt-2">Total generados</p>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <h4 className="text-sm font-medium opacity-90 mb-2">Pendientes</h4>
            <p className="text-3xl font-bold">{pendingCount?.total || 0}</p>
            <p className="text-xs opacity-75 mt-2">Por sincronizar</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
          {!recentRelevamientos || recentRelevamientos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No hay actividad reciente</p>
              <p className="text-xs mt-2">Los relevamientos y trabajos aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRelevamientos.map((rel) => (
                <div
                  key={rel.localId}
                  onClick={() => navigate(`/relevamientos/${rel.localId}`)}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{rel.cliente_nombre}</p>
                      <p className="text-sm text-gray-600">
                        {TIPOS_TRABAJO[rel.tipo_trabajo]} • {rel.cliente_direccion}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-500">{formatDate(rel.created_at)}</p>
                      {rel.is_synced === 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                          Sin sincronizar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
