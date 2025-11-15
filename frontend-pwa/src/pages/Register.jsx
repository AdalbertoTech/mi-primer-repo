import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'

// Schema de validación con Zod
const registerSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(7, 'Teléfono inválido').optional().or(z.literal('')),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

const Register = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError('')

    try {
      // Eliminar confirmPassword antes de enviar
      const { confirmPassword, ...registerData } = data

      const response = await authAPI.register(registerData)
      const { user, token } = response.data

      // Guardar en store de Zustand
      login(user, token)

      // Navegar al dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Error en registro:', err)
      setError(err.response?.data?.error || 'Error al registrar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❄️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Refrigeración Pro</h1>
          <p className="text-gray-600 mt-2">Crear cuenta</p>
        </div>

        {/* Alerta de error */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Juan Pérez"
            error={errors.nombre?.message}
            required
            {...register('nombre')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <Input
            label="Teléfono"
            type="tel"
            placeholder="+54 11 1234-5678"
            error={errors.telefono?.message}
            {...register('telefono')}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            required
            {...register('password')}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            required
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            className="mt-6"
          >
            Crear Cuenta
          </Button>
        </form>

        {/* Enlace a login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Info de versión */}
        <div className="mt-8 text-center text-xs text-gray-400">
          v1.0 - PWA Offline-first
        </div>
      </div>
    </div>
  )
}

export default Register
