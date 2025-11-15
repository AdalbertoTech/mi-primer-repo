import prisma from '../utils/prisma.js'
import { relevamientoSchema } from '../utils/validations.js'

// Obtener todos los relevamientos del técnico autenticado
export const getRelevamientos = async (req, res) => {
  try {
    const { page = 1, limit = 20, estado } = req.query
    const skip = (page - 1) * limit

    const where = {
      tecnicoId: req.user.id,
      isLatest: true // Solo mostrar última versión
    }

    // Filtrar por estado si se proporciona
    if (estado) {
      where.estado = estado
    }

    const [relevamientos, total] = await Promise.all([
      prisma.relevamiento.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          version: true,
          clienteNombre: true,
          clienteTelefono: true,
          clienteDireccion: true,
          tipoTrabajo: true,
          estado: true,
          notas: true,
          fotosUrls: true,
          latitud: true,
          longitud: true,
          createdAt: true,
          updatedAt: true,
          syncedAt: true
        }
      }),
      prisma.relevamiento.count({ where })
    ])

    res.json({
      data: relevamientos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error obteniendo relevamientos:', error)
    res.status(500).json({ error: 'Error al obtener relevamientos' })
  }
}

// Obtener un relevamiento por ID
export const getRelevamientoById = async (req, res) => {
  try {
    const { id } = req.params

    const relevamiento = await prisma.relevamiento.findFirst({
      where: {
        id: parseInt(id),
        tecnicoId: req.user.id,
        isLatest: true
      },
      include: {
        presupuestos: {
          where: { isLatest: true },
          orderBy: { createdAt: 'desc' }
        },
        reportes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!relevamiento) {
      return res.status(404).json({ error: 'Relevamiento no encontrado' })
    }

    res.json({ data: relevamiento })
  } catch (error) {
    console.error('Error obteniendo relevamiento:', error)
    res.status(500).json({ error: 'Error al obtener relevamiento' })
  }
}

// Crear nuevo relevamiento
export const createRelevamiento = async (req, res) => {
  try {
    // Validar datos
    const validatedData = relevamientoSchema.parse(req.body)

    // Crear relevamiento
    const relevamiento = await prisma.relevamiento.create({
      data: {
        tecnicoId: req.user.id,
        clienteNombre: validatedData.clienteNombre,
        clienteTelefono: validatedData.clienteTelefono,
        clienteDireccion: validatedData.clienteDireccion,
        latitud: validatedData.latitud || null,
        longitud: validatedData.longitud || null,
        tipoTrabajo: validatedData.tipoTrabajo,
        notas: validatedData.notas || null,
        fotosUrls: validatedData.fotosUrls || [],
        estado: 'borrador',
        version: 1,
        isLatest: true,
        syncedAt: new Date()
      }
    })

    res.status(201).json({
      message: 'Relevamiento creado exitosamente',
      data: relevamiento
    })
  } catch (error) {
    console.error('Error creando relevamiento:', error)

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.errors
      })
    }

    res.status(500).json({ error: 'Error al crear relevamiento' })
  }
}

// Actualizar relevamiento (crea nueva versión)
export const updateRelevamiento = async (req, res) => {
  try {
    const { id } = req.params
    const validatedData = relevamientoSchema.parse(req.body)

    // Verificar que el relevamiento existe y pertenece al técnico
    const existingRelevamiento = await prisma.relevamiento.findFirst({
      where: {
        id: parseInt(id),
        tecnicoId: req.user.id,
        isLatest: true
      }
    })

    if (!existingRelevamiento) {
      return res.status(404).json({ error: 'Relevamiento no encontrado' })
    }

    // Transacción: marcar versión anterior como no latest y crear nueva versión
    const [_, newRelevamiento] = await prisma.$transaction([
      // Marcar versión anterior como no latest
      prisma.relevamiento.update({
        where: { id: existingRelevamiento.id },
        data: { isLatest: false }
      }),
      // Crear nueva versión
      prisma.relevamiento.create({
        data: {
          tecnicoId: req.user.id,
          version: existingRelevamiento.version + 1,
          clienteNombre: validatedData.clienteNombre,
          clienteTelefono: validatedData.clienteTelefono,
          clienteDireccion: validatedData.clienteDireccion,
          latitud: validatedData.latitud || null,
          longitud: validatedData.longitud || null,
          tipoTrabajo: validatedData.tipoTrabajo,
          notas: validatedData.notas || null,
          fotosUrls: validatedData.fotosUrls || [],
          estado: existingRelevamiento.estado,
          isLatest: true,
          syncedAt: new Date()
        }
      })
    ])

    res.json({
      message: 'Relevamiento actualizado exitosamente',
      data: newRelevamiento
    })
  } catch (error) {
    console.error('Error actualizando relevamiento:', error)

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.errors
      })
    }

    res.status(500).json({ error: 'Error al actualizar relevamiento' })
  }
}

