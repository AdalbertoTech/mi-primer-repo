import express from 'express'
import {
  getRelevamientos,
  getRelevamientoById,
  createRelevamiento,
  updateRelevamiento,
  updateEstado,
  deleteRelevamiento,
  getVersionHistory,
  getStats
} from '../controllers/relevamientos.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = express.Router()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// Estadísticas del técnico
router.get('/stats', getStats)

// CRUD de relevamientos
router.get('/', getRelevamientos)
router.get('/:id', getRelevamientoById)
router.post('/', createRelevamiento)
router.put('/:id', updateRelevamiento)
router.delete('/:id', deleteRelevamiento)

// Actualizar estado
router.patch('/:id/estado', updateEstado)

// Historial de versiones
router.get('/:id/versions', getVersionHistory)

export default router
