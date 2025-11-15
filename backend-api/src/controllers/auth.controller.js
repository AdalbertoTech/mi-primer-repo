import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma.js'
import { generateToken } from '../middleware/auth.middleware.js'
import { tecnicoLoginSchema, tecnicoRegisterSchema } from '../utils/validations.js'

// Registro de nuevo técnico
export const register = async (req, res) => {
  try {
    // Validar datos de entrada
    const validatedData = tecnicoRegisterSchema.parse(req.body)
    const { nombre, email, telefono, password } = validatedData

    // Verificar si el email ya existe
    const existingTecnico = await prisma.tecnico.findUnique({
      where: { email }
    })

    if (existingTecnico) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Crear técnico
    const tecnico = await prisma.tecnico.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        passwordHash
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        activo: true,
        createdAt: true
      }
    })

    // Generar token JWT
    const token = generateToken({
      id: tecnico.id,
      email: tecnico.email,
      nombre: tecnico.nombre
    })

    res.status(201).json({
      message: 'Técnico registrado exitosamente',
      user: tecnico,
      token
    })
  } catch (error) {
    console.error('Error en registro:', error)

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.errors
      })
    }

    res.status(500).json({ error: 'Error al registrar técnico' })
  }
}

// Login de técnico
export const login = async (req, res) => {
  try {
    // Validar datos de entrada
    const validatedData = tecnicoLoginSchema.parse(req.body)
    const { email, password } = validatedData

    // Buscar técnico por email
    const tecnico = await prisma.tecnico.findUnique({
      where: { email }
    })

    if (!tecnico) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Verificar si está activo
    if (!tecnico.activo) {
      return res.status(403).json({ error: 'Usuario desactivado' })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, tecnico.passwordHash)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Generar token JWT
    const token = generateToken({
      id: tecnico.id,
      email: tecnico.email,
      nombre: tecnico.nombre
    })

    res.json({
      message: 'Login exitoso',
      user: {
        id: tecnico.id,
        nombre: tecnico.nombre,
        email: tecnico.email,
        telefono: tecnico.telefono,
        activo: tecnico.activo
      },
      token
    })
  } catch (error) {
    console.error('Error en login:', error)

    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.errors
      })
    }

    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

// Obtener datos del técnico autenticado
export const me = async (req, res) => {
  try {
    const tecnico = await prisma.tecnico.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        activo: true,
        createdAt: true
      }
    })

    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico no encontrado' })
    }

    res.json({ user: tecnico })
  } catch (error) {
    console.error('Error obteniendo datos del técnico:', error)
    res.status(500).json({ error: 'Error al obtener datos del usuario' })
  }
}

// Actualizar perfil del técnico
export const updateProfile = async (req, res) => {
  try {
    const { nombre, telefono } = req.body

    const updatedTecnico = await prisma.tecnico.update({
      where: { id: req.user.id },
      data: {
        ...(nombre && { nombre }),
        ...(telefono && { telefono })
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        activo: true
      }
    })

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedTecnico
    })
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    res.status(500).json({ error: 'Error al actualizar perfil' })
  }
}

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
    }

    // Obtener técnico con contraseña
    const tecnico = await prisma.tecnico.findUnique({
      where: { id: req.user.id }
    })

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, tecnico.passwordHash)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' })
    }

    // Hash de la nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Actualizar contraseña
    await prisma.tecnico.update({
      where: { id: req.user.id },
      data: { passwordHash: newPasswordHash }
    })

    res.json({ message: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
}
