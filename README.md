INTEGRANTES:

Sandoval Sirimarco, Lautaro Agustin [Lautaro.Sandoval98@gmail.com]

Aispuro, Francisco [aispurofrancisco2003@gmail.com]

Perez Daniele, Matias Sebastian [matiasperezdaniele@gmail.com]

# 🚗 RepuestosAuto - Sistema Completo de E-Commerce
## 📋 Descripción del Proyecto

RepuestosAuto es un sistema completo de e-commerce especializado en repuestos automotrices, desarrollado con arquitectura full-stack moderna. **Todas las compras quedan registradas correctamente en la base de datos



## ✨ Estado del Proyecto: **COMPLETAMENTE FUNCIONAL** 



### 🎯 **Características Principales**



- **🔐 Autenticación Completa**: Sistema de login/registro con JWT y roles de usuario- 

- **🛒 Carrito de Compras**: Funcional con persistencia y sincronización-
- **💳 Checkout Completo**: Procesamiento real de pedidos en base de datos
- **💰 Integración MercadoPago**: Pasarela de pagos real con tarjetas de crédito/débito-
- **📊 Panel Admin**: CRUD completo de productos, categorías y marcas-
- **📈 Reportes**: Generación automática de PDF y Excel
- **👤 Gestión de Usuarios**: Perfiles con historial de compras real
- **🔍 Búsqueda Inteligente**: Barra de búsqueda con sugerencias en tiempo real
- **⚙️ Configuración de Perfil**: Cambio de email y contraseña funcional
- **📱 Responsive**: Completamente adaptado a móviles
- **🎨 UI/UX Mejorada**: Mejor legibilidad y contraste en textos


## 🆕 **Nuevas Características Implementadas**


### 💰 Integración Completa con MercadoPago### 🔍 Sistema de Búsqueda Mejorado

- **Pasarela de pagos real**: Procesamiento de pagos con tarjetas de crédito y débito- **Sugerencias en tiempo real**: La barra de búsqueda muestra sugerencias mientras escribes

- **Ambiente sandbox**: Configurado para pruebas seguras con tarjetas de prueba- **Búsqueda inteligente**: Busca por nombre, marca, categoría y descripción

- **Webhooks**: Confirmación automática de pagos en tiempo real- **Ordenamiento por relevancia**: Los resultados se ordenan por relevancia cuando hay una búsqueda activa

- **Estados de pago**: Seguimiento completo del estado de cada transacción- **Navegación automática**: Al seleccionar una sugerencia o buscar, navega automáticamente al catálogo

- **Páginas de resultado**: Confirmación de pago exitoso, pendiente o fallido

- **Redirección automática**: Vuelta al sitio después del pago### ⚙️ Gestión de Perfil Completa

- **SDK React**: Componentes de MercadoPago integrados en el frontend- **Cambio de contraseña**: Funcionalidad completa con validaciones de seguridad

- **Tarjetas de prueba**: - **Cambio de email**: Actualización de email con confirmación

  - Visa: `4509953566233704`- **Validaciones robustas**: Sistema de validaciones frontend y backend

  - Mastercard: `5031755734530604`- **Mensajes informativos**: Feedback visual para todas las operaciones

  - CVV: `123`, Fecha: cualquier fecha futura- **Persistencia de datos**: Todos los cambios se guardan en la base de datos



### 🔍 Sistema de Búsqueda Mejorado### � Mejoras de Usabilidad

- **Sugerencias en tiempo real**: La barra de búsqueda muestra sugerencias mientras escribes- **Mejor legibilidad**: Colores de texto mejorados para mejor contraste

- **Búsqueda inteligente**: Busca por nombre, marca, categoría y descripción- **Textos más oscuros**: Reemplazo de grises claros por colores más legibles

- **Ordenamiento por relevancia**: Los resultados se ordenan por relevancia cuando hay una búsqueda activa- **Feedback visual**: Mensajes de éxito y error claros

- **Navegación automática**: Al seleccionar una sugerencia o buscar, navega automáticamente al catálogo- **Formularios mejorados**: Mejor UX en formularios de configuración



### 🎨 Diseño del Catálogo Renovado## 🚀 INICIALIZACIÓN RÁPIDA

