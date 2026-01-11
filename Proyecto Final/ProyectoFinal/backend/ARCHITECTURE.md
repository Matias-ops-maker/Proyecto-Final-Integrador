# Resumen Arquitectónico

Este documento resume la arquitectura del backend, las decisiones de diseño principales y muestra diagramas sencillos (capas y flujos) para facilitar la comprensión del proyecto.

**Contexto**: el backend está implementado en Node.js (ESM) con Express y Sequelize. La carpeta principal del código relevante es `src/`.

## Capas principales

- **`routes`**: definición de endpoints y mapeo a controladores.
- **`controllers`**: orquestación de petición → validación mínima → llamada a `services`.
- **`services`**: lógica de negocio central (ya extraída de controladores).
- **`models`**: entidades Sequelize que representan persistencia.
- **`clients` / `factories`**: adaptadores y fábricas para proveedores externos (p. ej. pasarela de pago).
- **`dtos` / `validators`**: transformaciones y validaciones centralizadas.
- **`errors` / `helpers`**: manejo unificado de errores y utilidades (p. ej. `AppError`, `errorHandler`).

### Diagrama de capas (simplificado)

```
Client (browser/mobile)
    |
    v
  [Routes] --> [Controllers] --> [Services] --> [Models (DB)]
                        \-> [Factories/Clients (external services)]
                        \-> [DTOs / Validators]
                        \-> [Helpers / ErrorHandler]
```

### Archivos/ubicaciones clave (backend)

- `src/controllers/*` : controladores por recurso (productos, pagos, carritos, usuarios, etc.)
- `src/services/*` : servicios que contienen la lógica de negocio
- `src/factories/paymentFactory.js` : fábricas para crear clientes de pago
- `src/clients/*` : `MercadoPagoClient.js`, `FakePaymentClient.js`
- `src/dtos/PaymentPreferenceDTO.js` : DTO para preferencia de pago
- `src/errors/AppError.js` y `src/errors/errorHandler.js` : manejo de errores centralizado

## Decisiones clave y justificación

### Separación de responsabilidades (Services)

Los controladores delegan lógica a `services/` para mantener controladores finos (responsabilidad de orquestación). Esto mejora testabilidad y facilita aplicar SOLID.

### Factory Pattern para clientes externos

`PaymentFactory.create()` permite intercambiar el proveedor de pagos (MercadoPago vs Fake) mediante `process.env.PAYMENT_PROVIDER`. Beneficios:
- Facilita testing (mock/fake) y despliegues multi-proveedor.
- Desacopla la lógica de negocio del proveedor concreto.

### DTO / Builder para transformación

`PaymentPreferenceDTO` centraliza la normalización/transformación de la estructura esperada por el proveedor de pagos, evitando lógica distribuida en servicios o controladores.

### Manejo de errores centralizado

`AppError` y `errorHandler` estandarizan respuestas de error (código, mensaje, detalles) y simplifican la trazabilidad en logs y respuesta al cliente.

### Autenticación

El proyecto usa JWT (ver `src/middlewares/auth.js`) para sesiones sin estado. Justificación:
- Escalable para APIs RESTful.
- Compatible con microservicios y clientes SPAs.
- Recomendación: usar tokens de acceso de corta duración + refresh tokens si se requiere sesión más larga.

### Pagos

Se abstrae en `services/paymentService.js` que usa `PaymentFactory` y `PaymentPreferenceDTO`.
- Strategy/Factory facilita cambiar a otro proveedor.
- Webhooks deben validarse y normalizarse en `paymentService.handleWebhook`.

### Storage / Base de datos

Sequelize es la capa ORM; la configuración permite MySQL/SQLite según entorno (`src/config/db.js`). Justificación:
- ORM facilita migraciones, modelos y relaciones.
- Recomendación: en producción usar RDS/MySQL y backups automatizados; para pruebas usar SQLite o bases de datos en memoria.

## Flujos de datos

### Flujo de pago (secuencia simplificada)

```
Cliente -> POST /payments (controller)
  controller -> PaymentService.createPayment(payload)
    PaymentService -> new PaymentPreferenceDTO(payload)
    PaymentService -> PaymentFactory.create() -> paymentClient
    paymentClient.createPreference(dto.toProvider()) -> proveedor (MercadoPago / Fake)
    proveedor -> retorna URL/preference -> service -> controller -> responde al cliente
```

### Flujo de autenticación (simplificado)

```
Cliente -> POST /auth/login (controller)
  controller -> AuthService.authenticate(credentials)
    AuthService -> valida credenciales con `models/User`
    AuthService -> genera JWT (payload mínimo: userId, roles)
  controller -> responde con token
Middleware `auth` valida JWT y expone `req.user`.
```

## Recomendaciones prácticas

- Revisar `lint-staged` para evitar ejecutar `npm test` completo en cada `pre-commit` (puede ser lento); en su lugar ejecutar tests rápidos o mover tests a `pre-push` o CI.
- Añadir workflow de CI (`.github/workflows/ci.yml`) que corra `npm ci`, `npm run lint` y `npm run test` en cada push/PR.
- Generar diagrama más detallado (PlantUML o mermaid) si se necesita para la presentación.
- Añadir matriz de responsabilidad (qué hace cada servicio) si el equipo lo requiere.

## Referencias

- Archivo: `Proyecto Final/ProyectoFinal/backend/ARCHITECTURE.md`
- Para actualizar: editar este archivo y crear PR siguiendo la estrategia de ramas (`feature/`, `develop`, `hotfix/`).
