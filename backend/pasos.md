npm install express cors sqlite3
npm install -D ts-node nodemon @types/express @types/node
npm install express cors
npm install -D @types/express @types/node ts-node nodemon


✅ loggerMiddleware → registra cada request
✅ errorHandler → captura errores globales
✅ notFoundMiddleware → rutas inexistentes

✅ 1. bcryptjs

¿Para qué sirve?

Se usa para encriptar (hashear) contraseñas antes de guardarlas en la base de datos.

Permite comparar una contraseña ingresada con la guardada sin conocer la original.

Por qué es importante
✅ Nunca se debe guardar una contraseña en texto plano
✅ Protege datos si la BD se filtra

✅ 2. jsonwebtoken (JWT)

¿Para qué sirve?

Genera un token firmado que identifica al usuario después del login.

Ese token se enviará en cada request privada.

Contiene

id del usuario

email

rol

fecha de expiración

Sirve para evitar sesiones en servidor → autenticación stateless ✅

✅ 3. .env

¿Para qué sirve?

Guarda variables sensibles:

JWT_SECRET

Duración del token

Evita subir claves al repositorio

✅ Seguridad
✅ Configuración flexible según entorno

✅ 4. UsuarioRepository con hashing

¿Para qué sirve?

Se encarga de guardar usuarios en la base

Antes de guardarlos, hashea la contraseña

También permite buscar por email (para login)

➡️ Es la capa que interactúa con SQLite

✅ 5. AuthService

¿Para qué sirve?

Contiene la lógica del login

Verifica usuario y contraseña

Genera el JWT

Devuelve usuario + token

✅ Separa lógica de negocio del controlador
✅ Facilita testeo y mantenimiento

✅ 6. auth.controller.ts

¿Para qué sirve?

Recibe la request del cliente (email y password)

Llama al AuthService

Devuelve respuesta HTTP

➡️ Es la capa entre frontend y backend

✅ 7. verifyToken middleware

¿Para qué sirve?

Valida que el cliente envíe un token válido

Decodifica el JWT

Adjunta el usuario en req.user

Si no hay token → 401 Unauthorized

✅ Protege rutas
✅ Controla acceso

Ejemplo:

router.get("/usuarios", verifyToken, getUsuarios);

✅ 8. auth.routes.ts

¿Para qué sirve?

Define las rutas de autenticación del sistema

Ej:

POST /auth/login


➡️ Organiza endpoints de login, registro, refresh, logout, etc.

✅ 9. server.ts (integración)

¿Para qué sirve?

Registra las rutas de autenticación

Carga variables .env

Hace que todo funcione junto

📌 Cómo fluye todo

1️⃣ Usuario envía email + password a /auth/login
2️⃣ auth.controller procesa el request
3️⃣ AuthService valida credenciales y genera token
4️⃣ Cliente guarda el token
5️⃣ Cliente llama rutas protegidas con Authorization: Bearer TOKEN
6️⃣ verifyToken valida el token antes de entrar al controlador

✅ Resultado final

✅ Contraseñas seguras
✅ Login funcionando
✅ Usuarios autenticados por JWT
✅ Rutas protegidas
✅ Backend preparado para roles y permisos

npm install bcryptjs jsonwebtoken dotenv
npm install -D @types/jsonwebtoken @types/bcryptjs