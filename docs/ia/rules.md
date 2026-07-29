# Reglas específicas - SrPipa

## Descripción

SrPipa es un catálogo digital para un comercio físico. Permite a los clientes consultar productos y comunicarse con el comercio mediante WhatsApp.

---

## Arquitectura

Fullstack: Spring Boot (backend) + React (frontend)

### Backend
- Java 21
- Spring Boot 3.4.1
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Maven
- Lombok (obligatorio en entidades)
- Jakarta Validation

### Frontend
- React 18
- Vite 6
- React Router v6
- CSS Modules

---

## Configuración

- Puerto backend: 8080
- Puerto frontend: 5173
- Base de datos: PostgreSQL (sripa)
- Proxy: Vite redirige /api a localhost:8080

---

## Flujo de trabajo

1. Desarrollador expresa una idea
2. Agente implementa
3. Agente ejecuta backend y frontend
4. Agente informa URLs
5. Desarrollador revisa en navegador
6. Desarrollador indica cambios
7. Agente aplica cambios
8. Se repite desde el paso 3

---

## Funcionalidades principales

### Catálogo público
- Navegación por categorías (carrusel con efecto card-stack)
- Tarjetas de producto (imagen + nombre centrado)
- Búsqueda instantánea
- Vista ampliada de productos (modal con imagen + detalles)
- Page de categoría con fondo del color de la categoría seleccionada

### Consulta de productos
- Page independiente (no flotante)
- Lista productos de interés
- Envío por WhatsApp
- Disponible solo en horario comercial

### Panel administrativo
- Autenticación JWT
- CRUD de productos
- Gestión de categorías
- Cambio de estados (disponible, oculto, sin stock, archivado)
- Dashboard con resumen del catálogo

---

## Convenciones del proyecto

### Backend
- Paquete base: com.srpipa
- DTOs como records Java
- Mappers como @Component
- Entidades con Lombok (@Getter @Setter @NoArgsConstructor)
- Servicios con lógica de negocio
- Repositorios con Spring Data JPA
- Controladores REST separados (públicos vs admin)
- Exception handler global

### Frontend
- Componentes en src/components/catalog/ y src/pages/
- CSS Modules para estilos
- Rutas: `/` redirige a `/categoria/1`, `/categoria/:id`, `/consulta`
- Datos de categorías compartidos en src/data/categorias.js

---

## Pendiente

- Integrar frontend con API REST
- Implementar hooks personalizados
- Implementar servicios API
- Proteger rutas admin
- Agregar estados de carga
- Agregar mensajes de error/éxito
