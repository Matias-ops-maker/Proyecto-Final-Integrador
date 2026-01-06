# 🚗 RepuestosAuto - Backend API

## 📋 Descripción

Backend del sistema RepuestosAuto desarrollado con Node.js, Express.js y Sequelize. Proporciona una API REST completa para el manejo de productos, usuarios, órdenes y pagos con MercadoPago.

## ✨ Características Principales

- **API REST Completa**: Endpoints para todas las funcionalidades
- **Autenticación JWT**: Sistema seguro de autenticación
- **Integración MercadoPago**: Procesamiento de pagos real
- **Base de Datos**: SQLite con Sequelize ORM
- **Reportes**: Generación de PDF y Excel
- **Webhooks**: Confirmación automática de pagos
- **Middleware de Seguridad**: Protección de rutas y validaciones

## 🚀 Tecnologías Utilizadas

- **Node.js** v18+
- **Express.js** v4.18+
- **Sequelize** v6+ (ORM)
- **SQLite** (Base de datos)
- **JWT** (Autenticación)
- **bcryptjs** (Hash de contraseñas)
- **MercadoPago SDK** v2 (Pagos)
- **PDFKit** (Generación de PDFs)
- **ExcelJS** (Generación de Excel)
- **CORS** (Cross-Origin Resource Sharing)

## 📦 Instalación

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Base de Datos (opcional para SQLite)
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=repuestos_auto

# MercadoPago (Sandbox)
MP_ACCESS_TOKEN=tu_access_token_sandbox
MP_PUBLIC_KEY=tu_public_key_sandbox

# API
PORT=4000
NODE_ENV=development
```

### 3. Configurar MercadoPago
1. Registrarse en [MercadoPago Developers](https://www.mercadopago.com.ar/developers/)
2. Crear una aplicación
3. Obtener credenciales de prueba (sandbox)
4. Configurar webhook URL: `http://tu-dominio.com/api/payments/webhook`

### 4. Inicializar Base de Datos
```bash
# Migrar base de datos (si es necesario)
npm run migrate

# Poblar con datos de prueba
npm run seed
```

### 5. Iniciar Servidor
```bash
# Desarrollo
npm start

# Modo desarrollo con nodemon
npm run dev
```

## 🔗 Endpoints API

### 🔐 Autenticación
```
POST   /api/auth/register    # Registro de usuario
POST   /api/auth/login       # Inicio de sesión
GET    /api/auth/profile     # Perfil del usuario autenticado
PUT    /api/auth/profile     # Actualizar perfil
PUT    /api/auth/password    # Cambiar contraseña
```

### 👤 Usuarios
```
GET    /api/users           # Listar usuarios (Admin)
GET    /api/users/:id       # Obtener usuario específico
PUT    /api/users/:id       # Actualizar usuario
DELETE /api/users/:id       # Eliminar usuario (Admin)
```

### 🏷️ Categorías
```
GET    /api/categories      # Listar categorías
POST   /api/categories      # Crear categoría (Admin)
PUT    /api/categories/:id  # Actualizar categoría (Admin)
DELETE /api/categories/:id  # Eliminar categoría (Admin)
```

### 🏭 Marcas
```
GET    /api/brands          # Listar marcas
POST   /api/brands          # Crear marca (Admin)
PUT    /api/brands/:id      # Actualizar marca (Admin)
DELETE /api/brands/:id      # Eliminar marca (Admin)
```

### 🛍️ Productos
```
GET    /api/products        # Listar productos
GET    /api/products/:id    # Obtener producto específico
POST   /api/products        # Crear producto (Admin)
PUT    /api/products/:id    # Actualizar producto (Admin)
DELETE /api/products/:id    # Eliminar producto (Admin)
GET    /api/products/search # Buscar productos
```

### 🛒 Carrito
```
GET    /api/cart            # Obtener carrito del usuario
POST   /api/cart/items      # Agregar item al carrito
PUT    /api/cart/items/:id  # Actualizar cantidad
DELETE /api/cart/items/:id  # Eliminar item del carrito
DELETE /api/cart            # Vaciar carrito
```

### 📦 Órdenes
```
GET    /api/orders          # Listar órdenes del usuario
POST   /api/orders          # Crear nueva orden
GET    /api/orders/:id      # Obtener orden específica
PUT    /api/orders/:id      # Actualizar estado (Admin)
```

### 💳 Pagos MercadoPago
```
POST   /api/payments/create           # Crear preferencia de pago
POST   /api/payments/webhook          # Webhook de confirmación
GET    /api/payments/:id/status       # Consultar estado de pago
GET    /api/payments/success          # Página de éxito
GET    /api/payments/failure          # Página de falla
GET    /api/payments/pending          # Página de pendiente
```

### 📊 Reportes
```
GET    /api/reports/sales/pdf         # Reporte de ventas PDF
GET    /api/reports/sales/xlsx        # Reporte de ventas Excel
GET    /api/reports/products/pdf      # Reporte de productos PDF
GET    /api/reports/products/xlsx     # Reporte de productos Excel
```

### 📈 Reportes Públicos
```
GET    /api/public-reports/sales/pdf  # Reporte público PDF
GET    /api/public-reports/sales/xlsx # Reporte público Excel
```

## 🔒 Middleware de Autenticación

