import { useState, useEffect } from 'react'

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showBanner, setShowBanner] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(true)
      // Auto-ocultar banner después de 3 segundos
      setTimeout(() => setShowBanner(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showBanner) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-white text-sm font-medium transition-all ${
        isOnline ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {isOnline ? (
        <>✓ Conexión restaurada - Sincronizando datos...</>
      ) : (
        <>⚠ Sin conexión - Modo offline activado</>
      )}
    </div>
  )
}

export default NetworkStatus
