import express from 'express'
import { register, login, me, updateProfile, changePassword } from '../controllers/auth.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = express.Router()

// Rutas públicas (no requieren autenticación)
router.post('/register', register)
router.post('/login', login)

// Rutas protegidas (requieren autenticación)
router.get('/me', authenticateToken, me)
router.put('/profile', authenticateToken, updateProfile)
router.put('/change-password', authenticateToken, changePassword)

export default router