### JWT Auth Middleware
```javascript
// Protege rutas que requieren autenticación
const auth = require('./middlewares/auth');

// Uso en rutas
router.get('/profile', auth, getUserProfile);
```

### Admin Middleware
```javascript
// Protege rutas que requieren permisos de administrador
const { auth, isAdmin } = require('./middlewares/auth');

// Uso en rutas
router.post('/products', auth, isAdmin, createProduct);
```

### API Key Middleware
```javascript
// Protege rutas públicas con API Key
const apiKey = require('./middlewares/apiKey');

// Uso en rutas
router.get('/public-reports/sales/pdf', apiKey, generateReport);
```

## 💰 Integración MercadoPago

### Configuración
```javascript
// src/controllers/paymentController.js
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});
```

### Crear Preferencia de Pago
```javascript
const preference = new Preference(client);

const body = {
  items: [{
    title: 'Producto',
    quantity: 1,
    unit_price: 100,
    currency_id: 'ARS'
  }],
  back_urls: {
    success: 'http://localhost:5173/payment/success',
    failure: 'http://localhost:5173/payment/failure',
    pending: 'http://localhost:5173/payment/pending'
  },
  auto_return: 'approved',
  notification_url: 'http://localhost:4000/api/payments/webhook'
};

const result = await preference.create({ body });
```

### Webhook de Confirmación
```javascript
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const { data, type } = req.body;
    
    if (type === 'payment') {
      // Procesar confirmación de pago
      await updateOrderPaymentStatus(data.id);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).send('Error');
  }
});
```

## 🗄️ Modelos de Base de Datos

### User
```javascript
{
  id: INTEGER (Primary Key),
  firstName: STRING,
  lastName: STRING,
  email: STRING (Unique),
  password: STRING (Hashed),
  role: ENUM('user', 'admin'),
  createdAt: DATE,
  updatedAt: DATE
}
```

### Product
```javascript
{
  id: INTEGER (Primary Key),
  name: STRING,
  description: TEXT,
  price: DECIMAL,
  stock: INTEGER,
  imageUrl: STRING,
  categoryId: INTEGER (Foreign Key),
  brandId: INTEGER (Foreign Key),
  createdAt: DATE,
  updatedAt: DATE
}
```

### Order
```javascript
{
  id: INTEGER (Primary Key),
  userId: INTEGER (Foreign Key),
  total: DECIMAL,
  status: ENUM('pending', 'paid', 'shipped', 'delivered'),
  paymentId: STRING,
  paymentStatus: STRING,
  createdAt: DATE,
  updatedAt: DATE
}
```

### OrderItem
```javascript
{
  id: INTEGER (Primary Key),
  orderId: INTEGER (Foreign Key),
  productId: INTEGER (Foreign Key),
  quantity: INTEGER,
  unitPrice: DECIMAL,
  createdAt: DATE,
  updatedAt: DATE
}
```

## 🔧 Scripts NPM

```json
{
  "start": "node src/app.js",
  "dev": "nodemon src/app.js",
  "seed": "node src/seed.js",
  "migrate": "node src/migrate.js",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

## 🛡️ Seguridad

### Hash de Contraseñas
```javascript
const bcrypt = require('bcryptjs');

// Hash al registrar
const hashedPassword = await bcrypt.hash(password, 10);

// Verificar al hacer login
const isValid = await bcrypt.compare(password, user.password);
```

### JWT Tokens
```javascript
const jwt = require('jsonwebtoken');

// Generar token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 📊 Generación de Reportes

### PDF Reports
```javascript
const PDFDocument = require('pdfkit');

const generateSalesReport = async () => {
  const doc = new PDFDocument();
  
  doc.fontSize(20).text('Reporte de Ventas', 100, 100);
  
  // Agregar datos
  const orders = await Order.findAll();
  orders.forEach(order => {
    doc.text(`Orden #${order.id}: $${order.total}`);
  });
  
  return doc;
};
```

### Excel Reports
```javascript
const ExcelJS = require('exceljs');

const generateExcelReport = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ventas');
  
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Total', key: 'total', width: 15 },
    { header: 'Fecha', key: 'date', width: 20 }
  ];
  
  const orders = await Order.findAll();
  worksheet.addRows(orders);
  
  return workbook;
};
```

## 🚀 Despliegue

### Variables de Producción
```env
NODE_ENV=production
PORT=4000
JWT_SECRET=super_secret_jwt_key_production
MP_ACCESS_TOKEN=production_access_token
MP_PUBLIC_KEY=production_public_key
DB_URL=your_production_database_url
```

### Comandos de Producción
```bash
# Build para producción
npm run build

# Iniciar en producción
npm start

# PM2 para gestión de procesos
pm2 start src/app.js --name repuestos-backend
```

## 📞 Soporte

Para soporte técnico:
- 📧 Email: backend@repuestosauto.com
- 🐛 Issues: GitHub Issues
- 📚 Documentación: /docs

---

## 🏆 Estado: COMPLETAMENTE FUNCIONAL ✅

✅ **API REST completa**  
✅ **Integración MercadoPago operativa**  
✅ **Base de datos configurada**  
✅ **Autenticación JWT funcional**  
✅ **Reportes PDF/Excel operativos**  

**¡Backend listo para producción!** 🚀#   t r i g g e r   c i  
 