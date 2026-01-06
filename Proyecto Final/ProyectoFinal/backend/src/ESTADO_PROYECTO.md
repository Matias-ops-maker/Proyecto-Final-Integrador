# ESTADO DEL PROYECTO – Correcciones Técnicas

## Integrante A – Patrones de diseño, Automatización y Documentación

Este documento describe las **decisiones técnicas**, **patrones aplicados** y **refactors realizados** para cumplir con las correcciones solicitadas.

---

## 1. Arquitectura general

El backend sigue una arquitectura en capas:

```
Routes → Controllers → Services → (DTO / Factory / Adapter) → DB / APIs externas
```

* **Routes**: definen endpoints HTTP
* **Controllers**: orquestan request/response, sin lógica de negocio
* **Services**: contienen la lógica de negocio
* **Factories / Clients / Adapters**: encapsulan dependencias externas
* **DTOs**: centralizan transformación y estructura de datos
* **Error Handler**: unifica manejo de errores

---

## 2. Patrones de diseño aplicados

### ✅ Service Layer

Se extrajo la lógica de negocio desde los controladores hacia `services/`.

Ejemplo:

* `paymentController.js` solo valida input y delega
* `paymentService.js` contiene reglas de negocio

**Beneficios**:

* Código más testeable
* Controllers livianos
* Separación clara de responsabilidades

---

### ✅ Factory Pattern

Se implementó un **Factory** para instanciar clientes de pago:

```js
PaymentFactory.create()
```

Según variable de entorno:

* `mercadopago`
* `fake` (testing / desarrollo)

**Beneficios**:

* Permite cambiar proveedor sin modificar servicios
* Facilita mocking y tests

---

### ✅ Adapter Pattern

Se creó un adapter para MercadoPago:

* `MercadoPagoAdapter`
* Aísla la SDK externa
* Evita acoplar el dominio a la librería

**Beneficios**:

* Bajo acoplamiento
* Mayor control ante cambios de SDK

---

### ✅ DTO (Data Transfer Object)

Se centralizó la transformación de datos de pago usando un DTO:

* `PaymentPreferenceDTO`

Responsabilidades:

* Definir estructura válida hacia el proveedor
* Forzar campos controlados por backend
* Evitar duplicación de lógica

**Beneficios**:

* Datos consistentes
* Lógica de mapeo en un solo lugar

---

### ✅ Error Handler global

Se implementó un manejo de errores unificado:

* `AppError`
* `errorHandler` middleware

Características:

* Respuestas consistentes
* Códigos de error claros
* Separación entre errores de negocio y errores internos

Ejemplo de respuesta:

```json
{
  "success": false,
  "error": {
    "code": "NO_ITEMS",
    "message": "El pago debe contener al menos un item"
  }
}
```

---

## 3. Flujo de pago (ejemplo)

```
POST /api/payments/create
  → Controller
    → valida input
    → Service.createPayment()
      → PaymentPreferenceDTO
      → PaymentFactory
        → MercadoPagoClient
          → MercadoPagoAdapter
```

---

## 4. Decisiones técnicas clave

### Autenticación

* JWT con middleware `verifyToken`

### Pagos

* MercadoPago como proveedor principal
* Factory permite cambiar proveedor

### Manejo de errores

* Todos los errores pasan por middleware global

---

## 5. Automatización (estado)

* [ ] Script `npm run validate` (pendiente)
* [ ] Husky + lint-staged (pendiente)
* [ ] GitHub Actions (opcional, pendiente)

---

## 6. Estado general de correcciones

* ✅ Service Layer
* ✅ Factory
* ✅ Adapter
* ✅ DTO
* ✅ Error Handler
* ⏳ Automatización (pendiente)
* ⏳ Diagramas formales (opcional)

---

## 7. Conclusión

El proyecto fue refactorizado siguiendo buenas prácticas de arquitectura backend, priorizando:

* Bajo acoplamiento
* Alta cohesión
* Escalabilidad
* Mantenibilidad

Las decisiones tomadas permiten extender el sistema sin impacto en las capas superiores.
