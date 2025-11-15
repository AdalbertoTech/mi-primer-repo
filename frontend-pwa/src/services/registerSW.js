import { registerSW } from 'virtual:pwa-register'

// Registro del Service Worker con auto-actualización
export const setupServiceWorker = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      console.log('Nueva versión disponible, actualizando...')
      // Aquí podrías mostrar un toast/notificación al usuario
      // ofreciendo recargar la app para obtener la nueva versión
    },
    onOfflineReady() {
      console.log('App lista para funcionar offline')
      // Notificar al usuario que la app funciona sin conexión
    },
    immediate: true
  })

  // Retornar función para forzar actualización manual si es necesario
  return updateSW
}

// Detectar estado de conexión
export const setupNetworkDetection = () => {
  const updateOnlineStatus = () => {
    const online = navigator.onLine
    console.log(`Estado de red: ${online ? 'Online' : 'Offline'}`)

    // Disparar evento personalizado para que la app reaccione
    window.dispatchEvent(new CustomEvent('network-status', {
      detail: { online }
    }))
  }

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  // Verificar estado inicial
  updateOnlineStatus()
}
