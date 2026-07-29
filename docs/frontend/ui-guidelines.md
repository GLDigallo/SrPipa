# Guías de Interfaz - SrPipa

## 1. Diseño general

### Paleta de colores
- Primario: #25D366 (verde WhatsApp)
- Secundario: #128C7E (verde oscuro)
- Fondo: #ffffff
- Texto: #333333
- Error: #dc3545
- Éxito: #28a745
- Advertencia: #ffc107

### Tipografía
- Fuente: sistema (system-ui, -apple-system, sans-serif)
- Títulos: bold, tamaños responsivos
- Cuerpo: regular, 16px base

### Espaciado
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px

---

## 2. Componentes del catálogo

### Header
- Fijo en la parte superior
- Contiene: logo SrPipa (centrado), botón WhatsApp, botón carrito
- Ocupa el menor espacio posible
- Responsive: se adapta a mobile

### Carrusel de categorías
- Ubicación: lateral inferior izquierdo
- Formato: lista vertical con imágenes pequeñas (40x40)
- Al seleccionar: filtra productos sin recargar página
- En dispositivos antiguos: versión estática sin animaciones
- Ocultamiento automático tras inactividad configurable

### Tarjeta de producto (Card)
- Imagen principal (elemento más grande)
- Nombre del producto
- Precio formateado como moneda local
- Badge de disponibilidad
- Botón "Agregar al carrito"
- Efecto hover: elevación suave (translateY -4px)

### Grid de productos
- Responsive: auto-fill con mínimo 280px
- Mobile: minimum 240px
- Sin recarga de página al cambiar categoría

### Barra de búsqueda
- Input full-width
- Búsqueda instantánea (sin botón)
- Actualiza resultados mientras el usuario escribe

### Carrito de consulta
- Panel fijo en lateral derecho (320px)
- Lista productos seleccionados
- Botón "Enviar por WhatsApp" (deshabilitado cuando está vacío)
- Mobile: full-width
- Horario: deshabilitado fuera del horario comercial

---

## 3. Componentes del panel administrativo

### Principios
- Simplicidad por encima de la cantidad de funciones
- Cualquier trabajador debe poder aprenderlo en pocos minutos
- Regla de los 30 segundos: encontrar y editar cualquier producto en <30s
- Botones grandes y claramente identificados
- Iconografía fácil de reconocer
- Mensajes simples y confirmaciones claras

### Login
- Card centrado (max 400px)
- Campos: usuario, contraseña
- Botón de envío full-width
- Mensajes de error claros

### Dashboard
- Grid de estadísticas (mínimo 200px por tarjeta)
- Métricas: total productos, disponibles, sin stock, ocultos
- Barra de navegación: Resumen, Productos, Categorías, Cerrar sesión

### Gestión de productos
- Tabla de datos con 5 columnas: Nombre, Precio, Categoría, Estado, Acciones
- Buscador visible en todo momento (búsqueda dinámica)
- Botón "+ Nuevo Producto"
- Badges de estado con colores: DISPONIBLE (verde), SIN_STOCK (amarillo), OCULTO (gris), ARCHIVADO (rojo)
- Responsive: oculta columnas 3-4 en mobile

### Gestión de categorías
- Grid de tarjetas (mínimo 280px)
- Muestra: nombre, orden, badge activo/inactivo
- Acciones: Editar, Eliminar
- Botones full-width en pie de tarjeta

---

## 4. Responsive Design

### Breakpoints (estándar)
- Mobile S: <480px
- Mobile L / Landscape: 481–767px
- Tablet: 768–1023px
- Desktop: 1024–1199px
- Desktop L: ≥1200px

### Comportamiento
- Header: se adapta, mantiene elementos visibles
- Grid de productos: columnas fijas por rango (2 en mobile S, 3 en mobile L/tablet, 3 en desktop, 4 en desktop L)
- Panel de admin: tabla oculta columnas secundarias
- Carrito: full-width en mobile
- Carrusel: se adapta al espacio disponible

### Reglas de positioning
- Elementos con `position: fixed` o `position: absolute` + `z-index` NO deben compensarse con padding/margin en el flujo del documento
- El `z-index` maneja el apilamiento visual; el flujo del documento maneja el layout
- No reservar espacio (padding/margin) para elementos que flotan por encima del contenido

---

## 5. Accesibilidad

- Texto alternativo en todas las imágenes (alt)
- Labels visibles en todos los inputs
- Contraste mínimo 4.5:1
- Navegación completa con teclado
- Roles ARIA cuando sea necesario
- Imágenes ampliadas priorizan accesibilidad visual
