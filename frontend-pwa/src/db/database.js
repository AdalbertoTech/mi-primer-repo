import Dexie from 'dexie'

// Configuración de IndexedDB para almacenamiento offline
export const db = new Dexie('RefrigeracionDB')

db.version(1).stores({
  // Técnicos (datos del usuario logueado)
  tecnicos: 'id, email, nombre',

  // Relevamientos - con índice compuesto para búsquedas
  relevamientos: '++localId, id, tecnico_id, estado, created_at, synced_at, is_synced',

  // Presupuestos
  presupuestos: '++localId, id, relevamiento_id, created_at, is_synced',

  // Reportes
  reportes: '++localId, id, relevamiento_id, created_at, is_synced',

  // Cola de sincronización
  syncQueue: '++id, type, data, timestamp, retry_count'
})

// Helpers para operaciones comunes
export const dbHelpers = {
  // Obtener items pendientes de sincronización
  getPendingSync: async () => {
    const relevamientos = await db.relevamientos.where('is_synced').equals(0).toArray()
    const presupuestos = await db.presupuestos.where('is_synced').equals(0).toArray()
    const reportes = await db.reportes.where('is_synced').equals(0).toArray()

    return {
      relevamientos,
      presupuestos,
      reportes,
      total: relevamientos.length + presupuestos.length + reportes.length
    }
  },

  // Marcar como sincronizado
  markAsSynced: async (table, localId, serverId) => {
    await db[table].update(localId, {
      id: serverId,
      is_synced: 1,
      synced_at: new Date().toISOString()
    })
  },

  // Limpiar datos locales (logout)
  clearAllData: async () => {
    await db.tecnicos.clear()
    await db.relevamientos.clear()
    await db.presupuestos.clear()
    await db.reportes.clear()
    await db.syncQueue.clear()
  }
}

export default db
