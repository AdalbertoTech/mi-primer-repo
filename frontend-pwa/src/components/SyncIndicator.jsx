import { useSyncStatus } from '../hooks/useSyncStatus'
import Button from './Button'

const SyncIndicator = ({ compact = false }) => {
  const { isSyncing, pendingCount, lastSync, triggerSync } = useSyncStatus()

  if (!pendingCount || pendingCount.total === 0) {
    if (compact) return null

    return (
      <div className="text-sm text-gray-600 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Todo sincronizado
      </div>
    )
  }

  if (compact) {
    return (
      <button
        onClick={triggerSync}
        disabled={isSyncing || !navigator.onLine}
        className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
      >
        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
        {pendingCount.total} sin sincronizar
      </button>
    )
  }

  return (
    <div className="card bg-orange-50 border border-orange-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-orange-800 mb-1">
            {isSyncing ? 'Sincronizando...' : 'Pendientes de sincronización'}
          </h4>
          <div className="text-sm text-orange-700">
            {pendingCount.relevamientos > 0 && (
              <p>📋 {pendingCount.relevamientos} relevamiento(s)</p>
            )}
            {pendingCount.presupuestos > 0 && (
              <p>💰 {pendingCount.presupuestos} presupuesto(s)</p>
            )}
            {pendingCount.reportes > 0 && (
              <p>📄 {pendingCount.reportes} reporte(s)</p>
            )}
          </div>
          {lastSync && (
            <p className="text-xs text-gray-500 mt-2">
              Última sincronización: {lastSync.toLocaleTimeString()}
            </p>
          )}
        </div>

        {!navigator.onLine ? (
          <div className="text-sm text-gray-500">
            Sin conexión
          </div>
        ) : (
          <Button
            onClick={triggerSync}
            loading={isSyncing}
            variant="outline"
            disabled={isSyncing}
          >
            Sincronizar ahora
          </Button>
        )}
      </div>
    </div>
  )
}

export default SyncIndicator
