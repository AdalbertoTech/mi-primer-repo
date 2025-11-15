import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { rateLimit } from 'express-rate-limit'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middlewares de seguridad
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde'
})
app.use('/api/', limiter)

// Middlewares generales
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rutas API - Por implementar en fases posteriores
app.get('/api', (req, res) => {
  res.json({
    message: 'Refrigeración Pro API v1.0',
    endpoints: {
      auth: '/api/auth',
      relevamientos: '/api/relevamientos',
      presupuestos: '/api/presupuestos',
      reportes: '/api/reportes'
    }
  })
})

// Importar rutas
import authRoutes from './routes/auth.routes.js'
// TODO: Implementar en siguientes fases
// import relevamientosRoutes from './routes/relevamientos.routes.js'
// import presupuestosRoutes from './routes/presupuestos.routes.js'
// import reportesRoutes from './routes/reportes.routes.js'

// Rutas
app.use('/api/auth', authRoutes)
// app.use('/api/relevamientos', relevamientosRoutes)
// app.use('/api/presupuestos', presupuestosRoutes)
// app.use('/api/reportes', reportesRoutes)

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' })
})

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