- **Layout de dos columnas**: Filtros en sidebar lateral, productos en grid principal

- **Diseño responsivo**: Adaptación perfecta a diferentes tamaños de pantalla### Credenciales de Acceso

- **CSS modular**: Archivo separado (catalogo-new.css) para mejor mantenimiento

- **Mejor UX**: Distribución más intuitiva y visualmente atractiva- **Backend API**: http://localhost:4000   DB_PASS=contraseña



### ⚙️ Gestión de Perfil Completa**Administrador:**

- **Cambio de contraseña**: Funcionalidad completa con validaciones de seguridad

- **Cambio de email**: Actualización de email con confirmación- Email: `admin@repuestos.com`

- **Validaciones robustas**: Sistema de validaciones frontend y backend

- **Mensajes informativos**: Feedback visual para todas las operaciones- Password: `admin123`

- **Persistencia de datos**: Todos los cambios se guardan en la base de datos

### Credenciales de Acceso### Backend   DB_HOST=localhost

### 🛠️ Mejoras de Usabilidad

- **Mejor legibilidad**: Colores de texto mejorados para mejor contraste**Usuario de Prueba:**

- **Textos más oscuros**: Reemplazo de grises claros por colores más legibles

- **Feedback visual**: Mensajes de éxito y error claros- Email: `juan@gmail.com`**Administrador:**

- **Formularios mejorados**: Mejor UX en formularios de configuración

- Password: `user123`

## 🚀 INICIALIZACIÓN RÁPIDA

- Email: `admin@repuestos.com`- **Node.js** + **Express.js**   ```

### 1. 🔧 Configuración Inicial

## 🚀 **Tecnologías Utilizadas**

#### Variables de Entorno

Crear archivo `.env` en el backend con:- Password: `admin123`

```env

JWT_SECRET=tu_jwt_secret_aqui### Backend

DB_HOST=localhost

DB_USER=root- **Node.js** + **Express.js**- **SQLite** con **Sequelize ORM**

DB_PASS=tu_contraseña

DB_NAME=repuestos_auto- **SQLite** con **Sequelize ORM**

MP_ACCESS_TOKEN=tu_access_token_de_mercadopago

MP_PUBLIC_KEY=tu_public_key_de_mercadopago- **JWT** para autenticación**Usuario de Prueba:**

```

- **bcryptjs** para hash de contraseñas

#### Para MercadoPago (Ambiente Sandbox)

1. Registrarse en [MercadoPago Developers](https://www.mercadopago.com.ar/developers/)- **PDFKit** y **ExcelJS** para reportes- Email: `juan@gmail.com`- **JWT** para autenticación2. Ejecuta el script de migración:

2. Crear una aplicación

3. Obtener las credenciales de prueba (sandbox)- **CORS** configurado

4. Configurar en el archivo `.env`

- Password: `user123`

### 2. 🎬 Iniciar Proyecto

### Frontend

```bash

# Opción 1: Inicio automático (recomendado)- **React 18** con **Vite**- **bcryptjs** para hash de contraseñas   ```

.\INICIAR_PROYECTO_COMPLETO.bat

- **React Router** para navegación

# Opción 2: Inicio manual

.\start-backend.bat- **CSS3** personalizado## 📦 Funcionalidades Completadas

.\start-frontend.bat

```- **API REST** integrada



### 3. 🌱 Poblar Base de Datos- **CORS** configurado   node src/migrate.js



```bash## 📦 Funcionalidades Completadas

cd Desktop\ProyectoFinal\backend

npm run seed### ✅ Sistema de Compras (100% Funcional)

```

### ✅ Sistema de Compras (100% Funcional)

### 4. 🌐 Acceder a la Aplicación

- **Carrito de Compras**: Agregar/eliminar productos- **Carrito de Compras**: Agregar/eliminar productos- **PDFKit** y **ExcelJS** para reportes   ```

- **Frontend**: http://localhost:5173

- **Backend API**: http://localhost:4000- **Checkout Completo**: Formulario de datos y pago



### Credenciales de Acceso- **Registro en BD**: Todas las órdenes se guardan automáticamente- **Checkout Completo**: Formulario de datos y pago



**Administrador:**- **Actualización de Stock**: Stock se actualiza tras cada compra

