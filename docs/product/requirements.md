# Requisitos Funcionales - SrPipa

## 1. Objetivo del sistema

SrPipa es el catálogo digital oficial del comercio.

Su objetivo es permitir que los clientes consulten de forma rápida, sencilla y visualmente agradable todos los productos disponibles desde cualquier dispositivo.

El sistema no funcionará como una tienda online.

No procesará pagos.

No gestionará envíos.

Su finalidad será facilitar la consulta del catálogo y la comunicación con el comercio mediante WhatsApp.

---

## 2. Tipos de usuarios

El sistema tendrá dos perfiles de usuario.

### Cliente

El cliente podrá:

- navegar por todas las categorías;
- buscar productos;
- utilizar filtros;
- ampliar imágenes;
- consultar precios;
- comunicarse con el comercio mediante WhatsApp.

No necesitará registrarse.

No tendrá inicio de sesión.

---

### Trabajador

El trabajador administrará el catálogo.

Podrá:

- iniciar sesión;
- agregar productos;
- modificar productos;
- actualizar precios;
- actualizar imágenes;
- ocultar productos;
- reactivar productos;
- administrar categorías.

El acceso al panel administrativo no será visible para los clientes.

El ingreso se realizará mediante una dirección específica proporcionada únicamente al personal autorizado.

---

## 3. Catálogo de productos

El catálogo será la funcionalidad principal del sistema.

Toda la navegación del cliente estará basada en la exploración de categorías y productos.

### Presentación de productos

Cada producto deberá mostrarse mediante una tarjeta (Card) con el siguiente contenido mínimo:

- imagen del producto;
- nombre;
- precio;
- disponibilidad.

La tarjeta deberá mantener un diseño limpio, moderno y consistente en todas las categorías.

---

### Imagen del producto

La imagen será el elemento principal de cada tarjeta.

Al seleccionarla deberá abrirse una vista ampliada para facilitar la visualización del producto.

La ampliación deberá priorizar la accesibilidad para personas con dificultades visuales.

No deberá perder calidad innecesariamente ni ocultar información importante.

---

### Información del producto

Cada producto tendrá como mínimo:

- nombre;
- precio;
- categoría;
- imagen;
- estado (disponible u oculto).

En futuras versiones podrán incorporarse nuevos datos sin modificar la estructura general del catálogo.

---

### Organización

Los productos deberán agruparse por categorías.

Cada categoría tendrá su propia vista dentro del catálogo.

La navegación entre categorías deberá ser rápida y visualmente fluida.

---

### Búsqueda

El usuario podrá buscar productos mediante un buscador.

La búsqueda deberá actualizar los resultados de forma inmediata sin necesidad de recargar la página.

---

### Filtros

Cada categoría podrá tener filtros propios.

Los filtros deberán adaptarse al tipo de productos que contenga la categoría.

El sistema deberá permitir agregar nuevos filtros en el futuro sin modificar la arquitectura del proyecto.

---

### Disponibilidad

Cuando un producto se quede sin stock deberá dejar de mostrarse automáticamente en el catálogo público.

No deberá eliminarse de la base de datos.

El trabajador podrá volver a habilitarlo cuando exista stock nuevamente.

---

## 4. Navegación

La navegación deberá ser simple, intuitiva y requerir la menor cantidad posible de acciones por parte del usuario.

Toda la interfaz deberá priorizar el acceso rápido al catálogo.

No deberán utilizarse menús complejos ni elementos que distraigan al usuario de los productos.

### Cabecera

La cabecera deberá mantenerse siempre visible.

Estará compuesta por:

- nombre del comercio centrado;
- botón de contacto mediante WhatsApp;
- botón del carrito de consulta.

La cabecera deberá ocupar el menor espacio posible para maximizar el área destinada al catálogo.

---

### Nombre del comercio

El nombre "SrPipa" será el elemento principal de la cabecera.

Deberá ser claramente visible desde cualquier dispositivo.

---

### Contacto

El sistema permitirá contactar al comercio mediante WhatsApp.

El botón deberá abrir directamente una conversación utilizando el número configurado por el administrador.

No deberá requerirse ninguna integración paga.

---

### Carrito de consulta

El usuario podrá agregar productos al carrito.

El carrito no representará una compra online.