// Actualizar estado del relevamiento
export const updateEstado = async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    const validEstados = ['borrador', 'presupuestado', 'completado']
    if (!validEstados.includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido',
        validEstados
      })
    }

    // Verificar que existe y pertenece al técnico
    const relevamiento = await prisma.relevamiento.findFirst({
      where: {
        id: parseInt(id),
        tecnicoId: req.user.id,
        isLatest: true
      }
    })

    if (!relevamiento) {
      return res.status(404).json({ error: 'Relevamiento no encontrado' })
    }

    // Actualizar estado
    const updated = await prisma.relevamiento.update({
      where: { id: relevamiento.id },
      data: { estado }
    })

    res.json({
      message: 'Estado actualizado exitosamente',
      data: updated
    })
  } catch (error) {
    console.error('Error actualizando estado:', error)
    res.status(500).json({ error: 'Error al actualizar estado' })
  }
}

// Eliminar relevamiento (soft delete - marca como no latest)
export const deleteRelevamiento = async (req, res) => {
  try {
    const { id } = req.params

    const relevamiento = await prisma.relevamiento.findFirst({
      where: {
        id: parseInt(id),
        tecnicoId: req.user.id,
        isLatest: true
      }
    })

    if (!relevamiento) {
      return res.status(404).json({ error: 'Relevamiento no encontrado' })
    }

    // Soft delete: marcar como no latest
    await prisma.relevamiento.update({
      where: { id: relevamiento.id },
      data: { isLatest: false }
    })

    res.json({ message: 'Relevamiento eliminado exitosamente' })
  } catch (error) {
    console.error('Error eliminando relevamiento:', error)
    res.status(500).json({ error: 'Error al eliminar relevamiento' })
  }
}

// Obtener historial de versiones de un relevamiento
export const getVersionHistory = async (req, res) => {
  try {
    const { id } = req.params

    const versions = await prisma.relevamiento.findMany({
      where: {
        id: parseInt(id),
        tecnicoId: req.user.id
      },
      orderBy: { version: 'desc' }
    })

    if (versions.length === 0) {
      return res.status(404).json({ error: 'Relevamiento no encontrado' })
    }

    res.json({ data: versions })
  } catch (error) {
    console.error('Error obteniendo historial:', error)
    res.status(500).json({ error: 'Error al obtener historial' })
  }
}

// Obtener estadísticas del técnico
export const getStats = async (req, res) => {
  try {
    const tecnicoId = req.user.id

    const [total, porEstado, recientes] = await Promise.all([
      // Total de relevamientos
      prisma.relevamiento.count({
        where: { tecnicoId, isLatest: true }
      }),
      // Agrupados por estado
      prisma.relevamiento.groupBy({
        by: ['estado'],
        where: { tecnicoId, isLatest: true },
        _count: true
      }),
      // 5 más recientes
      prisma.relevamiento.findMany({
        where: { tecnicoId, isLatest: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          clienteNombre: true,
          tipoTrabajo: true,
          estado: true,
          createdAt: true
        }
      })
    ])

    res.json({
      total,
      porEstado: porEstado.reduce((acc, item) => {
        acc[item.estado] = item._count
        return acc
      }, {}),
      recientes
    })
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}
