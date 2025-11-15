import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../db/database'
import Button from '../components/Button'
import NetworkStatus from '../components/NetworkStatus'
import { formatCoordinates } from '../utils/geolocation'

const ESTADOS = {
  borrador: { label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  presupuestado: { label: 'Presupuestado', color: 'bg-blue-100 text-blue-800' },
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800' }
}

const TIPOS_TRABAJO = {
  instalacion: 'Instalación',
  mantenimiento: 'Mantenimiento',
  reparacion: 'Reparación'
}

const Relevamientos = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('todos')

  // Query en vivo de IndexedDB
  const relevamientos = useLiveQuery(async () => {
    if (filter === 'todos') {
      return await db.relevamientos.orderBy('created_at').reverse().toArray()
    } else {
      return await db.relevamientos
        .where('estado')
        .equals(filter)
        .reverse()
        .sortBy('created_at')
    }
  }, [filter])

  // Contar pendientes de sincronización
  const pendingSync = useLiveQuery(async () => {
    return await db.relevamientos.where('is_synced').equals(0).count()
  })

  const handleNewRelevamiento = () => {
    navigate('/relevamientos/nuevo')
  }

  const handleViewRelevamiento = (id) => {
    navigate(`/relevamientos/${id}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NetworkStatus />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                ← Volver
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Mis Relevamientos</h1>
                <p className="text-sm text-gray-600">
                  {relevamientos?.length || 0} relevamientos
                  {pendingSync > 0 && (
                    <span className="ml-2 text-orange-600">
                      ({pendingSync} sin sincronizar)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button onClick={handleNewRelevamiento}>
              + Nuevo
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === 'todos'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {Object.entries(ESTADOS).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Lista de Relevamientos */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {!relevamientos || relevamientos.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No hay relevamientos
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'todos'
                ? 'Comienza creando tu primer relevamiento'
                : `No hay relevamientos en estado "${ESTADOS[filter]?.label}"`}
            </p>
            {filter === 'todos' && (
              <Button onClick={handleNewRelevamiento}>
                Crear Relevamiento
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {relevamientos.map((rel) => (
              <div
                key={rel.localId}
                onClick={() => handleViewRelevamiento(rel.localId)}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          ESTADOS[rel.estado]?.color
                        }`}
                      >
                        {ESTADOS[rel.estado]?.label}
                      </span>
                      {rel.is_synced === 0 && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          Sin sincronizar
                        </span>
                      )}
                    </div>

                    {/* Cliente */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {rel.clienteNombre}
                    </h3>

                    {/* Detalles */}
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📞 {rel.clienteTelefono}</p>
                      <p>📍 {rel.clienteDireccion}</p>
                      {rel.latitud && rel.longitud && (
                        <p className="text-xs">
                          🗺️ {formatCoordinates(parseFloat(rel.latitud), parseFloat(rel.longitud))}
                        </p>
                      )}
                      <p>🛠️ {TIPOS_TRABAJO[rel.tipoTrabajo]}</p>
                      {rel.fotos_urls && rel.fotos_urls.length > 0 && (
                        <p>📷 {rel.fotos_urls.length} fotos</p>
                      )}
                    </div>

                    {/* Fecha */}
                    <p className="text-xs text-gray-400 mt-2">
                      Creado: {formatDate(rel.created_at)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="ml-4 text-gray-400">
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Relevamientos
