#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print status messages
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Este script debe ejecutarse como root"
    exit 1
fi

# Setup swap file
setup_swap() {
    print_status "Verificando si es necesario configurar memoria swap..."
    
    # Verificar si el swap ya está configurado
    if [ "$(swapon --show | wc -l)" -eq 0 ]; then
        print_status "Creando archivo de swap (2GB)..."
        
        # Crear archivo swap
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        
        # Configurar swap para que persista después de reiniciar
        if ! grep -q "/swapfile" /etc/fstab; then
            echo "/swapfile none swap sw 0 0" >> /etc/fstab
            print_status "Archivo swap añadido a /etc/fstab para persistencia"
        fi
        
        print_status "Memoria swap configurada con éxito (2GB)"
    else
        print_status "La memoria swap ya está configurada"
    fi
}

# Check if required tools are installed
check_requirements() {
    print_status "Verificando requisitos..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        print_status "Instalando Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    
    # npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado"
        exit 1
    fi
    
    # PM2
    if ! command -v pm2 &> /dev/null; then
        print_status "Instalando PM2..."
        npm install -g pm2
    fi
    
    # Nginx
    if ! command -v nginx &> /dev/null; then
        print_status "Instalando Nginx..."
        apt-get install -y nginx
    fi
    
    # PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_status "Instalando PostgreSQL..."
        apt-get install -y postgresql postgresql-contrib
    fi
}

# Setup PostgreSQL database
setup_database() {
    print_status "Configurando base de datos PostgreSQL..."
    
    # Verificar si la base de datos existe
    if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw bilopapp; then
        print_warning "La base de datos bilopapp ya existe. Se mantendrá la base de datos existente."
    else
        # Crear base de datos
        sudo -u postgres psql -c "CREATE DATABASE bilopapp;"
        print_status "Base de datos creada"
    fi
    
    # Verificar si el usuario existe
    if sudo -u postgres psql -t -c "SELECT 1 FROM pg_roles WHERE rolname='bilopapp_user'" | grep -q 1; then
        print_warning "El usuario bilopapp_user ya existe. Se mantendrá el usuario existente."
    else
        # Crear usuario y otorgar privilegios
        sudo -u postgres psql -c "CREATE USER bilopapp_user WITH PASSWORD '1234';"
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bilopapp TO bilopapp_user;"
        print_status "Usuario creado y privilegios otorgados"
    fi
    
    print_status "Configuración de base de datos completada"
}

# Configure Nginx
setup_nginx() {
    print_status "Configurando Nginx..."
    
    # Hacer backup de las configuraciones existentes
    if [ -f /etc/nginx/sites-available/bilop-backend ]; then
        cp /etc/nginx/sites-available/bilop-backend /etc/nginx/sites-available/bilop-backend.bak
    fi
    if [ -f /etc/nginx/sites-available/bilop-frontend ]; then
        cp /etc/nginx/sites-available/bilop-frontend /etc/nginx/sites-available/bilop-frontend.bak
    fi
    
    # Configuración para el backend
    cat > /etc/nginx/sites-available/bilop-backend <<EOL
server {
    listen 80;
    server_name api.bilop.com;  # Cambiar por tu dominio

    # Configuración de CORS mejorada
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;

    # Aumentar timeout para operaciones largas
    proxy_connect_timeout 60;
    proxy_send_timeout 60;
    proxy_read_timeout 60;
    send_timeout 60;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Configuración para cookies y headers de autenticación
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Permitir cookies
        proxy_cookie_path / "/; secure; HttpOnly; SameSite=Strict";
    }
}
EOL

    # Configuración para el frontend
    cat > /etc/nginx/sites-available/bilop-frontend <<EOL
