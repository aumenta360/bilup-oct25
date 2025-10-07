# Notas de Lanzamiento: BILOP Project v1.0.0

## Resumen de cambios

Esta versión representa una reestructuración significativa del proyecto, unificando el frontend y mejorando los scripts de despliegue para garantizar un proceso de implementación más robusto en entornos de producción.

### 🔄 Migración de Frontend

- **Migrado desde `bilop-admin-front-v2` a `bilop-admin-front`**: Se ha consolidado el código frontend en un único repositorio para simplificar el mantenimiento y desarrollo.
- **Migrados todos los componentes importantes**: Todos los componentes de UI, servicios y páginas se han transferido correctamente.
- **Actualizado `package.json`**: Nombre del proyecto actualizado y añadidas dependencias faltantes:
  - `@radix-ui/react-toast`
  - `date-fns`
  - `recharts` 
  - `sonner`

### ⚙️ Mejoras de Configuración

- **Corregido `next.config.js`**: Añadido soporte para resolver correctamente los aliases `@/` en importaciones.
- **Actualizado `config.env.local`**: Configurado para utilizar la URL de API de producción.
- **Creado `.gitignore` en la raíz**: Para ignorar archivos innecesarios y mantener el repositorio limpio.

### 🚀 Mejoras en el Despliegue

- **Actualizado script `deploy.sh`**:
  - Modificado para trabajar con la nueva estructura de directorios
  - Añadida configuración automática de memoria swap (2GB) para prevenir errores OOM durante la compilación
  - Incrementado el límite de memoria para Node.js de 1024MB a 2048MB
  - Mejorados los mensajes informativos durante el proceso de despliegue
  - Añadidas validaciones adicionales para detectar errores temprano

### 🔧 Otros cambios técnicos

- **Componente Toast simplificado**: Implementación más directa que no depende de bibliotecas externas.
- **Consistencia en nombres**: Estandarizados los nombres de proyectos y componentes.
- **Mensajes de error mejorados**: Mejor feedback durante el proceso de despliegue.

## Instrucciones de Despliegue

1. **Clonar el repositorio**:
   ```bash
   git clone [URL-DEL-REPOSITORIO]
   cd bilop-project
   ```

2. **Ejecutar el script de despliegue**:
   ```bash
   sudo bash deploy.sh
   ```

3. **Verificar el despliegue**:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:3001
   - Logs: `pm2 logs`

## Requisitos del Sistema

- Ubuntu 20.04 LTS o superior
- Mínimo 2GB de RAM (4GB recomendado)
- Node.js 18.x
- PostgreSQL 12+
- Nginx

## Notas para desarrolladores

- El archivo `.env.local` debe configurarse con la URL correcta de la API para entornos de desarrollo.
- Para ejecutar en modo desarrollo: `npm run dev` dentro de las carpetas `bilop-admin-front` y `bilop-admin-back`.
- Los componentes de UI siguen el patrón de shadcn/ui y están ubicados en los directorios correspondientes.

## Próximos Pasos

- Implementar pruebas automatizadas
- Optimizar rendimiento para dispositivos móviles
- Añadir soporte para múltiples idiomas
- Mejorar la documentación del código 
