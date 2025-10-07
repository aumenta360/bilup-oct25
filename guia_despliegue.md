# Guía de Despliegue de Bilop en Digital Ocean

Esta guía detalla los pasos necesarios para desplegar la aplicación Bilop (frontend y backend) en un servidor de Digital Ocean con Ubuntu 24.10.

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Acceso al Servidor](#acceso-al-servidor)
3. [Preparación del Servidor](#preparación-del-servidor)
4. [Instalación de Dependencias](#instalación-de-dependencias)
5. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
6. [Despliegue del Backend](#despliegue-del-backend)
7. [Despliegue del Frontend](#despliegue-del-frontend)
8. [Configuración de Proxy Inverso con Nginx](#configuración-de-proxy-inverso-con-nginx)
9. [Configuración de HTTPS con Certbot](#configuración-de-https-con-certbot)
10. [Configuración de Firewall](#configuración-de-firewall)
11. [Configuración de PM2 para Gestión de Procesos](#configuración-de-pm2-para-gestión-de-procesos)
12. [Verificación y Pruebas](#verificación-y-pruebas)
13. [Mantenimiento](#mantenimiento)

## Requisitos Previos

- Un servidor Droplet en Digital Ocean con Ubuntu 24.10
- Un nombre de dominio apuntando a la IP del servidor (opcional, pero recomendado)
- Acceso SSH al servidor como usuario root
- Cliente Git en tu máquina local

## Acceso al Servidor

```bash
ssh root@157.230.211.9
```

Al conectarte por primera vez, es recomendable actualizar todos los paquetes del sistema:

```bash
apt update && apt upgrade -y
```

## Preparación del Servidor

### 1. Crear un usuario con privilegios

Es una buena práctica no usar el usuario root directamente:

```bash
# Crear un nuevo usuario
adduser bilop_admin

# Agregar al grupo sudo
usermod -aG sudo bilop_admin

# Cambiar al nuevo usuario
su - bilop_admin
```

### 2. Configurar SSH para el nuevo usuario (opcional pero recomendado)

```bash
# Como usuario bilop_admin
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys

# Pegar tu clave pública SSH
chmod 600 ~/.ssh/authorized_keys

# Volver a root para configurar SSH
exit

# Como root
nano /etc/ssh/sshd_config
```

Modifica las siguientes líneas:
```
PermitRootLogin no
PasswordAuthentication no
```

Reinicia el servicio SSH:
```bash
systemctl restart sshd
```

## Instalación de Dependencias

### 1. Instalar Node.js y npm

```bash
# Como bilop_admin
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node -v  # Debe mostrar v18.x.x
npm -v   # Debe mostrar v9.x.x o superior
```

### 2. Instalar PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verificar estado
sudo systemctl status postgresql
```

### 3. Instalar Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar estado
sudo systemctl status nginx
```

### 4. Instalar herramientas adicionales

```bash
sudo apt install -y git curl build-essential
```

## Configuración de la Base de Datos

### 1. Crear usuario y base de datos PostgreSQL

```bash
# Acceder a la consola de PostgreSQL
sudo -u postgres psql

# Crear usuario y base de datos (dentro de psql)
CREATE USER bilopapp_user WITH PASSWORD 'una_contraseña_segura';
CREATE DATABASE bilopapp;
GRANT ALL PRIVILEGES ON DATABASE bilopapp TO bilopapp_user;

# Salir de psql
\q
```

## Despliegue del Backend

### 1. Clonar el repositorio

```bash
# Como bilop_admin
mkdir -p ~/apps
cd ~/apps
git clone https://github.com/tu-repositorio/bilop-project-main.git
cd bilop-project-main/bilop-admin-back
```

### 2. Configurar variables de entorno

```bash
cp config_sql.env .env
nano .env
```

Modifica el archivo `.env` con los valores correspondientes:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=bilopapp_user
DATABASE_PASSWORD=una_contraseña_segura
DATABASE_NAME=bilopapp
JWT_SECRET=un_secreto_muy_seguro_y_complejo
```

### 3. Instalar dependencias y construir la aplicación

```bash
npm install
npm run build
```

### 4. Instalar PM2 para gestionar el proceso

```bash
sudo npm install -g pm2
```

### 5. Iniciar la aplicación con PM2

```bash
pm2 start dist/main.js --name bilop-backend
pm2 save
pm2 startup
```

Ejecuta el comando que PM2 te indica para que se inicie automáticamente con el sistema.

## Despliegue del Frontend

### 1. Navegar al directorio del frontend

```bash
cd ~/apps/bilop-project-main/bilop-admin-front
```

### 2. Crear archivo de variables de entorno

```bash
nano .env.local
```

Agrega la siguiente configuración (ajustando la URL según corresponda):

```
NEXT_PUBLIC_API_URL=https://api.tudominio.com
# o si no tienes dominio:
# NEXT_PUBLIC_API_URL=http://157.230.211.9:3000
```

### 3. Instalar dependencias y construir el proyecto

```bash
npm install
npm run build
```

### 4. Iniciar la aplicación con PM2

```bash
pm2 start "npm start" --name bilop-frontend
pm2 save
```

## Configuración de Proxy Inverso con Nginx

### 1. Crear configuración para el backend

```bash
sudo nano /etc/nginx/sites-available/bilop-backend
```

Agrega la siguiente configuración:

```nginx
server {
    listen 80;
    server_name api.tudominio.com;  # O usa la IP del servidor si no tienes dominio

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

### 2. Crear configuración para el frontend

```bash
sudo nano /etc/nginx/sites-available/bilop-frontend
```

Agrega la siguiente configuración:

```nginx
server {
    listen 80;
    server_name tudominio.com;  # O usa la IP del servidor

    location / {
        proxy_pass http://localhost:3000;  # Puerto por defecto de Next.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Habilitar las configuraciones

```bash
sudo ln -s /etc/nginx/sites-available/bilop-backend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/bilop-frontend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Eliminar configuración por defecto
sudo nginx -t  # Verificar configuración
sudo systemctl restart nginx
```

## Configuración de HTTPS con Certbot

### 1. Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtener certificados SSL

```bash
sudo certbot --nginx -d tudominio.com -d api.tudominio.com
```

Sigue las instrucciones en pantalla para completar la configuración de HTTPS.

## Configuración de Firewall

```bash
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

## Configuración de PM2 para Gestión de Procesos

### 1. Verificar que las aplicaciones estén funcionando

```bash
pm2 list
```

### 2. Configurar monitoreo

```bash
pm2 monitor
```

### 3. Configurar logs

```bash
# Ver logs del backend
pm2 logs bilop-backend

# Ver logs del frontend
pm2 logs bilop-frontend
```

## Verificación y Pruebas

### 1. Verificar que el backend esté funcionando

```bash
curl http://localhost:3000
# o
curl https://api.tudominio.com
```

### 2. Verificar que el frontend esté funcionando

Abre un navegador y visita:
- `https://tudominio.com` (si configuraste un dominio)
- `http://157.230.211.9` (usando la IP del servidor)

### 3. Revisar los logs si hay problemas

```bash
pm2 logs
```

## Mantenimiento

### 1. Actualizar la aplicación

```bash
# Actualizar el backend
cd ~/apps/bilop-project-main/bilop-admin-back
git pull
npm install
npm run build
pm2 restart bilop-backend

# Actualizar el frontend
cd ~/apps/bilop-project-main/bilop-admin-front
git pull
npm install
npm run build
pm2 restart bilop-frontend
```

### 2. Respaldos de base de datos

Configurar un respaldo regular de la base de datos:

```bash
# Crear script de respaldo
nano ~/backup_db.sh
```

Contenido del script:
```bash
#!/bin/bash
BACKUP_DIR=~/backups
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="bilopapp_backup_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR
pg_dump -U bilopapp_user -d bilopapp > $BACKUP_DIR/$FILENAME
gzip $BACKUP_DIR/$FILENAME

# Mantener solo los últimos 7 respaldos
find $BACKUP_DIR -name "bilopapp_backup_*.sql.gz" -type f -mtime +7 -delete
```

Dar permiso de ejecución y programar con cron:
```bash
chmod +x ~/backup_db.sh
crontab -e
```

Agregar la siguiente línea para ejecutar diariamente a las 2 AM:
```
0 2 * * * ~/backup_db.sh
```

### 3. Actualizaciones del sistema

Configurar actualizaciones automáticas del sistema (recomendado):

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## Consideraciones de Seguridad Adicionales

1. **Configurar fail2ban** para proteger contra ataques de fuerza bruta:
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

2. **Revisar regularmente los logs** del sistema en busca de actividades sospechosas:
   ```bash
   sudo journalctl -f
   ```

3. **Configurar alertas** para notificaciones sobre problemas del servidor (opcional).

4. **Realizar auditorías de seguridad** periódicamente.

## Solución de Problemas Comunes

### El servidor no arranca después de un reinicio

Verifica que PM2 esté configurado para iniciar automáticamente:
```bash
pm2 save
sudo systemctl status pm2-bilop_admin
```

Si no está activo:
```bash
pm2 startup
# Ejecutar el comando que PM2 te indica
```

### Problemas de conexión a la base de datos

Verifica la configuración de PostgreSQL:
```bash
sudo -u postgres psql -c "SELECT 1;"
```

Revisa el archivo pg_hba.conf:
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

### El frontend no puede conectar con el backend

Verifica que la variable de entorno NEXT_PUBLIC_API_URL esté configurada correctamente en el frontend.

---

Con esta guía, deberías poder desplegar exitosamente la aplicación Bilop en tu servidor de Digital Ocean. Si encuentras algún problema específico, revisa los logs de la aplicación y del servidor para identificar y resolver los errores.