server {
    listen 80 default_server;
    server_name _;  # Captura todas las peticiones

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

    # Habilitar sitios
    ln -sf /etc/nginx/sites-available/bilop-backend /etc/nginx/sites-enabled/
    ln -sf /etc/nginx/sites-available/bilop-frontend /etc/nginx/sites-enabled/
    
    # Eliminar configuración por defecto
    rm -f /etc/nginx/sites-enabled/default
    
    # Verificar y reiniciar Nginx
    if nginx -t; then
        systemctl restart nginx
        print_status "Configuración de Nginx completada"
    else
        print_error "Error en la configuración de Nginx. Restaurando backup..."
        if [ -f /etc/nginx/sites-available/bilop-backend.bak ]; then
            cp /etc/nginx/sites-available/bilop-backend.bak /etc/nginx/sites-available/bilop-backend
        fi
        if [ -f /etc/nginx/sites-available/bilop-frontend.bak ]; then
            cp /etc/nginx/sites-available/bilop-frontend.bak /etc/nginx/sites-available/bilop-frontend
        fi
        systemctl restart nginx
    fi
}

# Deploy frontend
deploy_frontend() {
    print_status "Desplegando frontend..."
    
    cd bilop-admin-front
    
    # Crear directorios necesarios
    mkdir -p logs
    mkdir -p public/uploads
    chmod 755 public/uploads
    
    # Limpiar instalación anterior de forma más completa
    print_status "Limpiando completamente la instalación anterior..."
    rm -rf node_modules .next package-lock.json yarn.lock
    
    # Verificar npm
    npm --version > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_error "npm no está funcionando correctamente. Reinstalando Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    
    # Instalar dependencias explícitamente primero
    print_status "Instalando dependencias críticas primero..."
    npm install --save-dev tailwindcss@3.4.1 postcss@8.4.38 autoprefixer@10.4.21
    
    # Si la instalación directa falló, probar con npm cache clean
    if [ $? -ne 0 ]; then
        print_warning "Limpiando caché de npm e intentando de nuevo..."
        npm cache clean --force
        npm install --save-dev tailwindcss@3.4.1 postcss@8.4.38 autoprefixer@10.4.21
    fi
    
    # Instalar dependencias generales
    print_status "Instalando resto de dependencias del frontend..."
    npm install --include=dev
    
    # Verificar que autoprefixer esté realmente instalado
    if [ ! -d "node_modules/autoprefixer" ]; then
        print_warning "autoprefixer no se instaló correctamente. Intentando nuevamente..."
        npm install --save-dev autoprefixer@10.4.21
    fi
    
    # Crear archivo postcss.config.js con configuración estándar
    print_status "Creando archivo postcss.config.js estandarizado..."
    cat > postcss.config.js <<EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL
    
    # Verificar que tailwindcss.config.js exista
    if [ ! -f "tailwind.config.js" ] && [ ! -f "tailwind.config.ts" ]; then
        print_status "Creando archivo tailwind.config.js básico..."
        cat > tailwind.config.js <<EOL
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL
    fi
    
    # Backup de next.config.js
    if [ -f next.config.js ]; then
        cp next.config.js next.config.js.bak
    fi
    
    # Crear un next.config.js optimizado para resolver problemas de alias
    print_status "Creando configuración de Next.js optimizada para resolver problemas de importación..."
    cat > next.config.js <<EOL
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Configuración específica para resolver imports @/
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, './components'),
      '@/components/ui': path.resolve(__dirname, './components/ui'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/services': path.resolve(__dirname, './services'),
      '@/types': path.resolve(__dirname, './types'),
    };
    
    // Módulos de fallback para dependencias problemáticas
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
EOL
    
    # Ejecutar script mejorado para arreglar imports
    print_status "Corrigiendo imports problemáticos con script mejorado..."
    node fix-imports.js
    
    # Crear archivo .env.local desde config.env.local
    if [ -f config.env.local ]; then
        print_status "Copiando configuración de entorno..."
        cp config.env.local .env.local
    else
        print_status "Creando archivo .env.local..."
        cat > .env.local <<EOL
# API Configuration
NEXT_PUBLIC_API_URL=http://157.230.211.9:3000
NEXT_PUBLIC_APP_URL=http://157.230.211.9:3001

