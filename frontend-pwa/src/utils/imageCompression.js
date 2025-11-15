import imageCompression from 'browser-image-compression'

/**
 * Comprime una imagen para reducir su tamaño
 * @param {File} file - Archivo de imagen a comprimir
 * @param {Object} options - Opciones de compresión
 * @returns {Promise<File>} Archivo comprimido
 */
export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 0.5,        // Tamaño máximo 500KB
    maxWidthOrHeight: 1920, // Resolución máxima
    useWebWorker: true,
    fileType: 'image/jpeg'
  }

  try {
    const compressedFile = await imageCompression(file, {
      ...defaultOptions,
      ...options
    })

    console.log(`Imagen comprimida: ${file.size / 1024 / 1024}MB → ${compressedFile.size / 1024 / 1024}MB`)

    return compressedFile
  } catch (error) {
    console.error('Error comprimiendo imagen:', error)
    throw error
  }
}

/**
 * Convierte un archivo a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} String base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Comprime y convierte múltiples imágenes a base64
 * @param {FileList|Array<File>} files - Archivos de imagen
 * @returns {Promise<Array<string>>} Array de strings base64
 */
export const compressAndConvertImages = async (files) => {
  const fileArray = Array.from(files)
  const promises = fileArray.map(async (file) => {
    const compressed = await compressImage(file)
    const base64 = await fileToBase64(compressed)
    return base64
  })

  return Promise.all(promises)
}

/**
 * Valida que el archivo sea una imagen
 * @param {File} file - Archivo a validar
 * @returns {boolean} true si es imagen válida
 */
export const isValidImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Valida tamaño máximo de archivo
 * @param {File} file - Archivo a validar
 * @param {number} maxSizeMB - Tamaño máximo en MB
 * @returns {boolean} true si está dentro del límite
 */
export const isValidSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}
