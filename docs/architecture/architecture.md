# Arquitectura del Proyecto - SrPipa

## 1. Objetivos de la arquitectura

La arquitectura del proyecto deberá priorizar la mantenibilidad, la seguridad, la simplicidad y la escalabilidad.

Toda decisión técnica deberá facilitar la evolución del sistema sin comprometer la estabilidad del código existente.

La arquitectura deberá permitir que nuevos desarrolladores puedan comprender rápidamente la estructura del proyecto.

El sistema deberá mantenerse modular para facilitar futuras ampliaciones.

---

## 2. Principios arquitectónicos

Toda implementación deberá respetar los siguientes principios:

- separación de responsabilidades;
- bajo acoplamiento;
- alta cohesión;
- código reutilizable;
- simplicidad;
- mantenibilidad;
- escalabilidad;
- seguridad desde el diseño;
- facilidad para realizar pruebas.

Cuando existan varias soluciones posibles, deberá elegirse la que ofrezca mayor claridad y menor complejidad.

La arquitectura nunca deberá crecer innecesariamente.

---

## 3. Arquitectura general

El sistema utilizará una arquitectura en capas.

Cada capa tendrá una única responsabilidad claramente definida.

Ninguna capa podrá acceder directamente a responsabilidades que no le correspondan.

Toda comunicación deberá realizarse respetando el flujo definido por la arquitectura.

La lógica de negocio deberá permanecer completamente aislada de la interfaz de usuario y del acceso a datos.

---

## 4. Organización del proyecto

El proyecto deberá organizarse por responsabilidades claramente separadas.

Cada módulo deberá tener una única responsabilidad.

La estructura del proyecto deberá facilitar la localización de cualquier componente por parte de los desarrolladores.

El agente deberá evitar estructuras que mezclen responsabilidades o dificulten el mantenimiento.

La organización del código deberá mantenerse consistente durante toda la vida del proyecto.

---

## 5. Comunicación entre capas

Toda solicitud del cliente deberá seguir un único flujo de ejecución.

La comunicación entre capas deberá respetar el siguiente orden:

Cliente

↓

Frontend

↓

API REST

↓

Controller

↓

Service

↓

Repository

↓

Base de datos

Cada capa únicamente podrá comunicarse con la capa inmediatamente inferior.

No deberán existir accesos directos que omitan capas de la arquitectura.

Toda la lógica de negocio deberá implementarse exclusivamente dentro de la capa de servicios.

---

## 6. Responsabilidades de cada capa

### Frontend

Responsable de la interacción con el usuario.

No deberá contener lógica de negocio.

Será responsable únicamente de presentar información y enviar solicitudes al backend.

---

### API REST

Será el punto de entrada de todas las solicitudes externas.

Toda comunicación entre frontend y backend deberá realizarse mediante la API.

No deberá contener lógica de negocio.

---

### Controller

Recibirá las solicitudes del cliente.

Validará la información mínima necesaria.

Delegará toda la lógica de negocio a la capa de servicios.

No accederá directamente a la base de datos.

---

### Service

Será el núcleo de la aplicación.

Toda la lógica de negocio deberá implementarse exclusivamente en esta capa.

Será responsable de coordinar las operaciones necesarias para cumplir cada caso de uso.

---

### Repository

Será responsable exclusivamente del acceso a los datos.

No deberá contener lógica de negocio.

Su única responsabilidad será consultar y persistir información.

---

### Base de datos

Será responsable únicamente del almacenamiento de información.

No deberá utilizarse para implementar lógica de negocio que pertenezca a la aplicación.

---

## Seguridad arquitectónica

La seguridad deberá considerarse desde el diseño inicial del sistema y no como una funcionalidad agregada posteriormente.

Toda comunicación entre componentes deberá respetar la arquitectura definida.

El acceso a funcionalidades protegidas deberá estar controlado mediante mecanismos de autenticación y autorización.

Cada componente tendrá acceso únicamente a los recursos necesarios para cumplir su responsabilidad.

La arquitectura deberá aplicar el principio de mínimo privilegio, minimizando la superficie de ataque del sistema.

