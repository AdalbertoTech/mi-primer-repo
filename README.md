# Refrigeración Pro 🛠️

Progressive Web App (PWA) para técnicos de refrigeración - Sistema completo de relevamientos, presupuestos y reportes de trabajo.

## 📋 Descripción

Aplicación móvil-first con funcionalidad offline para técnicos del sector de refrigeración que realizan instalación y mantenimiento de aires acondicionados. La app permite crear relevamientos en campo, generar presupuestos y reportes finales, incluso sin conexión a internet.

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend PWA:**
- React 18 + Vite
- Tailwind CSS
- Zustand (estado global)
- Dexie.js (IndexedDB - almacenamiento offline)
- React Hook Form + Zod (formularios y validación)
- Workbox (Service Worker)

**Backend API:**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- PDFKit (generación de PDFs)
- Cloudinary (almacenamiento de imágenes)

## 📁 Estructura del Proyecto

```
mi-primer-repo/
├── frontend-pwa/          # Progressive Web App
│   ├── public/            # Assets estáticos
│   └── src/
│       ├── components/    # Componentes React reutilizables
│       ├── pages/         # Vistas principales
│       ├── services/      # API calls y sincronización
│       ├── db/            # IndexedDB config (Dexie)
│       ├── store/         # Estado global (Zustand)
│       └── utils/         # Helpers
│
├── backend-api/           # API REST
│   ├── prisma/            # Schema y migraciones DB
│   └── src/
│       ├── routes/        # Endpoints
│       ├── controllers/   # Lógica de negocio
│       ├── models/        # (Prisma genera los modelos)
│       ├── middleware/    # Auth, validación
│       ├── services/      # PDF, uploads, etc.
│       └── utils/         # Helpers
│
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 20+
- PostgreSQL 15+
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone https://github.com/AdalbertoTech/mi-primer-repo.git
cd mi-primer-repo
```

### 2. Configurar Backend

```bash
cd backend-api

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env y configurar:
# - DATABASE_URL (conexión a PostgreSQL)
# - JWT_SECRET
# - CLOUDINARY credentials (opcional para v1)

# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Iniciar servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

### 3. Configurar Frontend

```bash
cd frontend-pwa

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env y configurar VITE_API_URL
# Por defecto: http://localhost:4000/api

# Iniciar app en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Funcionalidades (v1.0)

### ✅ Módulo de Autenticación
- Login/registro de técnicos
- Autenticación con JWT
- Sesión persistente

### ✅ Módulo de Relevamientos
- Formulario offline de relevamiento
- Datos del cliente (nombre, teléfono, dirección)
- Tipo de trabajo (instalación, mantenimiento, reparación)
- Captura de fotos con compresión automática
- Geolocalización (opcional)
- Almacenamiento en IndexedDB
- Sincronización automática cuando hay conexión

### ✅ Módulo de Presupuestos
- Calculadora de presupuestos con items dinámicos
- Cálculo automático de subtotal, impuestos y total
- Edición con versionado
- Generación de PDF minimalista
- Visualización y descarga

### ✅ Módulo de Reportes
- Formulario de trabajo realizado
- Lista de materiales utilizados
- Fotos del trabajo completado
- Generación de PDF final
- Vinculación con relevamiento y presupuesto

### 🔄 Sincronización Offline
- Almacenamiento local con IndexedDB
- Sincronización automática en background
- Indicador visual de estado de sincronización
- Detección de conexión de red

## 🗄️ Modelo de Datos

### Técnicos
```
id, nombre, email, teléfono, password_hash, activo
```

### Relevamientos (con versionado)
```
id, version, tecnico_id, cliente_*, tipo_trabajo, estado,
notas, fotos_urls[], latitud, longitud, timestamps
```

### Presupuestos (con versionado)
```
id, version, relevamiento_id, items[], subtotal, impuestos,
total, validez_dias, timestamps
```

### Reportes
```
id, relevamiento_id, presupuesto_id, trabajo_realizado,
materiales_usados[], fotos_final[], observaciones,
pdf_url, fecha_completado
```

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev       # Iniciar en modo desarrollo
npm run build     # Build para producción
npm run preview   # Preview del build
```

### Backend
```bash
npm run dev              # Iniciar con hot-reload
npm start                # Iniciar en producción
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio (GUI)
npm run prisma:generate  # Generar cliente Prisma
```

## 🚀 Quick Start

```bash
# Instalar todas las dependencias
npm run install:all

# Configurar base de datos
npm run setup:db

# Ejecutar backend y frontend en paralelo
npm run dev
```

Ver [SETUP.md](./SETUP.md) para instrucciones detalladas.

## 🎯 Roadmap

### Versión 1.0 (Actual) - MVP
- [x] Estructura base del proyecto
- [x] Autenticación de técnicos
- [x] CRUD de relevamientos
- [x] Funcionalidad offline completa
- [x] Captura y compresión de fotos
- [x] Geolocalización
- [x] Sincronización automática offline→online
- [x] Dashboard con estadísticas en tiempo real
- [ ] Generación de presupuestos
- [ ] Generación de reportes finales con PDF

### Versión 2.0 (Futura)
- [ ] Gestión centralizada de clientes (CRM)
- [ ] Control de inventario de repuestos
- [ ] Sistema de roles (admin/técnico)
- [ ] Dashboard con estadísticas
- [ ] Notificaciones push
- [ ] Exportación masiva de datos
- [ ] Multi-idioma

## 🌐 Deployment

### Backend (Railway/Render)
```bash
# Railway
railway login
railway init
railway up

# Render
# Conectar repo en dashboard de Render
# Variables de entorno en Render Dashboard
```

### Frontend (Vercel/Netlify)
```bash
# Vercel
vercel login
vercel --prod

# Netlify
netlify login
netlify deploy --prod
```

### Base de Datos
- Railway PostgreSQL
- Supabase
- Neon.tech
- Cualquier PostgreSQL compatible

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👨‍💻 Autor

**Adalberto** - [AdalbertoTech](https://github.com/AdalbertoTech)

---

## 🆘 Soporte

Para reportar bugs o solicitar features, crear un issue en GitHub.

## 📝 Notas de Desarrollo

- La app está diseñada para funcionar primero offline, luego sincronizar
- Las imágenes se comprimen automáticamente antes de almacenar
- Los PDFs se generan en el servidor para mantener consistencia
- El versionado permite ediciones sin perder historial
- La sincronización es automática pero también se puede forzar manualmente
