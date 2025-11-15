import { z } from 'zod'

// Validación para registro/login de técnicos
export const tecnicoLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export const tecnicoRegisterSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

// Validación para relevamientos
export const relevamientoSchema = z.object({
  clienteNombre: z.string().min(3, 'El nombre del cliente es requerido'),
  clienteTelefono: z.string().min(7, 'Teléfono inválido'),
  clienteDireccion: z.string().min(5, 'Dirección requerida'),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  tipoTrabajo: z.enum(['instalacion', 'mantenimiento', 'reparacion']),
  notas: z.string().optional(),
  fotosUrls: z.array(z.string().url()).optional()
})

// Validación para items de presupuesto
const presupuestoItemSchema = z.object({
  descripcion: z.string().min(1, 'Descripción requerida'),
  cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
  precioUnitario: z.number().positive('El precio debe ser mayor a 0')
})

export const presupuestoSchema = z.object({
  relevamientoId: z.number().int().positive(),
  items: z.array(presupuestoItemSchema).min(1, 'Debe incluir al menos un item'),
  validezDias: z.number().int().positive().default(30)
})

// Validación para reportes
export const reporteSchema = z.object({
  relevamientoId: z.number().int().positive(),
  presupuestoId: z.number().int().positive().optional(),
  trabajoRealizado: z.string().min(10, 'Descripción del trabajo requerida'),
  materialesUsados: z.array(z.string()).optional(),
  fotosFinalUrls: z.array(z.string().url()).optional(),
  observaciones: z.string().optional(),
  fechaCompletado: z.string().datetime().optional()
})

// Helper para validar datos
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.errors
      })
    }
  }
}
