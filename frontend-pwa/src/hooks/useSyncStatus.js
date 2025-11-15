import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../db/database'
import syncService from '../services/syncService'

/**
 * Hook para obtener el estado de sincronización
 * @returns {Object} Estado de sincronización
 */
export const useSyncStatus = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [syncError, setSyncError] = useState(null)

  // Contar items pendientes de sincronización
  const pendingCount = useLiveQuery(async () => {
    const relevamientos = await db.relevamientos.where('is_synced').equals(0).count()
    const presupuestos = await db.presupuestos.where('is_synced').equals(0).count()
    const reportes = await db.reportes.where('is_synced').equals(0).count()

    return {
      relevamientos,
      presupuestos,
      reportes,
      total: relevamientos + presupuestos + reportes
    }
  })

  useEffect(() => {
    // Listener para eventos de sincronización
    const handleSyncEvent = (event) => {
      switch (event.type) {
        case 'sync-start':
          setIsSyncing(true)
          setSyncError(null)
          break
        case 'sync-complete':
          setIsSyncing(false)
          setLastSync(new Date())
          break
        case 'sync-error':
          setIsSyncing(false)
          setSyncError(event.error)
          break
      }
    }

    syncService.addSyncListener(handleSyncEvent)

    // No hay forma de remover listeners en la implementación actual
    // pero esto no es crítico ya que el hook se usa pocas veces
  }, [])

  const triggerSync = async () => {
    await syncService.syncAll()
  }

  return {
    isSyncing,
    lastSync,
    syncError,
    pendingCount,
    triggerSync
  }
}

export default useSyncStatus
