# Bilop Admin Backend

Backend desarrollado en [NestJS](https://nestjs.com/) para la administración completa del sistema Bilop, plataforma de fidelización de clientes y gestión de tarjetas digitales.

## Descripción de la Aplicación

El backend de Bilop proporciona toda la infraestructura API necesaria para soportar las operaciones de la plataforma:

- **Sistema de Autenticación**: Gestión segura de usuarios, roles y permisos con JWT.
- **Gestión de Usuarios**: Registro, modificación y control de usuarios del sistema y clientes.
- **Sistema de Referidos**: API completa para la gestión del programa de referidos, incluyendo seguimiento de invitaciones y recompensas.
- **Administración de Puntos**: Motor para la asignación, canje y gestión de puntos de fidelidad, incluyendo historiales y reglas de negocio.
- **Gestión de Promociones**: Creación y control de campañas promocionales, ofertas especiales y descuentos.
- **Sistema de Tarjetas Digitales**: API para la administración de tarjetas virtuales de fidelización, incluyendo emisión, actualización y seguimiento.
- **Almacenamiento de Archivos**: Gestión de imágenes y archivos relacionados con tarjetas y promociones.

## Requisitos

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL (o el motor que configures en tu `.env`)

## Instalación

1. Clona el repositorio:

   git clone https://github.com/tu-usuario/tu-repo.git
   cd bilop-admin-back

2. Instala las dependencias:

   npm install

3. Configura las variables de entorno:

   - Copia el archivo de ejemplo y edítalo:

     cp config_sql.env .env

   - Ajusta los valores según tu entorno local (base de datos, JWT, etc).

4. Ejecuta las migraciones o seeders si es necesario:

   npm run seed

## Uso en desarrollo

- **Modo desarrollo (con recarga automática):**

  npm run start:dev

- **Compilación para producción:**

  npm run build

- **Ejecución en producción:**

  npm run start:prod

- El servidor estará disponible en: [http://localhost:3000](http://localhost:3000)

## Endpoints principales

| Ruta | Descripción | Operaciones principales |
|------|-------------|-------------------------|
| `/auth` | Autenticación | Login, registro, validación de tokens |
| `/users` | Gestión de usuarios | CRUD de usuarios, asignación de roles |
| `/referrals` | Sistema de referidos | Creación, seguimiento y recompensas de referidos |
| `/points` | Gestión de puntos | Asignación, canje e historial de puntos |
| `/promotions` | Promociones | CRUD de promociones, activación/desactivación |
| `/cards` | Tarjetas digitales | Creación, actualización y seguimiento de tarjetas |

## Estructura del proyecto

```
src/
├── auth/              # Autenticación y seguridad
├── users/             # Gestión de usuarios
├── referrals/         # Sistema de referidos
├── points/            # Gestión de puntos de fidelidad
├── promotions/        # Sistema de promociones
├── cards/             # Administración de tarjetas digitales
├── common/            # Utilidades, decoradores y servicios compartidos
├── types/             # Tipos e interfaces TypeScript
├── main.ts            # Punto de entrada de la aplicación
├── app.module.ts      # Módulo principal
└── server.ts          # Configuración del servidor
```

## Desarrollo y contribución

Para contribuir al proyecto:

1. Crea una rama para tu feature o bugfix
2. Desarrolla tus cambios siguiendo los estándares del proyecto
3. Asegúrate de que los tests pasan correctamente
4. Envía un pull request con tus cambios