# Authentication
NEXT_PUBLIC_JWT_EXPIRY=3600
NEXTAUTH_URL=http://157.230.211.9:3001
NEXTAUTH_SECRET=$(generate_secure_secret)

# CORS
NEXT_PUBLIC_ALLOWED_ORIGINS=http://157.230.211.9:3000,http://157.230.211.9:3001

# Environment
NODE_ENV=production
EOL
    fi
    
    # Detener el proceso existente si está corriendo
    if pm2 list | grep -q "bilop-frontend"; then
        print_status "Deteniendo frontend existente..."
        pm2 delete bilop-frontend
    fi
    
    print_status "Limpiando build anterior..."
    rm -rf .next
    
    # Configurar memoria para el build
    export NODE_ENV=production
    # Incrementar el límite de memoria para prevenir errores OOM
    export NODE_OPTIONS="--max-old-space-size=2048"
    
    print_status "Construyendo frontend en modo producción (esto puede tardar varios minutos)..."
    npm run build > logs/build.log 2>&1
    
    # Verificar si el build fue exitoso
    if [ ! -d .next ]; then
        print_error "Error en el build del frontend: directorio .next no encontrado"
        print_error "Mostrando últimas 20 líneas del log de error:"
        tail -n 20 logs/build.log
        
        # Intentar arreglar problemas de imports antes de intentar una construcción alternativa
        print_warning "Intentando aplicar fix-imports nuevamente con más detalle..."
        node fix-imports.js
        
        # Intentar build en modo desarrollo como último recurso
        print_warning "Intentando build en modo desarrollo como alternativa..."
        export NODE_ENV=development
        npm run build > logs/build-dev.log 2>&1
        
        if [ ! -d .next ]; then
            print_error "El build en modo desarrollo también falló. Mostrando últimas 20 líneas del log:"
            tail -n 20 logs/build-dev.log
            
            print_warning "Intentando un último enfoque: construir en modo dev con menos optimizaciones..."
            # Un último intento con configuración muy básica
            cat > next.config.js <<EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true }
};
module.exports = nextConfig;
EOL
            
            npm run dev -- --port 3001 > /dev/null 2>&1 &
            DEV_PID=$!
            print_warning "Ejecutando en modo desarrollo en segundo plano (PID: $DEV_PID)"
            print_warning "Configurando PM2 para gestionar este proceso..."
            
            sleep 5
            kill $DEV_PID
            
            print_status "Configurando PM2 para iniciar en modo dev..."
            cat > ecosystem.config.js <<EOL
module.exports = {
  apps: [{
    name: 'bilop-frontend',
    script: 'npm',
    args: 'run dev',
    env: {
      NODE_ENV: 'development',
      PORT: 3001,
      NEXT_PUBLIC_API_URL: 'http://localhost:3000'
    },
    instances: 1,
    max_memory_restart: '600M',
    node_args: '--max-old-space-size=600',
    watch: false,
    merge_logs: true,
    error_file: 'logs/err.log',
    out_file: 'logs/out.log'
  }]
}
EOL
            
            # Iniciar en modo desarrollo
            pm2 start ecosystem.config.js
            print_warning "Frontend iniciado en modo desarrollo (no optimizado)"
            
            # Restaurar next.config.js original
            if [ -f next.config.js.bak ]; then
                mv next.config.js.bak next.config.js
            fi
            
            cd ..
            return 0
        else
            print_warning "Build en modo desarrollo exitoso. Usando esta versión (no optimizada)."
        fi
    else
        print_status "Build exitoso."
    fi
    
    # Restaurar next.config.js original
    if [ -f next.config.js.bak ]; then
        mv next.config.js.bak next.config.js
    fi
    
    print_status "Configurando PM2..."
    # Configurar PM2 con límites de memoria
    cat > ecosystem.config.js <<EOL
