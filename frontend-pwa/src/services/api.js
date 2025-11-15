import axios from 'axios'

// Configuración base de API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me')
}

export const relevamientosAPI = {
  getAll: (params) => api.get('/relevamientos', { params }),
  getById: (id) => api.get(`/relevamientos/${id}`),
  create: (data) => api.post('/relevamientos', data),
  update: (id, data) => api.put(`/relevamientos/${id}`, data),
  delete: (id) => api.delete(`/relevamientos/${id}`),
  updateEstado: (id, estado) => api.patch(`/relevamientos/${id}/estado`, { estado }),
  getStats: () => api.get('/relevamientos/stats'),
  getVersionHistory: (id) => api.get(`/relevamientos/${id}/versions`)
}

export const presupuestosAPI = {
  getByRelevamiento: (relevamientoId) => api.get(`/presupuestos/relevamiento/${relevamientoId}`),
  create: (data) => api.post('/presupuestos', data),
  update: (id, data) => api.put(`/presupuestos/${id}`, data),
  generatePDF: (id) => api.get(`/presupuestos/${id}/pdf`, { responseType: 'blob' })
}

export const reportesAPI = {
  create: (data) => api.post('/reportes', data),
  generatePDF: (id) => api.get(`/reportes/${id}/pdf`, { responseType: 'blob' })
}

export default api
