import { useState } from 'react'
import { compressImage, isValidImage, isValidSize } from '../utils/imageCompression'
import Button from './Button'

const PhotoCapture = ({ photos = [], onChange, maxPhotos = 10 }) => {
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    setError('')

    // Validar número de fotos
    if (photos.length + files.length > maxPhotos) {
      setError(`Máximo ${maxPhotos} fotos permitidas`)
      return
    }

    setIsCompressing(true)

    try {
      const newPhotos = []

      for (const file of files) {
        // Validar tipo de archivo
        if (!isValidImage(file)) {
          setError('Solo se permiten imágenes (JPG, PNG, WebP)')
          continue
        }

        // Validar tamaño (max 10MB antes de comprimir)
        if (!isValidSize(file, 10)) {
          setError('La imagen es demasiado grande (máx. 10MB)')
          continue
        }

        // Comprimir imagen
        const compressed = await compressImage(file)

        // Convertir a base64 para preview y almacenamiento
        const reader = new FileReader()
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(compressed)
        })

        newPhotos.push({
          id: Date.now() + Math.random(),
          url: base64,
          fileName: file.name,
          size: compressed.size
        })
      }

      onChange([...photos, ...newPhotos])
    } catch (err) {
      console.error('Error procesando imágenes:', err)
      setError('Error al procesar las imágenes')
    } finally {
      setIsCompressing(false)
      // Reset input
      e.target.value = ''
    }
  }

  const removePhoto = (photoId) => {
    onChange(photos.filter((p) => p.id !== photoId))
  }

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Fotos del sitio
        <span className="text-gray-500 text-xs ml-2">
          ({photos.length}/{maxPhotos})
        </span>
      </label>

      {/* Grid de fotos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={photo.fileName}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                {(photo.size / 1024).toFixed(0)}KB
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input de archivo */}
      {photos.length < maxPhotos && (
        <div className="flex gap-2">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isCompressing}
              className="hidden"
            />
            <div className="btn-primary cursor-pointer text-center">
              {isCompressing ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Comprimiendo...
                </div>
              ) : (
                <>📷 Agregar Fotos</>
              )}
            </div>
          </label>

          {/* Botón de cámara (solo en dispositivos móviles) */}
          <label className="md:hidden">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={isCompressing}
              className="hidden"
            />
            <div className="btn-secondary cursor-pointer px-4 py-2 whitespace-nowrap">
              📸 Cámara
            </div>
          </label>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}

      {/* Info */}
      <p className="text-gray-500 text-xs mt-2">
        Las imágenes se comprimen automáticamente para ahorrar espacio
      </p>
    </div>
  )
}

export default PhotoCapture