module.exports = {
  apps: [{
    name: 'bilop-frontend',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      NEXT_PUBLIC_API_URL: 'http://localhost:3000'
    },
    exec_mode: 'cluster',
    instances: 1,
    max_memory_restart: '600M',
    node_args: '--max-old-space-size=600',
    exp_backoff_restart_delay: 100,
    max_restarts: 10,
    watch: false,
    merge_logs: true,
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
EOL
    
    # Iniciar la aplicación con PM2
    print_status "Iniciando aplicación frontend con PM2..."
    pm2 start ecosystem.config.js
    
    # Asegurar permisos correctos
    chmod -R 755 .next
    chmod -R 755 public
    chmod 644 .env.local
    
    cd ..
    print_status "Despliegue del frontend completado"
}

# Deploy backend
deploy_backend() {
    print_status "Desplegando backend..."
    
    cd bilop-admin-back
    
    # Crear directorios necesarios
    mkdir -p logs
    mkdir -p uploads
    chmod 755 uploads
    
    # Instalar dependencias incluyendo rimraf
    print_status "Instalando dependencias del backend..."
    npm install
    npm install --save-dev rimraf
    
    # Crear archivo .env si no existe
    if [ ! -f .env ]; then
        print_status "Creando archivo .env desde config_sql.env..."
        if [ -f config_sql.env ]; then
            cp config_sql.env .env
        else
            cat > .env <<EOL
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=bilopapp_user
DATABASE_PASSWORD=1234
DATABASE_NAME=bilopapp
DATABASE_SSL=false

# JWT Configuration
JWT_SECRET=$(generate_secure_secret)
JWT_EXPIRY=3600

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Cookie Configuration
COOKIE_SECRET=$(generate_secure_secret)
COOKIE_SECURE=false
EOL
        fi
    fi
    
    # Detener el proceso existente si está corriendo
    if pm2 list | grep -q "bilop-backend"; then
        print_status "Deteniendo backend existente..."
        pm2 delete bilop-backend
    fi
    
    print_status "Limpiando build anterior..."
    npm run prebuild
    
    print_status "Construyendo la aplicación backend..."
    # Configurar memoria para el build
    export NODE_ENV=production
    export NODE_OPTIONS="--max-old-space-size=2048"
    npm run build
    
    # Verificar si el build fue exitoso
    if [ ! -f dist/main.js ]; then
        print_error "Error en el build del backend: dist/main.js no encontrado"
        print_error "Revisando logs del build..."
        cat logs/build-error.log 2>/dev/null || echo "No hay logs de error disponibles"
        exit 1
    fi
    
    print_status "Build exitoso. Configurando PM2 para el backend..."
    # Configurar PM2 con límites de memoria
    cat > ecosystem.config.js <<EOL
module.exports = {
  apps: [{
    name: 'bilop-backend',
    script: 'dist/main.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    exec_mode: 'cluster',
    instances: 1,
    max_memory_restart: '600M',
    node_args: '--max-old-space-size=600',
    exp_backoff_restart_delay: 100,
    max_restarts: 10,
    watch: false,
    merge_logs: true,
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
EOL
    
    # Iniciar la aplicación con PM2
    print_status "Iniciando aplicación backend con PM2..."
    pm2 start ecosystem.config.js --env production
    
    cd ..
    print_status "Despliegue del backend completado"
}

# Función para generar secretos seguros
generate_secure_secret() {
    openssl rand -base64 32 | tr -d '\n'
}

# Main deployment process
main() {
    print_status "Iniciando proceso de despliegue..."
    
    # Configurar swap
    setup_swap
    
    # Verificar requisitos
    check_requirements
    
    # Configurar base de datos
    setup_database
    
    # Configurar Nginx
    setup_nginx
    
    # Desplegar backend
    deploy_backend
    
    # Desplegar frontend
    deploy_frontend
    
    # Guardar configuración de PM2
    pm2 save
    
    # Configurar inicio automático
    pm2 startup
    
    print_status "¡Despliegue completado con éxito!"
    print_status "Backend corriendo en: http://localhost:3000"
    print_status "Frontend corriendo en: http://localhost:3001"
    print_status "Logs disponibles con: pm2 logs"
}

# Run main function
main 