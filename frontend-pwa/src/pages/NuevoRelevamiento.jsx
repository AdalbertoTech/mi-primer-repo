import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import db from '../db/database'
import { useAuthStore } from '../store/authStore'
import syncService from '../services/syncService'
import Input from '../components/Input'
import Select from '../components/Select'
import Textarea from '../components/Textarea'
import Button from '../components/Button'
import PhotoCapture from '../components/PhotoCapture'
import LocationPicker from '../components/LocationPicker'
import Alert from '../components/Alert'
import NetworkStatus from '../components/NetworkStatus'

// Schema de validación
const relevamientoSchema = z.object({
  clienteNombre: z.string().min(3, 'El nombre del cliente es requerido'),
  clienteTelefono: z.string().min(7, 'Teléfono inválido'),
  clienteDireccion: z.string().min(5, 'Dirección requerida'),
  tipoTrabajo: z.enum(['instalacion', 'mantenimiento', 'reparacion'], {
    errorMap: () => ({ message: 'Seleccione un tipo de trabajo' })
  }),
  notas: z.string().optional()
})

const TIPOS_TRABAJO = [
  { value: 'instalacion', label: 'Instalación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'reparacion', label: 'Reparación' }
]

const NuevoRelevamiento = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [photos, setPhotos] = useState([])
  const [location, setLocation] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(relevamientoSchema)
  })

  const onSubmit = async (data) => {
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      // Preparar datos del relevamiento
      const relevamientoData = {
        cliente_nombre: data.clienteNombre,
        cliente_telefono: data.clienteTelefono,
        cliente_direccion: data.clienteDireccion,
        tipo_trabajo: data.tipoTrabajo,
        notas: data.notas || null,
        tecnico_id: user?.id || 1,
        estado: 'borrador',
        latitud: location?.latitude || null,
        longitud: location?.longitude || null,
        fotos_urls: photos.map(p => p.url),
        created_at: new Date().toISOString(),
        is_synced: 0 // Pendiente de sincronización
      }

      // Guardar en IndexedDB
      const localId = await db.relevamientos.add(relevamientoData)

      console.log('Relevamiento guardado localmente:', localId)

      setSuccess('Relevamiento guardado exitosamente')

      // Intentar sincronizar inmediatamente si hay conexión
      if (navigator.onLine) {
        console.log('Intentando sincronizar...')
        setTimeout(() => {
          syncService.syncAll().catch(err => {
            console.error('Error en sincronización automática:', err)
          })
        }, 500)
      }

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate('/relevamientos')
      }, 1500)
    } catch (err) {
      console.error('Error guardando relevamiento:', err)
      setError('Error al guardar el relevamiento')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('¿Descartar cambios?')) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NetworkStatus />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={handleCancel}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Nuevo Relevamiento
            </h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        )}

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="card">
          {/* Sección: Datos del Cliente */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">👤</span>
              Datos del Cliente
            </h2>

            <Input
              label="Nombre del cliente"
              type="text"
              placeholder="Juan Pérez"
              error={errors.clienteNombre?.message}
              required
              {...register('clienteNombre')}
            />

            <Input
              label="Teléfono"
              type="tel"
              placeholder="+54 11 1234-5678"
              error={errors.clienteTelefono?.message}
              required
              {...register('clienteTelefono')}
            />

            <Input
              label="Dirección"
              type="text"
              placeholder="Calle 123, Ciudad"
              error={errors.clienteDireccion?.message}
              required
              {...register('clienteDireccion')}
            />
          </div>

          {/* Sección: Ubicación */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">📍</span>
              Ubicación
            </h2>

            <LocationPicker value={location} onChange={setLocation} />
          </div>

          {/* Sección: Tipo de Trabajo */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">🛠️</span>
              Tipo de Trabajo
            </h2>

            <Select
              label="Tipo de trabajo"
              options={TIPOS_TRABAJO}
              error={errors.tipoTrabajo?.message}
              required
              {...register('tipoTrabajo')}
            />
          </div>

          {/* Sección: Notas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">📝</span>
              Notas y Observaciones
            </h2>

            <Textarea
              label="Notas del relevamiento"
              placeholder="Descripción del trabajo a realizar, observaciones del sitio, etc."
              rows={5}
              error={errors.notas?.message}
              {...register('notas')}
            />
          </div>

          {/* Sección: Fotos */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">📷</span>
              Fotos del Sitio
            </h2>

            <PhotoCapture photos={photos} onChange={setPhotos} maxPhotos={10} />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              fullWidth
            >
              Guardar Relevamiento
            </Button>
          </div>
        </form>

        {/* Info offline */}
        {!navigator.onLine && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>📵 Modo offline - El relevamiento se sincronizará cuando haya conexión</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default NuevoRelevamiento
