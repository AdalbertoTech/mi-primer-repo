import { useState } from 'react'
import { getCurrentLocation, formatCoordinates, getGoogleMapsLink } from '../utils/geolocation'
import Button from './Button'

const LocationPicker = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetLocation = async () => {
    setLoading(true)
    setError('')

    try {
      const location = await getCurrentLocation()
      onChange({
        latitude: location.latitude,
        longitude: location.longitude
      })
    } catch (err) {
      console.error('Error obteniendo ubicación:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClearLocation = () => {
    onChange(null)
    setError('')
  }

  const hasLocation = value?.latitude && value?.longitude

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Ubicación (opcional)
      </label>

      {hasLocation ? (
        <div className="border border-gray-300 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-1">
                📍 {formatCoordinates(value.latitude, value.longitude)}
              </p>
              <a
                href={getGoogleMapsLink(value.latitude, value.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Ver en Google Maps →
              </a>
            </div>
            <button
              type="button"
              onClick={handleClearLocation}
              className="text-red-500 hover:text-red-700 text-sm ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            loading={loading}
            fullWidth
          >
            📍 Obtener Ubicación Actual
          </Button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}

      <p className="text-gray-500 text-xs mt-2">
        La ubicación ayuda a identificar el sitio del trabajo
      </p>
    </div>
  )
}

export default LocationPicker
