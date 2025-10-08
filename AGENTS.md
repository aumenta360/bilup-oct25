# Instrucciones para agentes del repositorio Bilop

Estas pautas aplican a todo el repositorio salvo que exista un `AGENTS.md` más específico en subdirectorios.

## Flujo de trabajo general
- Trabaja siempre en ramas específicas por feature o bugfix.
- Antes de proponer cambios, revisa los `README.md` y la documentación de la carpeta afectada.
- Sigue la guía de PR del proyecto: incluye un resumen claro de los cambios y detalla las pruebas ejecutadas. Usa lenguaje en español.

## Estándares de commits
- Utiliza el formato **Conventional Commits**. Ejemplos válidos: `feat: agrega pantalla de promociones`, `fix: corrige validación de puntos`.
- Agrupa cambios relacionados en un solo commit cuando sea posible.

## Lineamientos de código
- Mantén la base de código en TypeScript cuando aplique. Evita introducir JavaScript sin tipado.
- Documenta funciones complejas con comentarios JSDoc/TypeDoc.
- Prefiere nombres descriptivos en español para componentes de UI y en inglés para funciones utilitarias o APIs, siguiendo el estilo existente.

### Frontend (`bilop-admin-front`)
- Framework: Next.js 14 con el directorio `app`. Respeta la separación entre Server Components y Client Components; añade la directiva `"use client"` solo cuando sea necesario.
- Reutiliza componentes de `components/ui` (basados en shadcn/ui) antes de crear nuevos. Si necesitas uno nuevo, documenta las variantes y estados en el mismo archivo.
- Para estilos utiliza Tailwind CSS. No agregues hojas CSS globales salvo que sea imprescindible.
- Al consumir servicios, centraliza la lógica en `services/` o `lib/` según corresponda. Evita llamadas directas a `fetch` dentro de componentes de presentación.
- Ejecuta `npm run lint` y las pruebas relevantes (`npm run test` si existen) después de modificar el frontend.

### Backend (`bilop-admin-back`)
- Framework: NestJS. Usa decoradores y patrones oficiales (providers, modules, controllers, services).
- Ubica DTOs en `src/**/dto` y aplica validaciones con `class-validator` y `class-transformer`.
- Mantén las entidades y esquemas sincronizados con las migraciones. Documenta cualquier cambio de base de datos en el README o en migraciones dedicadas.
- Ejecuta `npm run lint` y `npm run test` al modificar el backend.

## Pruebas y calidad
- Incluye o actualiza pruebas unitarias e2e según el módulo afectado.
- Si agregas scripts o comandos nuevos, documenta su uso en el README correspondiente.

## Mensajes de Pull Request
- Resume en español los cambios principales con viñetas.
- Indica las pruebas ejecutadas con el comando utilizado.
- Añade notas de despliegue o migraciones si son necesarias.
