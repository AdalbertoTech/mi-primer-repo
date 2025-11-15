/**
 * Obtiene la ubicación actual del usuario
 * @returns {Promise<{latitude: number, longitude: number}>} Coordenadas
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La geolocalización no está soportada en este navegador'))
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        let errorMessage = 'Error al obtener ubicación'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado'
            break
        }

        reject(new Error(errorMessage))
      },
      options
    )
  })
}

/**
 * Formatea las coordenadas para mostrar
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @returns {string} Coordenadas formateadas
 */
export const formatCoordinates = (lat, lng) => {
  if (!lat || !lng) return 'Sin ubicación'

  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

/**
 * Genera un enlace de Google Maps
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @returns {string} URL de Google Maps
 */
export const getGoogleMapsLink = (lat, lng) => {
  if (!lat || !lng) return null

  return `https://www.google.com/maps?q=${lat},${lng}`
}
