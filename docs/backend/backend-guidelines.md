# Backend Guidelines - SrPipa

## 1. Objetivo

Este documento define las reglas obligatorias para el desarrollo del backend del proyecto SrPipa.

Toda implementación deberá respetar las prácticas modernas de desarrollo y mantener un alto nivel de calidad, seguridad, mantenibilidad y escalabilidad.

El agente deberá seguir estas reglas durante todo el ciclo de vida del proyecto.

---

## 2. Filosofía de desarrollo

El backend deberá priorizar:

- simplicidad;
- claridad;
- mantenibilidad;
- seguridad;
- rendimiento;
- escalabilidad.

Toda implementación deberá resolver el problema con la menor complejidad posible.

El código deberá ser comprensible para cualquier desarrollador que participe en el proyecto.

Las optimizaciones prematuras deberán evitarse salvo que exista una necesidad demostrable.

---

## 3. Tecnologías

Las tecnologías utilizadas deberán mantenerse compatibles entre sí.

El agente deberá utilizar las prácticas oficialmente recomendadas para la versión de cada tecnología utilizada.

No deberán utilizarse APIs obsoletas, funcionalidades deprecadas o patrones desaconsejados por la documentación oficial.

Cuando una tecnología ofrezca varias alternativas válidas, deberá elegirse aquella recomendada oficialmente para la versión utilizada por el proyecto.

Toda nueva dependencia deberá estar previamente aprobada por el desarrollador responsable.

---

## 4. Organización del proyecto

El proyecto deberá organizarse siguiendo una estructura clara, consistente y fácil de mantener.

Cada paquete deberá representar una única responsabilidad dentro del sistema.

La organización del proyecto deberá facilitar la localización de cualquier componente por parte de los desarrolladores.

El agente deberá mantener la estructura definida y evitar reorganizaciones innecesarias.

Toda nueva funcionalidad deberá integrarse respetando la organización existente.

---

### Separación de responsabilidades

Cada clase deberá cumplir una única responsabilidad claramente definida.

No deberán mezclarse responsabilidades de presentación, lógica de negocio y acceso a datos dentro de una misma clase.

La lógica de negocio pertenecerá exclusivamente a la capa de servicios.

El acceso a datos pertenecerá exclusivamente a la capa de persistencia.

---

### Cohesión

Las clases que pertenezcan a un mismo módulo deberán estar relacionadas funcionalmente.

Se deberá evitar crear paquetes que agrupen clases sin una relación clara entre sí.

---

### Acoplamiento

Los componentes deberán mantener el menor nivel posible de dependencia entre sí.

Las modificaciones realizadas en un módulo deberán afectar al mínimo posible el resto del sistema.

Se deberá favorecer el uso de abstracciones cuando aporten beneficios reales al proyecto.

---

### Reutilización

Antes de implementar una nueva funcionalidad, el agente deberá verificar si existe una solución reutilizable dentro del proyecto.

La reutilización no deberá reducir la claridad del código.

No se permitirá duplicar lógica de negocio cuando pueda centralizarse correctamente.

---

### Consistencia

Toda nueva implementación deberá mantener el mismo estilo utilizado en el resto del proyecto.

Se respetarán las convenciones de nombres, organización y estructura establecidas en esta documentación.

El proyecto deberá mantener una apariencia uniforme durante toda su evolución.

---

## 5. Convenciones de código

Todo el código deberá seguir una convención uniforme para facilitar la lectura, el mantenimiento y la colaboración entre desarrolladores.

Las convenciones definidas en este documento serán obligatorias para todo el proyecto.

### Nombres de paquetes

Los nombres de los paquetes deberán escribirse completamente en minúsculas.

No deberán utilizarse abreviaturas innecesarias.

Los nombres deberán describir claramente su responsabilidad.

---

### Nombres de clases

Las clases utilizarán PascalCase.

El nombre deberá describir claramente su responsabilidad.

Se evitarán nombres genéricos como:

- Manager
- Helper
- Utility
- Common
- Process
- Data

excepto cuando exista una justificación arquitectónica.

---

### Nombres de interfaces

Las interfaces deberán representar comportamientos.

No deberán utilizar prefijos innecesarios como:

IProductoService

Se utilizarán nombres naturales como:

ProductoService

La implementación concreta utilizará un nombre descriptivo.

---

### Nombres de métodos

Los métodos deberán expresar claramente la acción que realizan.

Se utilizarán verbos descriptivos.

Ejemplos:

- crearProducto()
- actualizarPrecio()
- buscarPorNombre()
- ocultarProducto()

No deberán utilizarse nombres ambiguos como:

- process()
- execute()
- data()
- test()

---

### Nombres de variables

Las variables deberán tener nombres descriptivos.

Se evitarán abreviaturas difíciles de comprender.

El nombre deberá reflejar claramente el contenido almacenado.

---

### Constantes

Las constantes utilizarán letras mayúsculas separadas por guiones bajos.

Ejemplo:

MAX_PRODUCTOS

HORARIO_APERTURA

---

### Visibilidad

Toda clase, método o atributo deberá utilizar el nivel de acceso más restrictivo posible.

Se priorizará el uso de private.

Solo deberá utilizarse public cuando resulte estrictamente necesario.

---

### Uso de final

Siempre que una referencia no deba modificarse, deberá declararse como final.

El uso de final deberá favorecer la inmutabilidad del código.

---

### Uso de var

El uso de var solo estará permitido cuando mejore claramente la legibilidad.

No deberá utilizarse cuando dificulte comprender el tipo de dato utilizado.

---

### Métodos

Cada método deberá realizar una única tarea.

Los métodos deberán mantenerse pequeños, fáciles de leer y fáciles de probar.

Se evitarán métodos excesivamente largos o con múltiples niveles de anidación.

---

### Clases

Cada clase deberá tener una única responsabilidad.

Se evitarán clases excesivamente grandes que concentren múltiples responsabilidades.

Cuando una clase crezca demasiado deberá dividirse en componentes más pequeños.

---

### Comentarios

El código deberá ser suficientemente claro para minimizar la necesidad de comentarios.

Los comentarios deberán explicar el motivo de una decisión y no describir lo que ya resulta evidente leyendo el código.

No deberán mantenerse comentarios obsoletos.