- Email: `admin@repuestos.com`

- Password: `admin123`- **Historial de Compras**: Visible en el perfil del usuario- **Registro en BD**: Todas las órdenes se guardan automáticamente



**Usuario de Prueba:**

- Email: `juan@gmail.com`

- Password: `user123`### ✅ Panel de Administración (100% Funcional)- **Actualización de Stock**: Stock se actualiza tras cada compra



## 🚀 **Tecnologías Utilizadas**- **Dashboard**: Estadísticas en tiempo real



### Backend- **Gestión de Productos**: CRUD completo- **Historial de Compras**: Visible en el perfil del usuario### FrontendEsto creará todas las tablas y relaciones necesarias en la base de datos.

- **Node.js** + **Express.js**

- **SQLite** con **Sequelize ORM**- **Gestión de Categorías**: Administración completa

- **JWT** para autenticación

- **bcryptjs** para hash de contraseñas- **Gestión de Marcas**: Control total- **React 18** con **Vite**

- **PDFKit** y **ExcelJS** para reportes

- **MercadoPago SDK** para pagos- **Gestión de Órdenes**: Visualización y cambio de estados

- **CORS** configurado

- **Reportes Descargables**: PDF y Excel automáticos### ✅ Panel de Administración (100% Funcional)- **React Router** para navegación

### Frontend

- **React 18** con **Vite**

- **React Router** para navegación

- **CSS3** personalizado### ✅ Sistema de Usuarios (100% Funcional)- **Dashboard**: Estadísticas en tiempo real- **CSS3** personalizado

- **API REST** integrada

- **MercadoPago SDK React** para componentes de pago- **Registro/Login**: Con validación completa



## 📦 Funcionalidades Completadas- **Perfiles de Usuario**: Datos personales editables- **Gestión de Productos**: CRUD completo- **API REST** integrada



### ✅ Sistema de Compras (100% Funcional)- **Historial Real**: Órdenes conectadas a base de datos

- **Carrito de Compras**: Agregar/eliminar productos con persistencia

- **Checkout Completo**: Formulario de datos y procesamiento de pago- **Roles y Permisos**: Admin y usuario estándar- **Gestión de Categorías**: Administración completa

- **Integración MercadoPago**: Pagos reales con tarjetas de crédito/débito

- **Registro en BD**: Todas las órdenes se guardan automáticamente

- **Actualización de Stock**: Stock se actualiza tras cada compra

- **Historial de Compras**: Visible en el perfil del usuario### ✅ Catálogo de Productos (100% Funcional)- **Gestión de Marcas**: Control total## 👥 **Integrantes del Proyecto**

- **Estados de Pago**: Seguimiento completo de transacciones

- **40 Productos Reales**: Con imágenes de Unsplash

### ✅ Panel de Administración (100% Funcional)

- **Dashboard**: Estadísticas en tiempo real- **Filtros Avanzados**: Por categoría, marca y precio- **Reportes Descargables**: PDF y Excel funcionando

- **Gestión de Productos**: CRUD completo con imágenes

- **Gestión de Categorías**: Administración completa- **Búsqueda Inteligente**: Por nombre y descripción

- **Gestión de Marcas**: Control total

- **Gestión de Órdenes**: Visualización y cambio de estados- **Paginación**: Navegación optimizada- **Gestión de Órdenes**: Seguimiento de pedidos- **Sandoval Sirimarco, Lautaro Agustin** - [Lautaro.Sandoval98@gmail.com]

- **Reportes Descargables**: PDF y Excel automáticos



### ✅ Sistema de Usuarios (100% Funcional)

- **Registro/Login**: Con validación completa y JWT## 📊 Base de Datos- **Aispuro, Francisco** - [aispurofrancisco2003@gmail.com]

- **Perfiles de Usuario**: Datos personales editables

- **Historial Real**: Órdenes conectadas a base de datos

- **Roles y Permisos**: Admin y usuario estándar

- **Cambio de Contraseña**: Sistema seguro de actualización### Estructura Completa### ✅ Catálogo y Frontend (100% Funcional)- **Perez Daniele, Matias Sebastian** - [matiasperezdaniele@gmail.com]

- **Gestión de Email**: Cambio de email con validaciones

