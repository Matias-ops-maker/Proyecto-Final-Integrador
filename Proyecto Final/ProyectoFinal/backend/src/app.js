import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from './models/index.js';
import { checkApiKey } from './middlewares/apiKey.js';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import brandRoutes from './routes/brands.js';
import vehicleRoutes from './routes/vehicles.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import reportRoutes from './routes/reports.js';
import publicReportRoutes from './routes/publicReports.js';
import paymentRoutes from './routes/payments.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Solo aplicar el middleware de API Key en rutas /api/*
app.use('/api', checkApiKey);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/public-reports', publicReportRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => res.json({
  ok: true,
  timestamp: new Date().toISOString(),
  env: process.env.NODE_ENV || 'development'
}));

app.use((error, req, res, _next) => {
  res.status(500).json({
    error: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Redirigir todas las rutas no API al index.html del frontend
app.get(/^((?!\/api).)*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Middleware de ruta no encontrada (al final)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Endpoint temporal para depuración de productos y categorías (sin API Key)
app.get('/debug/products-categories', async (req, res) => {
  try {
    const products = await sequelize.models.Product.findAll({ include: [sequelize.models.Category, sequelize.models.Brand] });
    const categories = await sequelize.models.Category.findAll();
    res.json({ products, categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  console.error('Promise:', promise);
});

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida');

      if (process.env.NODE_ENV !== 'production') {
        await sequelize.sync({ force: false });
        console.log('✅ Modelos sincronizados');
      }

      const server = app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`🌐 API disponible en http://localhost:${PORT}/api`);
      });

      server.on('error', (error) => {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
      });

    } catch (err) {
      console.error('❌ Error fatal:', err);
      process.exit(1);
    }
  })();
}

export default app;


