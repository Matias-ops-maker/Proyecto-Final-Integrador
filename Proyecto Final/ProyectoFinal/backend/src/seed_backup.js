import dotenv from 'dotenv';
dotenv.config();

import {
  sequelize,
  User,
  Category,
  Brand,
  Product,
  Vehicle,
  Fitment,
  Cart
} from './models/index.js';
import bcrypt from 'bcrypt';

(async () => {

  try {
    // Sincronizar modelos y borrar datos existentes (force: true)
    await sequelize.sync({ force: true });

    // Crear usuarios
    const passAdmin = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      nombre: 'Administrador',
      email: 'admin@repuestos.com',
      password: passAdmin,
      rol: 'admin'
    });

    const passUser = await bcrypt.hash('user123', 10);
    const user1 = await User.create({
      nombre: 'Juan Pérez',
      email: 'juan@gmail.com',
      password: passUser,
      rol: 'user'
    });

    const user2 = await User.create({
      nombre: 'María García',
      email: 'maria@gmail.com',
      password: passUser,
      rol: 'user'
    });

    // Crear carritos de compra
    await Cart.create({ user_id: admin.id });
    await Cart.create({ user_id: user1.id });
    await Cart.create({ user_id: user2.id });

    // Crear marcas de productos
    const bosch = await Brand.create({ nombre: 'Bosch' });
    const mann = await Brand.create({ nombre: 'Mann Filter' });
    const gates = await Brand.create({ nombre: 'Gates' });
    const ngk = await Brand.create({ nombre: 'NGK' });
    const brembo = await Brand.create({ nombre: 'Brembo' });
    const valeo = await Brand.create({ nombre: 'Valeo' });
    const sachs = await Brand.create({ nombre: 'Sachs' });
    const osram = await Brand.create({ nombre: 'Osram' });

    // Crear categorías de productos
    const motor = await Category.create({
      nombre: 'Motor',
      descripcion: 'Componentes del motor'
    });
    const filtros = await Category.create({
      nombre: 'Filtros',
      descripcion: 'Filtros de motor y habitáculo',
      parent_id: motor.id
    });
    const frenos = await Category.create({
      nombre: 'Frenos',
      descripcion: 'Sistema de frenado'
    });
    const pastillas = await Category.create({
      nombre: 'Pastillas',
      descripcion: 'Pastillas de freno',
      parent_id: frenos.id
    });
    const transmision = await Category.create({
      nombre: 'Transmisión',
      descripcion: 'Sistema de transmisión'
    });
    const encendido = await Category.create({
      nombre: 'Encendido',
      descripcion: 'Sistema de encendido'
    });
    const suspension = await Category.create({
      nombre: 'Suspensión',
      descripcion: 'Sistema de suspensión y dirección'
    });
    const electrica = await Category.create({
      nombre: 'Eléctrica',
      descripcion: 'Sistema eléctrico y electrónico'
    });
    // Las siguientes categorías no se usan, solo se crean para poblar la base
    await Category.create({
      nombre: 'Neumáticos',
      descripcion: 'Neumáticos y llantas'
    });
    await Category.create({
      nombre: 'Escape',
      descripcion: 'Sistema de escape'
    });
    await Category.create({
      nombre: 'Climatización',
      descripcion: 'Sistema de aire acondicionado'
    });

    // Crear vehículos
    const vehicles = await Vehicle.bulkCreate([
      { marca: 'Volkswagen', modelo: 'Golf', ano_desde: 2010, ano_hasta: 2020, motor: '1.6 TDI' },
      { marca: 'Volkswagen', modelo: 'Polo', ano_desde: 2015, ano_hasta: null, motor: '1.0 TSI' },
      { marca: 'Ford', modelo: 'Focus', ano_desde: 2012, ano_hasta: 2018, motor: '2.0 TDCi' },
      { marca: 'Ford', modelo: 'Fiesta', ano_desde: 2013, ano_hasta: null, motor: '1.6 Ti-VCT' },
      { marca: 'Chevrolet', modelo: 'Cruze', ano_desde: 2011, ano_hasta: 2019, motor: '1.8 LT' },
      { marca: 'Toyota', modelo: 'Corolla', ano_desde: 2014, ano_hasta: null, motor: '1.8 Hybrid' },
      { marca: 'Honda', modelo: 'Civic', ano_desde: 2016, ano_hasta: null, motor: '1.5 VTEC' },
      { marca: 'Nissan', modelo: 'Sentra', ano_desde: 2013, ano_hasta: 2020, motor: '1.6 16V' }
    ]);

    // Limpiar productos antes de insertar
    await Product.destroy({ where: {}, truncate: true });

    // 32 productos automotrices/taller, SKUs únicos, imágenes coherentes
    const productos = [
      // ...productos previos...
      { sku: 'A023', nombre: 'Kit de Embrague', descripcion: 'Kit completo de embrague para Chevrolet Cruze', precio: 45000, costo: 27000, imagen_url: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=400&q=80', stock: 5, estado: 'activo', brand_id: valeo.id, category_id: transmision.id },
      { sku: 'A024', nombre: 'Bombas de Agua', descripcion: 'Bomba de agua para Toyota Corolla', precio: 25000, costo: 15000, imagen_url: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=400&q=80', stock: 8, estado: 'activo', brand_id: gates.id, category_id: motor.id },
      { sku: 'A025', nombre: 'Kit de Distribución', descripcion: 'Kit de correa y tensores para Honda Civic', precio: 37000, costo: 22200, imagen_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80', stock: 6, estado: 'activo', brand_id: gates.id, category_id: transmision.id },
      { sku: 'A026', nombre: 'Juego de Pastillas de Freno', descripcion: 'Pastillas de freno para Nissan Sentra', precio: 12000, costo: 7200, imagen_url: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=400&q=80', stock: 12, estado: 'activo', brand_id: bosch.id, category_id: pastillas.id },
      { sku: 'A027', nombre: 'Discos de Freno Delanteros', descripcion: 'Discos de freno para VW Polo', precio: 18000, costo: 10800, imagen_url: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=400&q=80', stock: 9, estado: 'activo', brand_id: brembo.id, category_id: frenos.id },
      { sku: 'A028', nombre: 'Discos de Freno Traseros', descripcion: 'Discos de freno para Ford Fiesta', precio: 17000, costo: 10200, imagen_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80', stock: 7, estado: 'activo', brand_id: brembo.id, category_id: frenos.id },
      { sku: 'A029', nombre: 'Kit de Suspensión Completo', descripcion: 'Kit de amortiguadores y espirales para Toyota Corolla', precio: 55000, costo: 33000, imagen_url: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=400&q=80', stock: 4, estado: 'activo', brand_id: sachs.id, category_id: suspension.id },
      { sku: 'A030', nombre: 'Juego de Bujías NGK', descripcion: 'Bujías para motores nafteros VW Golf', precio: 9000, costo: 5400, imagen_url: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=400&q=80', stock: 15, estado: 'activo', brand_id: ngk.id, category_id: encendido.id },
      { sku: 'A031', nombre: 'Filtro de Habitáculo', descripcion: 'Filtro de aire para habitáculo Ford Focus', precio: 3500, costo: 2100, imagen_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80', stock: 20, estado: 'activo', brand_id: mann.id, category_id: filtros.id },
      { sku: 'A032', nombre: 'Juego de Lámparas H7', descripcion: 'Lámparas para faros delanteros Chevrolet Cruze', precio: 2500, costo: 1500, imagen_url: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=400&q=80', stock: 30, estado: 'activo', brand_id: osram.id, category_id: electrica.id }
    ];
    await Product.bulkCreate(productos);

    // Asociar cada producto a un vehículo (para filtros y lógica)
    const fitments = [];
    for (let i = 0; i < productos.length; i++) {
      fitments.push({ product_id: i + 1, vehicle_id: vehicles[0].id });
      fitments.push({ product_id: i + 1, vehicle_id: vehicles[1].id });
      fitments.push({ product_id: i + 1, vehicle_id: vehicles[2].id });
    }
    await Fitment.bulkCreate(fitments);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