- **Usuarios**: Con autenticación y roles

### ✅ Catálogo de Productos (100% Funcional)

- **40+ Productos Reales**: Con imágenes de alta calidad- **Productos**: 40 items con stock real- **40 Productos**: Base de datos completa con imágenes reales

- **Filtros Avanzados**: Por categoría, marca y precio

- **Búsqueda Inteligente**: Por nombre, descripción y marca- **Categorías**: Motor, Frenos, Suspensión, etc.

- **Diseño Responsivo**: Layout de dos columnas optimizado

- **Paginación**: Navegación eficiente por productos- **Marcas**: Bosch, NGK, Monroe, etc.- **6 Categorías**: Organizadas por tipo de repuesto## 📋 **Instalación y Ejecución**

- **Sugerencias**: Búsqueda con autocompletado

- **Órdenes**: Registro completo de compras

## 💳 **Flujo de Pago con MercadoPago**

- **Items de Orden**: Detalles de cada compra- **Búsqueda y Filtros**: Sistema de navegación avanzado

### 1. Proceso de Compra

1. **Agregar productos** al carrito desde el catálogo

2. **Revisar carrito** y ajustar cantidades

3. **Proceder al checkout** completando datos personales### Datos Iniciales- **Diseño Responsivo**: Funciona en desktop y móvil### Prerrequisitos

4. **Seleccionar método de pago** (tarjeta de crédito/débito)

5. **Completar pago** en la plataforma de MercadoPago- ✅ 40 productos con imágenes reales

6. **Confirmación automática** y redirección al sitio

7. **Orden guardada** en base de datos con estado actualizado- ✅ 8 categorías organizadas- **Autenticación**: Sistema completo con JWT- Node.js v18+ 



### 2. Tarjetas de Prueba (Sandbox)- ✅ 6 marcas reconocidas

```

Visa:       4509 9535 6623 3704- ✅ Usuario administrador configurado- npm o yarn

Mastercard: 5031 7557 3453 0604

CVV:        123

Fecha:      Cualquier fecha futura

```## 🔧 API Endpoints## 🗂️ Estructura de Datos



### 3. Estados de Pago

- **approved**: Pago aprobado

- **pending**: Pago pendiente### Autenticación### 🔧 Instalación

- **rejected**: Pago rechazado

- **in_process**: Pago en proceso- `POST /api/auth/register` - Registro de usuarios



## 🔧 **Endpoints de MercadoPago**- `POST /api/auth/login` - Inicio de sesión### Base de Datos Poblada



### Backend API

- `POST /api/payments/create` - Crear preferencia de pago

- `POST /api/payments/webhook` - Webhook de confirmación### Productos- **40 Productos** con precios e imágenes reales1. **Clonar el repositorio**

- `GET /api/payments/:id/status` - Consultar estado de pago

- `GET /api/products` - Listar productos

### Configuración de Webhooks

```javascript- `POST /api/products` - Crear producto (admin)- **6 Categorías** principales (Motor, Frenos, Filtros, etc.)```bash

// URL del webhook para notificaciones

https://tu-dominio.com/api/payments/webhook- `PUT /api/products/:id` - Actualizar producto (admin)



// Eventos configurados- `DELETE /api/products/:id` - Eliminar producto (admin)- **20+ Marcas** reconocidas (Bosch, NGK, Castrol, etc.)git clone https://github.com/Matias-ops-maker/Front-Back-borrador-TUP.git

- payment.created

- payment.updated

```

### Órdenes- **Usuarios de prueba** con diferentes rolescd Front-Back-borrador-TUP-2

## 👥 **Integrantes del Proyecto**

- `POST /api/orders` - Crear nueva orden

- **Matías** - Full Stack Developer

- **Desarrollo completo** del sistema e-commerce- `GET /api/orders` - Listar órdenes del usuario- **Sistema de órdenes** completamente implementado```

- **Integración** de todas las funcionalidades

- **Testing** y optimización- `GET /api/orders/:id` - Detalle de orden



## 📞 **Soporte y Contacto**



Para soporte técnico o consultas sobre el proyecto:### Reportes

- 📧 Email: support@repuestosauto.com

- 🐛 Issues: GitHub Issues- `GET /api/reports/sales/pdf` - Descargar reporte PDF## 🔍 Fallas Encontradas y Corregidas2. **Instalar dependencias del Backend**

