# Guía de Despliegue Local de Bilop

Esta guía detalla los pasos necesarios para levantar el proyecto completo de Bilop (frontend y backend) en tu entorno local de desarrollo.

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación de Dependencias del Sistema](#instalación-de-dependencias-del-sistema)
3. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
4. [Configuración del Backend](#configuración-del-backend)
5. [Configuración del Frontend](#configuración-del-frontend)
6. [Levantar el Proyecto](#levantar-el-proyecto)
7. [Verificación y Pruebas](#verificación-y-pruebas)
8. [Comandos Útiles](#comandos-útiles)
9. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

## Requisitos Previos

- **Sistema Operativo**: macOS, Linux o Windows (con WSL2 recomendado)
- **Node.js**: Versión 18.x o superior
- **npm**: Versión 9.x o superior
- **PostgreSQL**: Versión 12 o superior
- **Git**: Para clonar el repositorio
- **Editor de código**: VS Code, WebStorm, etc. (opcional pero recomendado)

## Instalación de Dependencias del Sistema

### 1. Instalar Node.js y npm

#### En macOS (usando Homebrew):
```bash
brew install node@18
```

#### En Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Verificar instalación:
```bash
node -v  # Debe mostrar v18.x.x o superior
npm -v   # Debe mostrar v9.x.x o superior
```

### 2. Instalar PostgreSQL

#### En macOS (usando Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### En Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Verificar instalación:
```bash
psql --version  # Debe mostrar PostgreSQL 12 o superior
```

## Configuración de la Base de Datos

### 1. Acceder a PostgreSQL

#### En macOS:
```bash
psql postgres
```

#### En Linux:
```bash
sudo -u postgres psql
```

### 2. Crear usuario y base de datos

Ejecuta los siguientes comandos dentro de la consola de PostgreSQL:

```sql
-- Crear usuario para la aplicación
CREATE USER bilopapp_user WITH PASSWORD '1234';

-- Crear base de datos
CREATE DATABASE bilopapp;

-- Otorgar privilegios al usuario
GRANT ALL PRIVILEGES ON DATABASE bilopapp TO bilopapp_user;

-- Conectar a la base de datos
\c bilopapp

-- Otorgar privilegios en el schema public
GRANT ALL ON SCHEMA public TO bilopapp_user;

-- Salir de psql
\q
```

### 3. Verificar la conexión

```bash
psql -U bilopapp_user -d bilopapp -h localhost
# Contraseña: 1234
```

Si la conexión es exitosa, la base de datos está lista.

## Configuración del Backend

### 1. Navegar al directorio del backend

```bash
cd bilop-admin-back
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de configuración de ejemplo:

```bash
cp config_sql.env .env
```

El archivo `.env` debe contener:

```env
# Configuración de la base de datos PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=bilopapp_user
DATABASE_PASSWORD=1234
DATABASE_NAME=bilopapp

# Configuración JWT para autenticación
JWT_SECRET=@8h6Yb?5/Nrs

# Puerto de la aplicación
# PORT=3000

# CORS - Permitir solicitudes desde el frontend
CORS_ORIGIN=http://localhost:3001
```

### 4. Compilar el proyecto (opcional para desarrollo)

```bash
npm run build
```

**Nota**: En modo desarrollo no es necesario compilar, puedes usar directamente `npm run start:dev`.

## Configuración del Frontend

### 1. Navegar al directorio del frontend

Desde la raíz del proyecto:

```bash
cd bilop-admin-front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de configuración de ejemplo:

```bash
cp config.env.local .env.local
```

El archivo `.env.local` debe contener:

```env
# URL del backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Puerto para el servidor Next.js
PORT=3001
```

## Levantar el Proyecto

### Opción 1: Levantar Backend y Frontend por Separado (Recomendado para desarrollo)

#### Terminal 1 - Backend:
```bash
cd bilop-admin-back
npm run start:dev
```

El backend estará disponible en: **http://localhost:3000**

#### Terminal 2 - Frontend:
```bash
cd bilop-admin-front
npm run dev
```

El frontend estará disponible en: **http://localhost:3001**

### Opción 2: Levantar en Modo Producción Local

#### Backend:
```bash
cd bilop-admin-back
npm run build
npm run start:prod
```

#### Frontend:
```bash
cd bilop-admin-front
npm run build
npm run start
```

## Verificación y Pruebas

### 1. Verificar que el backend esté funcionando

Abre tu navegador o usa curl:

```bash
curl http://localhost:3000
```

Deberías recibir una respuesta del servidor.

### 2. Verificar que el frontend esté funcionando

Abre tu navegador y visita:

```
http://localhost:3001
```

Deberías ver la interfaz de la aplicación Bilop.

### 3. Verificar la conexión entre frontend y backend

- Intenta hacer login en la aplicación
- Verifica que los datos se carguen correctamente
- Revisa la consola del navegador (F12) para detectar errores

### 4. Revisar logs en caso de problemas

#### Backend:
Los logs aparecerán directamente en la terminal donde ejecutaste el backend.

#### Frontend:
Los logs aparecerán en la terminal donde ejecutaste el frontend y en la consola del navegador.

## Comandos Útiles

### Backend

```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo debug
npm run start:debug

# Compilar el proyecto
npm run build

# Ejecutar en modo producción
npm run start:prod

# Ejecutar linter
npm run lint

# Ejecutar tests
npm run test

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar seed de datos (si existe)
npm run seed
```

### Frontend

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en modo producción
npm run start

# Ejecutar linter
npm run lint
```

### Base de Datos

```bash
# Conectar a la base de datos
psql -U bilopapp_user -d bilopapp -h localhost

# Listar todas las bases de datos
psql -U bilopapp_user -h localhost -l

# Hacer backup de la base de datos
pg_dump -U bilopapp_user -d bilopapp -h localhost > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U bilopapp_user -d bilopapp -h localhost < backup_20251008.sql

# Reiniciar PostgreSQL (macOS)
brew services restart postgresql@14

# Reiniciar PostgreSQL (Linux)
sudo systemctl restart postgresql
```

## Solución de Problemas Comunes

### Error: "Cannot connect to database"

**Causa**: PostgreSQL no está corriendo o las credenciales son incorrectas.

**Solución**:
```bash
# Verificar que PostgreSQL esté corriendo
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Verificar credenciales en el archivo .env del backend
cat bilop-admin-back/.env
```

### Error: "Port 3000 is already in use"

**Causa**: Otro proceso está usando el puerto 3000.

**Solución**:
```bash
# Encontrar el proceso que usa el puerto
lsof -i :3000

# Matar el proceso (reemplaza PID con el número del proceso)
kill -9 PID

# O cambiar el puerto en el archivo .env del backend
# Descomentar y modificar: PORT=3002
```

### Error: "Port 3001 is already in use"

**Causa**: Otro proceso está usando el puerto 3001.

**Solución**:
```bash
# Encontrar el proceso que usa el puerto
lsof -i :3001

# Matar el proceso
kill -9 PID

# O cambiar el puerto en el archivo .env.local del frontend
# Modificar: PORT=3002
```

### Error: "Module not found" o errores de dependencias

**Causa**: Las dependencias no están instaladas correctamente.

**Solución**:
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Si persiste el problema, limpiar caché de npm
npm cache clean --force
npm install
```

### Error: "CORS policy" en el navegador

**Causa**: El backend no está configurado para aceptar solicitudes desde el frontend.

**Solución**:
Verifica que en el archivo `.env` del backend esté configurado:
```env
CORS_ORIGIN=http://localhost:3001
```

### Error: "Cannot find module '@/...'"

**Causa**: Los alias de importación no están configurados correctamente.

**Solución**:
Verifica que el archivo `tsconfig.json` (backend) o `next.config.js` (frontend) tenga configurados los paths correctamente.

### La aplicación se ve sin estilos

**Causa**: Tailwind CSS no se compiló correctamente.

**Solución**:
```bash
cd bilop-admin-front
rm -rf .next
npm run build
npm run dev
```

### Error de autenticación JWT

**Causa**: El JWT_SECRET no coincide o no está configurado.

**Solución**:
Verifica que el `JWT_SECRET` en el archivo `.env` del backend sea el mismo que se usó para generar los tokens.

### La base de datos no tiene tablas

**Causa**: Las migraciones no se han ejecutado o TypeORM no creó las tablas automáticamente.

**Solución**:
```bash
cd bilop-admin-back

# Si hay migraciones disponibles
npm run migration:run

# Si TypeORM está configurado con synchronize: true, 
# simplemente reinicia el backend y las tablas se crearán automáticamente
npm run start:dev
```

## Estructura del Proyecto

```
bilup-oct25/
├── bilop-admin-back/          # Backend (NestJS)
│   ├── src/                   # Código fuente
│   ├── dist/                  # Código compilado
│   ├── config_sql.env         # Plantilla de configuración
│   ├── .env                   # Variables de entorno (crear)
│   └── package.json
│
├── bilop-admin-front/         # Frontend (Next.js)
│   ├── app/                   # Directorio de páginas (App Router)
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilidades y helpers
│   ├── public/                # Archivos estáticos
│   ├── config.env.local       # Plantilla de configuración
│   ├── .env.local             # Variables de entorno (crear)
│   └── package.json
│
├── README.md                  # Documentación general
├── guia_despliegue_server.md  # Guía de despliegue en servidor
└── guia_despliegue_local.md   # Esta guía
```

## Notas Adicionales

### Modo Desarrollo vs Producción

- **Modo Desarrollo**: Incluye hot-reload, mensajes de error detallados y herramientas de desarrollo.
- **Modo Producción**: Código optimizado, minificado y sin herramientas de desarrollo.

### Variables de Entorno

- **Backend**: Usa el archivo `.env` (nunca lo subas a Git)
- **Frontend**: Usa el archivo `.env.local` (nunca lo subas a Git)
- Las variables que empiezan con `NEXT_PUBLIC_` en el frontend son accesibles desde el navegador

### Seguridad en Desarrollo Local

- Usa contraseñas simples solo en desarrollo local
- Nunca uses las mismas credenciales en producción
- No compartas tu archivo `.env` con nadie
- Mantén actualizadas las dependencias: `npm audit fix`

## Próximos Pasos

Una vez que tengas el proyecto funcionando localmente:

1. **Familiarízate con el código**: Explora la estructura de carpetas y archivos
2. **Lee la documentación**: Revisa los README de cada módulo
3. **Ejecuta los tests**: `npm run test` en backend y frontend
4. **Crea una rama para tus cambios**: `git checkout -b feature/mi-nueva-funcionalidad`
5. **Sigue las convenciones**: Revisa el archivo `AGENTS.md` para conocer los estándares del proyecto

## Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de TypeORM](https://typeorm.io/)

---

Con esta guía, deberías poder levantar exitosamente el proyecto Bilop en tu entorno local. Si encuentras algún problema que no esté cubierto aquí, revisa los logs de la aplicación o consulta con el equipo de desarrollo.
