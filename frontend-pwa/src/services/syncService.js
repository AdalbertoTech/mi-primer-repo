import db, { dbHelpers } from '../db/database'
import { relevamientosAPI, presupuestosAPI, reportesAPI } from './api'

// Servicio de sincronización en background
class SyncService {
  constructor() {
    this.isSyncing = false
    this.syncListeners = []
  }

  // Agregar listener para eventos de sincronización
  addSyncListener(callback) {
    this.syncListeners.push(callback)
  }

  // Notificar a listeners
  notifyListeners(event) {
    this.syncListeners.forEach(callback => callback(event))
  }

  // Sincronizar todos los datos pendientes
  async syncAll() {
    if (this.isSyncing) {
      console.log('Sincronización ya en progreso...')
      return
    }

    if (!navigator.onLine) {
      console.log('Sin conexión, sincronización pospuesta')
      return
    }

    this.isSyncing = true
    this.notifyListeners({ type: 'sync-start' })

    try {
      const pending = await dbHelpers.getPendingSync()
      console.log('Items pendientes de sincronización:', pending.total)

      // Sincronizar relevamientos
      for (const relev of pending.relevamientos) {
        await this.syncRelevamiento(relev)
      }

      // Sincronizar presupuestos
      for (const pres of pending.presupuestos) {
        await this.syncPresupuesto(pres)
      }

      // Sincronizar reportes
      for (const rep of pending.reportes) {
        await this.syncReporte(rep)
      }

      this.notifyListeners({ type: 'sync-complete', count: pending.total })
    } catch (error) {
      console.error('Error en sincronización:', error)
      this.notifyListeners({ type: 'sync-error', error })
    } finally {
      this.isSyncing = false
    }
  }

  // Sincronizar un relevamiento específico
  async syncRelevamiento(relev) {
    try {
      // Mapear campos de snake_case a camelCase para el backend
      const relevamientoData = {
        clienteNombre: relev.cliente_nombre,
        clienteTelefono: relev.cliente_telefono,
        clienteDireccion: relev.cliente_direccion,
        tipoTrabajo: relev.tipo_trabajo,
        notas: relev.notas,
        latitud: relev.latitud ? parseFloat(relev.latitud) : undefined,
        longitud: relev.longitud ? parseFloat(relev.longitud) : undefined,
        fotosUrls: relev.fotos_urls || []
      }

      if (relev.id) {
        // Actualizar existente
        await relevamientosAPI.update(relev.id, relevamientoData)
        await db.relevamientos.update(relev.localId, { is_synced: 1 })
      } else {
        // Crear nuevo
        const response = await relevamientosAPI.create(relevamientoData)
        await dbHelpers.markAsSynced('relevamientos', relev.localId, response.data.data.id)
      }

      console.log('✓ Relevamiento sincronizado:', relev.cliente_nombre)
    } catch (error) {
      console.error('Error sincronizando relevamiento:', error)
      // No lanzar error para que continúe con los demás
    }
  }

  // Sincronizar un presupuesto específico
  async syncPresupuesto(pres) {
    try {
      if (pres.id) {
        await presupuestosAPI.update(pres.id, pres)
      } else {
        const response = await presupuestosAPI.create(pres)
        await dbHelpers.markAsSynced('presupuestos', pres.localId, response.data.id)
      }
    } catch (error) {
      console.error('Error sincronizando presupuesto:', error)
      throw error
    }
  }

  // Sincronizar un reporte específico
  async syncReporte(rep) {
    try {
      const response = await reportesAPI.create(rep)
      await dbHelpers.markAsSynced('reportes', rep.localId, response.data.id)
    } catch (error) {
      console.error('Error sincronizando reporte:', error)
      throw error
    }
  }

  // Configurar sincronización automática cuando hay conexión
  setupAutoSync() {
    window.addEventListener('online', () => {
      console.log('Conexión restaurada, iniciando sincronización...')
      setTimeout(() => this.syncAll(), 1000)
    })

    // Sincronizar periódicamente si hay conexión
    setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.syncAll()
      }
    }, 5 * 60 * 1000) // cada 5 minutos
  }
}

// Exportar instancia singleton
export const syncService = new SyncService()
export default syncService