- 📱 Demo: http://localhost:5173

- `GET /api/reports/sales/xlsx` - Descargar reporte Excel

## 🔧 **Comandos de Desarrollo**

```bash

### Backend

```bash## 🛡️ Seguridad Implementada

cd Desktop\ProyectoFinal\backend

npm install          # Instalar dependencias### ❌ Problemas Identificados:cd Desktop/ProyectoFinal/backend

npm start            # Iniciar servidor

npm run seed         # Poblar base de datos- **API Key**: `mi_api_key_super_secreta`

npm run migrate      # Ejecutar migraciones

```- **JWT Tokens**: Para sesiones seguras1. **Checkout desconectado**: El checkout solo simulaba comprasnpm install



### Frontend- **Hashing de Contraseñas**: bcryptjs

```bash

cd Desktop\ProyectoFinal\frontend- **Validación de Roles**: Admin vs Usuario2. **Perfil con datos estáticos**: No cargaba órdenes reales```

npm install          # Instalar dependencias

npm run dev          # Modo desarrollo- **CORS Configurado**: Origen específico

npm run build        # Build para producción

npm run preview      # Preview del build3. **Reportes sin datos**: Downloads no funcionaban

```

## 🚀 Mejoras Implementadas

## 🎯 **Próximas Mejoras**

3. **Instalar dependencias del Frontend**

- [ ] Notificaciones en tiempo real

- [ ] Chat de soporte en vivo### ✅ Correcciones Críticas Realizadas

- [ ] Sistema de reseñas y calificaciones

- [ ] Integración con otros métodos de pago- **Endpoint Checkout**: Corregido de `/cart/add` a `/cart/items`### ✅ Soluciones Implementadas:```bash

- [ ] App móvil nativa

- [ ] Sistema de descuentos y cupones- **Registro de Compras**: 100% funcional en base de datos



---- **Reportes**: Descarga inmediata de PDF y Excel1. **Checkout conectado al backend**: Órdenes se crean en BDcd ../frontend



## 🏆 **Estado Final: PROYECTO COMPLETAMENTE FUNCIONAL**- **Stock**: Actualización automática tras compras



✅ **Sistema de E-commerce 100% operativo**  - **Perfiles**: Datos reales de órdenes del usuario2. **Perfil con datos reales**: Carga órdenes desde APInpm install

✅ **Integración MercadoPago funcional**  

✅ **Base de datos poblada y configurada**  

✅ **Frontend y Backend sincronizados**  

✅ **Todas las funcionalidades probadas**  ### ✅ Optimizaciones3. **Reportes funcionales**: PDFs y Excel se descargan correctamente```



**¡Listo para producción!** 🚀- **Puerto Estándar**: Frontend en 5173 (correcto)

- **Conexión Backend**: API completamente estable4. **Sistema de órdenes completo**: Flujo completo de compra

- **Manejo de Errores**: Respuestas consistentes

- **UI/UX**: Interfaz pulida y profesional### 🎬 Ejecución



## 🎯 Testing Completado## 📊 Flujo de Compra Verificado



### ✅ Flujos Verificados1. **Iniciar el Backend** (Puerto 4000)

1. **Registro de Usuario** → ✅ Funcional

2. **Login/Logout** → ✅ Funcional  1. **Usuario navega catálogo** → ✅ Funcionando```bash

3. **Navegación del Catálogo** → ✅ Funcional

4. **Agregar al Carrito** → ✅ Funcional2. **Agrega productos al carrito** → ✅ Funcionando  cd Desktop/ProyectoFinal/backend

5. **Proceso de Checkout** → ✅ Funcional

6. **Confirmación de Compra** → ✅ Funcional3. **Procede al checkout** → ✅ Funcionandonpm start

7. **Panel de Administración** → ✅ Funcional

8. **Generación de Reportes** → ✅ Funcional4. **Completa datos de entrega** → ✅ Funcionando```



## 👥 **Integrantes del Proyecto**5. **Selecciona método de pago** → ✅ Funcionando



