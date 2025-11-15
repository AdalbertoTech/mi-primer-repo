# Guía de Instalación - Refrigeración Pro

Esta guía te ayudará a configurar y ejecutar la aplicación localmente.

## Requisitos Previos

- **Node.js** 20+ ([Descargar](https://nodejs.org/))
- **PostgreSQL** 15+ ([Descargar](https://www.postgresql.org/download/))
- **npm** o **yarn**
- **Git**

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/AdalbertoTech/mi-primer-repo.git
cd mi-primer-repo
```

### 2. Configurar Base de Datos

```bash
# Iniciar PostgreSQL (depende de tu sistema operativo)

# Crear base de datos
psql -U postgres
CREATE DATABASE refrigeracion_db;
\q
```

### 3. Configurar Backend

```bash
cd backend-api

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env

# Editar .env con tus datos:
# DATABASE_URL="postgresql://usuario:password@localhost:5432/refrigeracion_db"
# JWT_SECRET="tu-secret-key-super-segura"
# Etc.
```

#### Ejecutar Migraciones de Prisma

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones para crear las tablas
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para ver la base de datos
npm run prisma:studio
```

#### Iniciar Servidor Backend

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# El servidor estará disponible en http://localhost:4000
```

### 4. Configurar Frontend

Abre una **nueva terminal**:

```bash
cd frontend-pwa

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env

# El archivo .env debería tener:
# VITE_API_URL=http://localhost:4000/api
```

#### Iniciar Aplicación Frontend

```bash
# Modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## Verificación

1. Abre tu navegador en `http://localhost:3000`
2. Deberías ver la página de login
3. Haz clic en "Regístrate aquí"
4. Crea una cuenta de técnico
5. Inicia sesión
6. Prueba crear un relevamiento

## Probar Modo Offline

1. Abre DevTools en Chrome/Firefox (F12)
2. Ve a la pestaña "Network" o "Red"
3. Cambia a "Offline" en el dropdown de throttling
4. Intenta crear un relevamiento
5. Debería guardarse localmente en IndexedDB
6. Vuelve a "Online"
7. El relevamiento debería sincronizarse automáticamente

## Estructura de URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **API Docs**: http://localhost:4000/api

## Scripts Disponibles

### Backend (`backend-api/`)

```bash
npm run dev              # Iniciar en modo desarrollo
npm start                # Iniciar en producción
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio (GUI)
npm run prisma:generate  # Generar cliente Prisma
```

### Frontend (`frontend-pwa/`)

```bash
npm run dev       # Iniciar en modo desarrollo
npm run build     # Build para producción
npm run preview   # Preview del build
```

## Solución de Problemas

### Error: "Port 4000 already in use"

```bash
# Linux/Mac
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Error: "Cannot connect to PostgreSQL"

- Verifica que PostgreSQL esté corriendo
- Verifica el `DATABASE_URL` en `.env`
- Verifica que la base de datos exista

### Error: "Module not found"

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### La app no funciona offline

- Verifica que el Service Worker esté registrado (DevTools > Application > Service Workers)
- Limpia caché y recarga la página
- Asegúrate de estar en modo desarrollo con `npm run dev`

## Datos de Prueba

Si quieres datos de prueba, puedes usar Prisma Studio:

```bash
cd backend-api
npm run prisma:studio
```

Esto abrirá una interfaz web donde puedes agregar/editar datos manualmente.

## Próximos Pasos

Una vez que tengas todo funcionando:

1. Explora el Dashboard
2. Crea un relevamiento de prueba con fotos
3. Prueba el modo offline
4. Revisa la sincronización automática
5. Explora IndexedDB en DevTools (Application > Storage > IndexedDB)

## Soporte

Si tienes problemas:
- Revisa los logs en la consola del navegador
- Revisa los logs del servidor backend
- Crea un issue en GitHub con los detalles

¡Listo para empezar a usar Refrigeración Pro! 🛠️❄️