Su función será generar una lista de productos de interés para enviarla al comercio mediante WhatsApp.

El trabajador continuará administrando la venta de manera tradicional.

---

### Horario de atención

El carrito únicamente estará disponible durante los horarios configurados por el administrador.

Fuera del horario comercial el sistema deberá:

- impedir el envío de consultas;
- informar claramente que el comercio se encuentra cerrado;
- indicar el horario habitual de atención.

Esta funcionalidad deberá ejecutarse automáticamente sin intervención del trabajador.

---

### Carrusel de categorías

La navegación entre categorías se realizará mediante un carrusel ubicado en la parte inferior izquierda de la pantalla.

El carrusel deberá ocupar poco espacio y no interferir con la visualización del catálogo.

Cada elemento del carrusel representará una categoría del comercio.

Al seleccionar una categoría, el catálogo deberá actualizarse mediante una transición suave.

No deberá recargarse la página completa.

---

### Adaptación al dispositivo

El sistema deberá detectar automáticamente la capacidad del dispositivo.

En dispositivos modernos el carrusel podrá utilizar efectos tridimensionales y animaciones avanzadas.

En dispositivos de menor capacidad deberá utilizar una versión estática y liviana que garantice un funcionamiento fluido.

La funcionalidad será la misma independientemente del efecto visual utilizado.

---

### Ocultamiento automático

Después de un período configurable de inactividad, el carrusel deberá reducirse automáticamente para liberar espacio visual.

Deberá permanecer visible un indicador discreto que permita al usuario volver a expandirlo mediante un clic o un toque.

La transición deberá ser suave y no interrumpir la navegación.

---

## 5. Panel de administración

El sistema dispondrá de un panel de administración destinado exclusivamente al personal autorizado.

El acceso al panel no deberá encontrarse visible desde el catálogo público.

La dirección del panel será conocida únicamente por el administrador y los trabajadores autorizados.

---

### Principios de diseño del panel administrativo

El panel administrativo deberá priorizar la simplicidad por encima de la cantidad de funciones visibles.

El sistema estará diseñado para que cualquier trabajador pueda aprender a utilizarlo en pocos minutos, incluso sin experiencia previa con herramientas informáticas.

Toda acción frecuente deberá poder realizarse con la menor cantidad posible de pasos.

La interfaz deberá reducir la posibilidad de errores mediante un diseño claro y consistente.

Se deberá evitar:

- menús complejos;
- opciones ocultas innecesariamente;
- pantallas con exceso de información;
- formularios extensos;
- terminología técnica.

Se deberá priorizar:

- botones grandes y claramente identificados;
- iconografía fácil de reconocer;
- mensajes simples;
- confirmaciones claras;
- navegación intuitiva;
- consistencia visual en todas las pantallas.

El trabajador nunca deberá preguntarse qué hace un botón o dónde encontrar una función.

La interfaz deberá guiar naturalmente al usuario durante cada tarea.

---

### Inicio de sesión

El acceso requerirá autenticación.

Solo los usuarios autorizados podrán ingresar.

Toda acción realizada dentro del panel deberá ejecutarse con los permisos correspondientes.

---

### Administración de productos

El trabajador deberá poder:

- agregar productos;
- modificar productos;
- actualizar imágenes;
- actualizar precios;
- cambiar categorías;
- ocultar productos;
- volver a publicar productos.

Todas estas acciones deberán realizarse desde una interfaz sencilla e intuitiva.

---

### Carga de productos

La carga de un producto deberá requerir la menor cantidad posible de pasos.

Como mínimo deberá permitir ingresar:

- imagen;
- nombre;
- precio;
- categoría.

En futuras versiones podrán incorporarse nuevos campos sin modificar el funcionamiento general del sistema.

---

### Estado del producto

Cada producto tendrá un estado.

Como mínimo existirán los siguientes:

- Disponible
- Oculto
- Sin stock
- Archivado

Cuando un producto se marque como "Sin stock", dejará de mostrarse automáticamente en el catálogo público.

No deberá eliminarse de la base de datos.

---

### Búsqueda y filtros

El panel deberá disponer de un buscador de productos visible en todo momento.

La búsqueda deberá realizarse de forma dinámica mientras el trabajador escribe.

Además del buscador, el sistema deberá permitir filtrar los productos por:

- categoría;
- estado;
- nombre.

El objetivo será localizar cualquier producto rápidamente incluso cuando el catálogo contenga cientos o miles de artículos.

---

### Filosofía del panel administrativo

El objetivo del panel no es ofrecer la mayor cantidad de funciones posible.

El objetivo es permitir que el trabajador realice su trabajo diario de la forma más rápida, simple y segura posible.

Siempre que existan dos soluciones funcionalmente equivalentes, deberá elegirse la más sencilla de comprender y utilizar.

---

### Regla de los 30 segundos

Un trabajador que ya conozca el sistema deberá poder encontrar cualquier producto y comenzar a editarlo en menos de treinta segundos.

Si una funcionalidad requiere más tiempo o genera dudas durante su uso, deberá replantearse el diseño de la interfaz.

---

### Regla de la simplicidad

El panel administrativo deberá estar diseñado para usuarios con poca experiencia en tecnología.

Siempre que existan varias soluciones técnicamente válidas, deberá implementarse la que resulte más sencilla de comprender y utilizar.

La simplicidad tendrá prioridad sobre la incorporación de funciones que aumenten innecesariamente la complejidad de la interfaz.

El sistema deberá minimizar la curva de aprendizaje para cualquier trabajador.

---

### Consistencia de la interfaz

Todas las pantallas del panel administrativo deberán mantener una estructura visual uniforme.

Los botones, iconos, colores, formularios y acciones deberán conservar la misma ubicación y comportamiento en todo el sistema.

Una misma acción deberá ejecutarse siempre de la misma manera independientemente de la sección donde se encuentre el trabajador.

El objetivo será reducir la curva de aprendizaje y minimizar errores durante el uso cotidiano.

---

### Productividad del trabajador

El panel administrativo deberá optimizar el tiempo de trabajo.

Las tareas más frecuentes deberán poder realizarse con la menor cantidad posible de clics.

El sistema deberá priorizar la rapidez de operación sin sacrificar claridad ni seguridad.

Siempre que sea posible deberán evitarse pasos innecesarios.

---

### Buscador inteligente

El buscador del panel deberá permanecer visible en todo momento.

La búsqueda deberá realizarse dinámicamente mientras el trabajador escribe.

El sistema deberá permitir localizar productos utilizando parcialmente el nombre.

Cuando existan múltiples coincidencias, los resultados deberán mostrarse ordenados y actualizarse automáticamente.

---

### Panel resumido

Al ingresar al panel administrativo, el trabajador visualizará un resumen general del estado del catálogo.

Como mínimo deberá mostrarse:

- cantidad total de productos;
- productos disponibles;
- productos sin stock;
- productos ocultos.

El objetivo será ofrecer una visión rápida del estado general del comercio.

---

### Flujo de carga de productos

Luego de crear correctamente un producto, el sistema deberá permitir al trabajador:

- agregar otro producto;
- volver al listado;
- continuar editando el producto recientemente creado.

El objetivo será agilizar la carga masiva de mercadería.

---

### Eliminación de productos

Los productos no deberán eliminarse físicamente de la base de datos salvo decisión expresa del administrador.

Siempre que sea posible se utilizará el ocultamiento o la desactivación del producto.

Esta decisión permitirá conservar el historial del catálogo y facilitar futuras reactivaciones.

---

## 6. Mensajes del sistema

El sistema deberá informar al usuario el resultado de todas las acciones importantes mediante mensajes claros y fáciles de comprender.

Los mensajes deberán utilizar un lenguaje simple, evitando terminología técnica.

Como mínimo existirán los siguientes tipos de mensajes:

- confirmación;
- información;
- advertencia;
- error.

Toda acción importante deberá informar claramente si fue realizada correctamente o si ocurrió algún inconveniente.

Cuando exista un error, el sistema deberá explicar el problema y, cuando sea posible, indicar cómo solucionarlo.

Los mensajes deberán mantener un formato visual uniforme en toda la aplicación.

---

## 7. Evolución del sistema

El sistema deberá diseñarse para permitir la incorporación de nuevas funcionalidades sin afectar las existentes.

Toda nueva característica deberá respetar los principios definidos en este documento.

La evolución del proyecto deberá priorizar la mantenibilidad, la simplicidad y la experiencia de uso tanto para clientes como para trabajadores.