- **Sandoval Sirimarco, Lautaro Agustin** - [Lautaro.Sandoval98@gmail.com]6. **Procesa la orden** → ✅ **SE REGISTRA EN BD** 2. **Iniciar el Frontend** (Puerto 5173)

- **Aispuro, Francisco** - [aispurofrancisco2003@gmail.com]

7. **Actualiza stock automáticamente** → ✅ Funcionando```bash

## 📄 Licencia

8. **Muestra confirmación** → ✅ Funcionandocd Desktop/ProyectoFinal/frontend

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

9. **Aparece en historial de usuario** → ✅ Funcionandonpm run dev

---

10. **Visible para admin en panel** → ✅ Funcionando```

**🎉 Proyecto Finalizado y Completamente Funcional 🎉**



*Desarrollado con ❤️ para la materia Tecnicatura Universitaria en Programación*
## 🛠️ Tecnologías Utilizadas3. **Acceder a la aplicación**

- Frontend: `http://localhost:5173`

### Backend- Backend API: `http://localhost:4000/api`

- Node.js + Express.js

- SQLite + Sequelize ORM## 🔑 **Credenciales de Prueba**

- JWT + bcrypt para seguridad

- PDFKit + ExcelJS para reportes```

Email: admin@repuestos.com

### Frontend  Password: admin123

- React 18 + Vite```

- React Router v6

- Axios para API calls## 📁 **Estructura del Proyecto**

- CSS responsivo

```

## 🎯 Estado Final del ProyectoDesktop/ProyectoFinal/

├── backend/

### 🎉 PROYECTO 100% COMPLETADO│   ├── src/

│   │   ├── controllers/     # Controladores de la API

**✅ Todas las funcionalidades solicitadas están implementadas:**│   │   ├── models/         # Modelos de Sequelize

│   │   ├── routes/         # Rutas de la API

1. **✅ Sistema de compras con registro en BD**│   │   ├── middlewares/    # Middlewares de autenticación

2. **✅ Panel de administración completo** │   │   └── config/         # Configuración de BD

3. **✅ Todos los botones funcionan correctamente**│   ├── package.json

4. **✅ Descargas de reportes operativas**│   └── README.md

5. **✅ Base de datos con 40 productos**└── frontend/

6. **✅ Interfaz responsiva y profesional**    ├── src/

7. **✅ Sistema de autenticación robusto**    │   ├── components/     # Componentes React

8. **✅ Gestión de categorías y marcas**    │   ├── pages/         # Páginas de la aplicación

    │   ├── styles/        # Estilos CSS

### 🚨 Importante    │   └── api.js         # Configuración de API

- **TODAS LAS COMPRAS QUEDAN REGISTRADAS** en la base de datos    ├── package.json

- **NO HAY SIMULACIONES** - todo es funcional y real    └── README.md

- **STOCK SE ACTUALIZA** automáticamente tras cada compra```

- **HISTORIAL COMPLETO** disponible para usuarios y admin

## 🛠 **Funcionalidades Implementadas**

## 📞 Uso del Sistema

### ✅ **Sistema de Autenticación**

1. **Ejecutar**: `INICIAR_PROYECTO_COMPLETO.bat`- Registro de usuarios con validación

2. **Abrir navegador**: http://localhost:5173- Login con JWT tokens

3. **Crear cuenta** o usar credenciales de prueba- Roles: Admin, Vendedor, Cliente

4. **Realizar compras** - todo queda registrado- Middleware de protección de rutas

5. **Acceder como admin** para gestionar el sistema

### ✅ **Gestión de Productos**

---- Catálogo completo con imágenes

- Categorías y marcas

## 🎉 PROYECTO FINALIZADO Y FUNCIONAL AL 100%- Búsqueda y filtrado

- CRUD completo para administradores

**RepuestosAuto está listo para uso en producción**  

*Todas las compras, gestión y reportes funcionan correctamente*### ✅ **E-commerce**
- Carrito de compras funcional
- Proceso de checkout
- Gestión de pedidos
- Historial de compras

### ✅ **Reportes**
- Exportación a PDF
- Exportación a Excel
- Reportes de ventas
- Reportes de inventario

### ✅ **Panel Administrativo**
- Dashboard de administración
- Gestión de usuarios
- Gestión de productos
- Análisis de ventas

