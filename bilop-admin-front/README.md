# Bilop Admin Front

Panel de administración para la aplicación Bilop, una plataforma de fidelización y gestión de tarjetas digitales.

## Descripción de la Aplicación

El panel administrativo de Bilop permite a los administradores gestionar todos los aspectos del programa de fidelización de clientes:

- **Gestión de Tarjetas Digitales**: Creación, edición y seguimiento de tarjetas de fidelidad digitales para los usuarios.
- **Administración de Puntos**: Control de los puntos otorgados a los clientes, historial de transacciones y reglas de acumulación.
- **Gestión de Promociones**: Creación y programación de ofertas especiales, descuentos y beneficios para clientes.
- **Administración de Usuarios**: Panel para gestionar usuarios, permisos y roles dentro del sistema.
- **Sistema de Referidos**: Seguimiento y administración del programa de referidos y sus recompensas.
- **Dashboard Analítico**: Visualización de métricas clave, tendencias y estadísticas de uso.

## Requisitos

- Node.js (v18 o superior)
- npm (v9 o superior)

## Instalación

1. Instala las dependencias:

```bash
npm install
```

2. Crea un archivo `.env.local` basado en `.env.example` y configura las variables necesarias.

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
bilop-admin-front/
├── app/                # Páginas y rutas
│   ├── auth/           # Autenticación (login, recuperación de contraseña)
│   ├── dashboard/      # Vistas principales del panel administrativo
│   ├── cards/          # Gestión de tarjetas digitales
│   ├── users/          # Administración de usuarios
│   ├── promotions/     # Configuración de promociones
│   └── points/         # Gestión del sistema de puntos
├── components/         # Componentes React reutilizables
│   ├── ui/             # Componentes de interfaz básicos
│   ├── forms/          # Componentes de formularios
│   └── dashboard/      # Componentes específicos del dashboard
├── lib/                # Utilidades y configuraciones
├── public/             # Archivos estáticos
└── services/           # Servicios para comunicación con la API
```

## Tecnologías Principales

- Next.js 14: Framework React para renderizado del lado del servidor
- React: Biblioteca para construir interfaces de usuario
- TypeScript: Lenguaje tipado para mejorar la robustez del código
- Tailwind CSS: Framework CSS para diseño responsive
- Shadcn/ui: Componentes UI accesibles y personalizables