La lógica de seguridad deberá permanecer centralizada y ser fácilmente mantenible.

Ningún componente deberá exponer información sensible innecesariamente.

La protección de datos y el control de accesos deberán formar parte del diseño de todas las funcionalidades del sistema.

---

## 7. Gestión de dependencias

Las dependencias entre módulos deberán mantenerse al mínimo necesario.

Cada componente dependerá únicamente de las capas inmediatamente inferiores definidas por la arquitectura.

Se deberá evitar el acoplamiento innecesario entre módulos.

Las dependencias deberán facilitar la mantenibilidad, las pruebas y la evolución del sistema.

Cuando sea posible, los componentes dependerán de abstracciones antes que de implementaciones concretas.

---

## 8. Manejo de errores

La arquitectura deberá establecer un mecanismo uniforme para el tratamiento de errores.

Todos los errores deberán gestionarse de forma centralizada.

La aplicación no deberá exponer información sensible al usuario final.

Los errores deberán registrarse adecuadamente para facilitar el mantenimiento y el diagnóstico.

La experiencia del usuario deberá mantenerse consistente independientemente del tipo de error ocurrido.

---

## 9. Seguridad arquitectónica

La seguridad deberá formar parte del diseño del sistema desde el inicio del proyecto.

Todas las funcionalidades protegidas deberán requerir autenticación y autorización cuando corresponda.

La arquitectura deberá aplicar el principio de mínimo privilegio.

Cada componente únicamente podrá acceder a los recursos necesarios para cumplir su responsabilidad.

Toda comunicación entre componentes deberá respetar la arquitectura definida.

Ningún componente deberá exponer información sensible innecesariamente.

La lógica de seguridad deberá permanecer centralizada para facilitar su mantenimiento y auditoría.

---

## 10. Escalabilidad

La arquitectura deberá permitir incorporar nuevas funcionalidades sin modificar significativamente la estructura existente.

Los módulos deberán diseñarse para crecer de forma independiente siempre que sea posible.

Las nuevas funcionalidades deberán integrarse respetando las responsabilidades ya definidas.

Se deberá evitar generar dependencias innecesarias que dificulten la evolución del proyecto.

---

## 11. Rendimiento

La arquitectura deberá priorizar un uso eficiente de los recursos disponibles.

Se evitarán operaciones innecesarias, duplicación de procesos y consultas redundantes.

Las decisiones relacionadas con el rendimiento no deberán comprometer la claridad del código ni la mantenibilidad del sistema.

Las optimizaciones prematuras deberán evitarse salvo que exista una necesidad claramente justificada.

---

## 12. Observabilidad

La arquitectura deberá facilitar el monitoreo y el diagnóstico del sistema.

Los eventos importantes deberán poder registrarse mediante mecanismos centralizados de logging.

La información registrada deberá facilitar la detección de errores y el análisis del comportamiento de la aplicación.

Los mecanismos de observabilidad no deberán exponer información sensible.

---

## 13. Restricciones arquitectónicas

El agente deberá respetar la arquitectura definida durante todo el ciclo de vida del proyecto.

No podrá modificar la estructura arquitectónica sin autorización expresa del desarrollador.

No deberá incorporar nuevas tecnologías, patrones de diseño o dependencias que no hayan sido previamente aprobados.

Toda propuesta de modificación arquitectónica deberá justificar claramente sus beneficios, riesgos e impacto sobre el proyecto.

La arquitectura deberá mantenerse consistente durante toda la evolución del sistema.

---

## 14. Decisiones arquitectónicas

Las decisiones arquitectónicas relevantes deberán documentarse mediante registros de decisión de arquitectura (Architecture Decision Records - ADR).

Cada ADR deberá explicar:

- el problema identificado;
- el contexto de la decisión;
- las alternativas consideradas;
- la decisión adoptada;
- las consecuencias positivas y negativas.

El objetivo será conservar el razonamiento detrás de las decisiones importantes del proyecto y facilitar su mantenimiento a largo plazo.

Las decisiones arquitectónicas no deberán modificarse sin una nueva evaluación y su correspondiente ADR.