## 🔗 **Endpoints Principales**

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)
- `DELETE /api/products/:id` - Eliminar producto (Admin)

### Reportes Públicos
- `GET /api/reports/public/sales/pdf` - Reporte de ventas PDF
- `GET /api/reports/public/sales/xlsx` - Reporte de ventas Excel

## 🔒 **Seguridad**

- **API Key**: Middleware de validación
- **JWT Tokens**: Autenticación estateless
- **Hash de Contraseñas**: bcryptjs con salt
- **CORS**: Configurado para desarrollo y producción
- **Validación**: Sanitización de datos de entrada

## 🎨 **Características de UI/UX**

- **Responsive Design**: Compatible con dispositivos móviles
- **Tema Moderno**: Colores y tipografía profesional
- **Navegación Intuitiva**: Router de React
- **Feedback Visual**: Estados de carga y errores
- **Iconografía**: Emojis y símbolos descriptivos

## 🚀 **Estado de Desarrollo**

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| Backend API | ✅ | Completamente funcional |
| Frontend React | ✅ | Completamente funcional |
| Autenticación | ✅ | JWT implementado |
| Base de Datos | ✅ | SQLite con seed data |
| E-commerce | ✅ | Carrito y checkout |
| Reportes | ✅ | PDF y Excel |
| Admin Panel | ✅ | Dashboard completo |

## 🗄️ **Base de Datos**

### Migración y Sincronización

La aplicación utiliza SQLite en memoria para desarrollo. Los datos se cargan automáticamente al iniciar el servidor.

**Para usar con base de datos externa (opcional):**

1. Configura las variables de entorno en `.env`:
   ```
   DB_NAME=nombre_de_tu_bd
   DB_USER=usuario
   DB_PASS=contraseña
   DB_HOST=localhost
   ```

2. Ejecuta el script de migración:
   ```
   node src/migrate.js
   ```

## 📞 **Soporte**

Para reportar problemas o solicitar características:
- **GitHub Issues**: [Crear issue](https://github.com/Matias-ops-maker/Front-Back-borrador-TUP/issues)
- **Email**: Contactar al desarrollador

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT.

---

### 🎉 **¡Proyecto Completamente Funcional!**

El sistema RepuestosAuto está listo para uso en desarrollo y puede ser desplegado en producción con las configuraciones apropiadas de variables de entorno.

## 🔧 **Nuevas Funcionalidades Implementadas (Octubre 2025)**

### 🔍 **Sistema de Búsqueda Avanzado**
- **Autocompletado inteligente**: Sugerencias en tiempo real mientras escribes
- **Búsqueda multi-campo**: Busca por nombre, marca, categoría y descripción
- **Navegación automática**: Al buscar, redirige automáticamente al catálogo filtrado
- **Ordenamiento por relevancia**: Resultados ordenados por importancia

### ⚙️ **Gestión de Perfil Mejorada**
- **Cambio de contraseña seguro**: Con validación de contraseña actual
- **Actualización de email**: Con confirmación y validación duplicados
- **Interfaz intuitiva**: Formularios expandibles con validación en tiempo real
- **Persistencia de datos**: Todos los cambios se guardan en la base de datos
- **Feedback visual**: Mensajes de éxito y error informativos

### 🎨 **Mejoras de UI/UX**
- **Legibilidad mejorada**: Colores de texto más oscuros para mejor contraste
- **Textos optimizados**: Eliminación de grises claros problemáticos
- **Formularios mejorados**: Mejor experiencia de usuario en configuraciones
- **Responsividad**: Mantiene funcionalidad en todos los dispositivos

### 🔐 **Seguridad y Validaciones**
- **Validaciones robustas**: Frontend y backend sincronizados
- **Verificación de email**: Control de duplicados en tiempo real
- **Contraseñas seguras**: Mínimo 6 caracteres con confirmación
- **Autenticación persistente**: Tokens JWT actualizados

### 📱 **Compatibilidad y Rendimiento**
- **Cross-browser**: Funciona en Chrome, Firefox, Safari, Edge
- **Mobile-first**: Optimizado para dispositivos móviles
- **Carga rápida**: Sugerencias de búsqueda optimizadas
- **Manejo de errores**: Gestión robusta de errores de red

**Última actualización**: Octubre 2025 ✨
