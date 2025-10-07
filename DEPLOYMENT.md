# Despliegue de Bilop

Este documento proporciona instrucciones resumidas para desplegar la aplicación Bilop (frontend y backend) en un servidor de producción.

## Requisitos

- Ubuntu 24.x / Debian 12 o superior
- PostgreSQL 12 o superior
- Node.js 18.x o superior
- Nginx
- PM2

## Despliegue Automático

### 1. Clonar el Repositorio

```bash
# En tu servidor
git clone https://github.com/tu-repositorio/bilop-project.git
cd bilop-project
```

### 2. Ejecutar Script de Configuración

```bash
# Dar permisos de ejecución
chmod +x setup.sh

# Ejecutar como root o con sudo
sudo ./setup.sh
```

El script te guiará a través del proceso de configuración:

- Creación de un usuario para la aplicación
- Instalación de dependencias (Node.js, PostgreSQL, Nginx)
- Configuración de la base de datos
- Creación de archivos de variables de entorno
- Configuración de Nginx
- Generación de scripts de despliegue y backup

### 3. Desplegar la Aplicación

```bash
# Ejecutar el script de despliegue
/opt/bilop/deploy.sh
```

## Despliegue Manual

### 1. Configuración del Backend

#### Variables de Entorno

Crea un archivo `.env` en el directorio `bilop-admin-back`:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=bilopapp_user
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=bilopapp
JWT_SECRET=your_secure_jwt_secret
```

#### Construcción e Inicio

```bash
cd bilop-admin-back
npm install
npm run build
pm2 start dist/main.js --name bilop-backend
```

### 2. Configuración del Frontend

#### Variables de Entorno

Crea un archivo `.env.local` en el directorio `bilop-admin-front`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Ajusta la URL según corresponda (por ejemplo, `https://api.bilop.com`).

#### Construcción e Inicio

```bash
cd bilop-admin-front
npm install
npm run build
pm2 start "npm start" --name bilop-frontend
```

### 3. Configuración de Nginx

#### Backend

```nginx
# /etc/nginx/sites-available/bilop-backend
server {
    listen 80;
    server_name api.bilop.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend

```nginx
# /etc/nginx/sites-available/bilop-frontend
server {
    listen 80;
    server_name bilop.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Habilitar los sitios:

```bash
sudo ln -s /etc/nginx/sites-available/bilop-backend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/bilop-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Configuración de HTTPS (Recomendado)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d bilop.com -d api.bilop.com
```

## Mantenimiento

### Actualización de la Aplicación

```bash
# Actualizar backend
cd bilop-admin-back
git pull
npm install
npm run build
pm2 restart bilop-backend

# Actualizar frontend
cd bilop-admin-front
git pull
npm install
npm run build
pm2 restart bilop-frontend
```

### Respaldo de la Base de Datos

Configurar un backup automático:

```bash
# Editar crontab
crontab -e

# Añadir (ejecuta backup diario a las 2 AM)
0 2 * * * /opt/bilop/backup.sh
```

### Gestión de Procesos

```bash
# Ver estado de los procesos
pm2 list

# Ver logs
pm2 logs bilop-backend
pm2 logs bilop-frontend

# Reiniciar aplicaciones
pm2 restart bilop-backend
pm2 restart bilop-frontend
```

## Solución de Problemas

### Error CORS

Si encuentras errores de CORS, verifica la configuración en:

- Backend: Configuración CORS en `src/main.ts`
- Nginx: Headers CORS en la configuración del servidor

### Error de Conexión a la Base de Datos

- Verifica las credenciales en `.env`
- Comprueba que el usuario tenga acceso a la base de datos:
  ```bash
  sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname='bilopapp';"
  ```

### El Frontend No Puede Conectar con el Backend

- Verifica la URL en `NEXT_PUBLIC_API_URL`
- Verifica que el backend esté funcionando:
  ```bash
  curl http://localhost:3000
  ```

### Comprobar Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
```

### Comprobar PM2

```bash
pm2 list
pm2 logs
```
