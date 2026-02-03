# Sistema de Gestión de Cursos Online

**Grupo 25 - PROYECTO FINAL**  
**Integrantes:** Lisando Alvarez, Angelina Rossi

---

## 📋 Descripción General

Sistema completo para la gestión de cursos online con arquitectura de microservicios:
- **Backend:** API REST con Node.js + Express + TypeScript + MongoDB
- **Frontend:** Interfaz web con React 19 + Vite + TypeScript

El objetivo es permitir la administración de cursos, usuarios, clases y materiales educativos, brindando una experiencia fluida tanto para alumnos como para administradores.

## ✨ Funcionalidades principales

### 🎓 Para Alumnos
- Autenticación y registro
- Búsqueda y filtrado de cursos
- Visualización de detalles de cursos
- Inscripción en cursos
- Acceso a materiales y clases
- Gestión del perfil personal

### 👨‍🏫 Para Profesores
- Gestionar sus cursos
- Agregar clases y materiales
- Ver lista de inscritos
- Editar información del curso

### 🛡️ Para Administradores
- Gestión completa de usuarios
- Control de cursos, clases y materiales
- Otorgamiento de roles
- Auditoría del sistema

## 🛠️ Stack Tecnológico

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT + Bcryptjs
- Zod para validación
- ESLint + Prettier

**→ [Ver README Backend](/backend/README.md)**

### Frontend
- React 19 + Vite
- TypeScript
- React Router v7
- Axios
- Context API

**→ [Ver README Frontend](/frontend/README.md)**

## 📦 Requisitos del Sistema

- **Node.js** v18+
- **npm** v9+
- **MongoDB** (local en `mongodb://localhost:27017` o Atlas)

## 🚀 Instalación Rápida

### 1. Clonar repositorio
```bash
git clone https://github.com/LiFranAlvarez/ProyectoFinal
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev
```

**Acceder:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🏗️ Estructura del Proyecto

```
ProyectoFinal/
    ├── backend/              # API REST
    │   ├── src/
    │   ├── dist/
    │   ├── package.json
    │   ├── README.md         # Documentación backend
    │   └── .env
    │
    ├── frontend/             # Aplicación React
    │   ├── src/
    │   ├── dist/
    │   ├── package.json
    │   ├── README.md         # Documentación frontend
    │   └── .env
    │
    └── README.md             # Este archivo
```

## 🔐 Autenticación y Roles

El sistema usa **JWT (JSON Web Tokens)** para autenticar usuarios.

**Roles disponibles:**

| Rol | Permisos |
|-----|----------|
| `ADMIN` | Acceso completo al sistema |
| `PROFESOR` | Gestionar cursos propios |
| `ALUMNO` | Inscribirse en cursos (rol por defecto) |

**Flujo de autenticación:**
1. Usuario registra/inicia sesión
2. Backend valida credenciales y retorna JWT
3. Frontend almacena token en localStorage
4. Cada petición incluye: `Authorization: Bearer <token>`
5. Backend valida token en middlewares protegidos

## 🏛️ Patrones de Diseño Aplicados

| Patrón | Ubicación | Propósito |
|--------|-----------|----------|
| **Singleton** | `config/db.connect.ts` | Una única instancia de conexión a BD |
| **Facade** | `services/*.ts` | Simplificar acceso a lógica de negocio |
| **Chain of Responsibility** | `middlewares/*.ts` | Pipeline de procesamiento de peticiones |
| **Strategy** | `validators/`, `models/` | Estrategias de validación dinámicas |
| **Repository** | `models/` + `services/` | Abstracción de acceso a datos |

## 📊 Ejemplos Rápidos de API

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/usuario \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@example.com","password":"pass123"}'
```

### Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"pass123"}'
```

**Respuesta:**
```json
{
  "message": "Inicio Sesion Correctamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Obtener cursos (con token)
```bash
curl -X GET http://localhost:3000/api/cursos \
  -H "Authorization: Bearer <token>"
```

## ⚙️ Scripts Principales

### Backend
```bash
npm run dev       # Desarrollo con hot-reload
npm run build     # Compilar TypeScript
npm run lint      # Revisar código
npm run ci        # Lint + test + build
```

### Frontend
```bash
npm run dev       # Desarrollo
npm run build     # Build para producción
npm run lint      # Revisar código
```

## 🔧 Solución de Problemas Comunes

### MongoDB no conecta
```bash
# Inicia MongoDB localmente
mongod --dbpath /path/to/data

# O configura Atlas en .env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/database
```

### Puerto 3000 en uso
```bash
# Busca qué proceso usa el puerto
lsof -i :3000           # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### ESLint errors
```bash
# Corrige automáticamente
npm run lint:fix
```



## 📚 Documentación Detallada

- **[Backend README](/backend/README.md)** - API, scripts, troubleshooting
- **[Frontend README](/frontend/README.md)** - UI, componentes, estados

## 📄 Licencia

Proyecto educativo para la materia **Trabajo Integrador** - Año 2026

## ❓ Soporte

Para reportar bugs o sugerencias:
1. Abre un [issue en GitHub](https://github.com/LiFranAlvarez/MetodologiaDeSistemas-II/issues)
2. Describe el problema con detalle
3. Incluye pasos para reproducirlo

