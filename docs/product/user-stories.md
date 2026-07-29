# Historias de Usuario - SrPipa

## Cliente (Catálogo Público)

### US-C01: Ver catálogo de productos
**Como** cliente
**Quiero** ver los productos disponibles del comercio
**Para** conocer la oferta antes de comunicarme

**Criterios de aceptación:**
- Los productos se muestran en tarjetas con imagen, nombre, precio y disponibilidad
- Solo se muestran productos con estado DISPONIBLE
- Los productos se agrupan por categoría

---

### US-C02: Navegar por categorías
**Como** cliente
**Quiero** navegar entre las categorías del comercio
**Para** encontrar rápidamente el tipo de producto que me interesa

**Criterios de aceptación:**
- Existe un carrusel/sidebar de categorías visible
- Al seleccionar una categoría, los productos se filtran sin recargar la página
- Las categorías inactivas no se muestran

---

### US-C03: Buscar productos
**Como** cliente
**Quiero** buscar productos por nombre
**Para** encontrar rápidamente lo que busco

**Criterios de aceptación:**
- Existe un buscador visible en todo momento
- La búsqueda es instantánea mientras escribo
- Se muestran resultados que coinciden parcial o totalmente

---

### US-C04: Ampliar imagen de producto
**Como** cliente
**Quiero** ampliar la imagen de un producto
**Para** ver detalles visuales del producto

**Criterios de aceptación:**
- Al hacer clic en la imagen se abre una vista ampliada
- La imagen mantiene buena calidad
- Se puede cerrar la vista ampliada fácilmente

---

### US-C05: Agregar productos al carrito de consulta
**Como** cliente
**Quiero** agregar productos a una lista de interés
**Para** enviarlos al comercio por WhatsApp

**Criterios de aceptación:**
- Cada tarjeta tiene un botón "Agregar al carrito"
- El carrito muestra la cantidad de productos seleccionados
- Se pueden agregar múltiples productos

---

### US-C06: Enviar consulta por WhatsApp
**Como** cliente
**Quiero** enviar mi lista de productos al comercio por WhatsApp
**Para** obtener información o realizar un pedido

**Criterios de aceptación:**
- El botón "Enviar por WhatsApp" genera un mensaje con los productos seleccionados
- Se abre WhatsApp con el mensaje prearmado
- El botón está deshabilitado si el carrito está vacío
- Fuera del horario comercial, se informa que el comercio está cerrado

---

### US-C07: Contactar al comercio por WhatsApp
**Como** cliente
**Quiero** contactar al comercio directamente por WhatsApp
**Para** hacer consultas generales

**Criterios de aceptación:**
- Existe un botón de WhatsApp en el header
- Al hacer clic se abre WhatsApp con el número del comercio

---

## Trabajador (Panel Administrativo)

### US-T01: Iniciar sesión
**Como** trabajador
**Quiero** iniciar sesión en el panel administrativo
**Para** administrar el catálogo

**Criterios de aceptación:**
- El formulario solicita usuario y contraseña
- Las credenciales correctas redirigen al dashboard
- Las credenciales incorrectas muestran un mensaje de error
- La sesión se mantiene mientras el trabajador esté activo

---

### US-T02: Ver dashboard con resumen
**Como** trabajador
**Quiero** ver un resumen del estado del catálogo
**Para** conocer rápidamente la situación actual

**Criterios de aceptación:**
- Se muestra: total productos, disponibles, sin stock, ocultos
- Los datos se actualizan al acceder al dashboard

---

### US-T03: Listar productos
**Como** trabajador
**Quiero** ver todos los productos del catálogo
**Para** gestionar el inventario

**Criterios de aceptación:**
- Se muestra una tabla con: nombre, precio, categoría, estado, acciones
- Existe un buscador que filtra mientras escribo
- Se puede filtrar por categoría y estado

---

### US-T04: Crear un producto
**Como** trabajador
**Quiero** agregar un nuevo producto al catálogo
**Para** mantener el inventario actualizado

**Criterios de aceptación:**
- El formulario solicita: imagen, nombre, precio, categoría
- El producto se crea con estado DISPONIBLE por defecto
- Después de crear, puedo: crear otro, volver al listado, o editar el creado

---

### US-T05: Editar un producto
**Como** trabajador
**Quiero** modificar los datos de un producto
**Para** corregir errores o actualizar información

**Criterios de aceptación:**
- Se pueden modificar: nombre, precio, categoría, imagen, estado
- Los cambios se reflejan inmediatamente en el catálogo público

---

### US-T06: Cambiar estado de un producto
**Como** trabajador
**Quiero** ocultar o reactivar productos
**Para** gestionar la disponibilidad

**Criterios de aceptación:**
- Se puede cambiar entre: DISPONIBLE, OCULTO, SIN_STOCK, ARCHIVADO
- Un producto SIN_STOCK deja de mostrarse en el catálogo público
- No se elimina el producto de la base de datos

---

### US-T07: Eliminar un producto
**Como** trabajador
**Quiero** eliminar un producto del catálogo
**Para** quitar productos que ya no se ofrecen

**Criterios de aceptación:**
- Se solicita confirmación antes de eliminar
- El producto se elimina permanentemente de la base de datos
- Se recomienda usar ocultamiento en vez de eliminación

---

### US-T08: Gestionar categorías
**Como** trabajador
**Quiero** crear, editar y eliminar categorías
**Para** organizar los productos

**Criterios de aceptación:**
- Se pueden crear categorías con nombre, descripción e imagen
- Se pueden editar categorías existentes
- Se pueden eliminar categorías (verificando que no tengan productos)
- El orden de las categorías es configurable

---

### US-T09: Buscar productos en el panel
**Como** trabajador
**Quiero** buscar productos rápidamente desde el panel
**Para** localizar cualquier producto en segundos

**Criterios de aceptación:**
- El buscador está visible en todo momento
- La búsqueda se realiza dinámicamente
- Se permite buscar por nombre parcial
- Regla de los 30 segundos: encontrar y editar cualquier producto en <30s
