# ADR-001 - Comunicación mediante WhatsApp

## Estado

Aceptado

## Fecha

2026-07-09

## Contexto

SrPipa es un catálogo digital para un comercio físico. El objetivo principal es facilitar la comunicación entre clientes y el local sin desarrollar una plataforma completa de comercio electrónico.

## Decisión

La comunicación entre el cliente y el comercio se realizará mediante WhatsApp.

El sistema utilizará un carrito de consulta que permitirá seleccionar productos y generar un mensaje para enviar al comercio.

No se implementará un sistema de compra online ni una pasarela de pago.

## Motivos

- Reducir la complejidad del proyecto.
- Aprovechar una herramienta conocida por los usuarios.
- Evitar costos adicionales.
- Facilitar la implementación inicial.
- Mantener el foco del proyecto en un catálogo digital.

## Consecuencias

### Positivas

- Menor complejidad.
- Menor costo de mantenimiento.
- Experiencia simple para el usuario.
- Desarrollo más rápido.

### Negativas

- La compra no se completa desde la aplicación.
- El trabajador debe responder las consultas recibidas.
