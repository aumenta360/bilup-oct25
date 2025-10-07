# Instrucciones para limpiar el caché del navegador

Si después de realizar los cambios sigues viendo el logo antiguo en las pestañas del navegador, sigue estos pasos para forzar la actualización de los íconos:

## Chrome

1. Presiona Ctrl+Shift+Delete (Windows/Linux) o Cmd+Shift+Delete (Mac)
2. Selecciona un rango de tiempo como "Última hora" o "Todo"
3. Marca la casilla "Imágenes y archivos en caché"
4. Haz clic en "Borrar datos"
5. Cierra todas las pestañas de Chrome y vuelve a abrir la aplicación

## Firefox

1. Presiona Ctrl+Shift+Delete (Windows/Linux) o Cmd+Shift+Delete (Mac)
2. Selecciona "Todo" en el rango de tiempo
3. Marca la casilla "Caché"
4. Haz clic en "Limpiar ahora"
5. Cierra y vuelve a abrir Firefox

## Edge

1. Presiona Ctrl+Shift+Delete
2. Selecciona "Todo el tiempo" en el rango
3. Marca "Imágenes y archivos almacenados en caché"
4. Haz clic en "Borrar ahora"
5. Reinicia Edge

## Safari

1. Ve a Preferencias -> Avanzado
2. Marca "Mostrar menú Desarrollo en la barra de menús"
3. Cierra Preferencias
4. En el menú Desarrollo, selecciona "Vaciar cachés"
5. También puedes presionar Opción+Cmd+E

## Solución alternativa para desarrolladores

Si estás ejecutando la aplicación en modo desarrollo, intenta estos pasos:

1. Abre las herramientas de desarrollador (F12)
2. Haz clic derecho en el botón de actualizar y selecciona "Vaciar caché y recargar forzada"
3. Comprueba si el favicon se ha actualizado

## Actualización manual del favicon

Si nada de lo anterior funciona, puedes intentar cambiar manualmente la URL del favicon agregando un parámetro de consulta para forzar la recarga:

1. Edita el archivo `layout.tsx`
2. Cambia todas las referencias a `bilop-logo.svg?v=2` a `bilop-logo.svg?v=3` (incrementa el número)
3. Reconstruye la aplicación
4. Recarga la página
