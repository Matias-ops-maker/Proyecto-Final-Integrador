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
import bcryptjs from 'bcryptjs';

const defaultProductImage = 'https://images.unsplash.com/photo-1582719478248-54e9f2e7588c?auto=format&fit=crop&w=800&q=80';

(async () => {
  try {
    await sequelize.sync({ force: true });
    const passAdmin = await bcryptjs.hash('admin123', 10);
    await User.create({
      nombre: 'Administrador',
      email: 'admin@repuestos.com',
      password: passAdmin,
      rol: 'admin'
    });

    const passUser = await bcryptjs.hash('user123', 10);
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

    await Cart.create({ user_id: user1.id });
    await Cart.create({ user_id: user2.id });

    const motor = await Category.create({ nombre: 'Motor' });
    const filtros = await Category.create({ nombre: 'Filtros' });
    const frenos = await Category.create({ nombre: 'Frenos' });
    const pastillas = await Category.create({ nombre: 'Pastillas de freno' });
    const aceites = await Category.create({ nombre: 'Aceites y lubricantes' });
    const encendido = await Category.create({ nombre: 'Sistema de encendido' });
    await Category.create({ nombre: 'Suspensión' });
    const transmision = await Category.create({ nombre: 'Transmisión' });

    const bosch = await Brand.create({ nombre: 'Bosch' });
    const mann = await Brand.create({ nombre: 'Mann Filter' });
    const castrol = await Brand.create({ nombre: 'Castrol' });
    const ngk = await Brand.create({ nombre: 'NGK' });
    const brembo = await Brand.create({ nombre: 'Brembo' });
    const ferodo = await Brand.create({ nombre: 'Ferodo' });
    const mahle = await Brand.create({ nombre: 'Mahle' });
    await Brand.create({ nombre: 'Monroe' });
    const gates = await Brand.create({ nombre: 'Gates' });
    const liquiMoly = await Brand.create({ nombre: 'Liqui Moly' });

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

    const productsData = [

      {
        sku: 'F001',
        nombre: 'Filtro de Aceite W 712/75',
        descripcion: 'Filtro de aceite compatible con motores VW/Audi 1.6-2.0 TDI',
        precio: 3500.00,
        costo: 2100.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 25,
        estado: 'activo',
        brand_id: mann.id,
        category_id: filtros.id
      },
      {
        sku: 'F002',
        nombre: 'Filtro de Aire C 25 114',
        descripcion: 'Filtro de aire para VW Golf, Polo y Audi A3',
        precio: 2800.00,
        costo: 1680.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 30,
        estado: 'activo',
        brand_id: mann.id,
        category_id: filtros.id
      },
      {
        sku: 'F003',
        nombre: 'Filtro Combustible FF5052',
        descripcion: 'Filtro de combustible para motores diesel',
        precio: 4200.00,
        costo: 2520.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 22,
        estado: 'activo',
        brand_id: bosch.id,
        category_id: filtros.id
      },
      {
        sku: 'F004',
        nombre: 'Filtro Cabina LA440',
        descripcion: 'Filtro antipolen para máxima pureza del aire',
        precio: 3200.00,
        costo: 1920.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 35,
        estado: 'activo',
        brand_id: mahle.id,
        category_id: filtros.id
      },
      {
        sku: 'F005',
        nombre: 'Filtro Hydraulico HU7003X',
          descripcion: 'Filtro hidráulico para transmisiones automáticas',
        precio: 4800.00,
        costo: 2880.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 18,
        estado: 'activo',
        brand_id: mann.id,
        category_id: filtros.id
      },
      {
        sku: 'F006',
        nombre: 'Filtro Gasolina G6302',
        descripcion: 'Filtro de combustible para motores nafteros',
        precio: 3800.00,
        costo: 2280.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 28,
        estado: 'activo',
        brand_id: bosch.id,
        category_id: filtros.id
      },
      {
        sku: 'F007',
        nombre: 'Filtro Aire Motor C30005',
        descripcion: 'Filtro de aire de alto rendimiento',
        precio: 3600.00,
        costo: 2160.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 32,
        estado: 'activo',
        brand_id: mahle.id,
        category_id: filtros.id
      },
      {
        sku: 'F008',
        nombre: 'Filtro Aceite OX153D1',
          descripcion: 'Filtro de aceite ecológico biodegradable',
        precio: 4100.00,
        costo: 2460.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 26,
        estado: 'activo',
        brand_id: mahle.id,
        category_id: filtros.id
      },

      {
        sku: 'B001',
        nombre: 'Pastillas de Freno Delanteras Brembo',
          descripcion: 'Pastillas de freno cerámicas para eje delantero',
        precio: 12000.00,
        costo: 7200.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 15,
        estado: 'activo',
        brand_id: brembo.id,
        category_id: pastillas.id
      },
      {
        sku: 'B002',
        nombre: 'Pastillas de Freno Traseras Ferodo',
          descripcion: 'Pastillas de freno orgánicas para eje trasero',
        precio: 8500.00,
        costo: 5100.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 18,
        estado: 'activo',
        brand_id: ferodo.id,
        category_id: pastillas.id
      },
      {
        sku: 'B003',
        nombre: 'Disco de Freno Ventilado',
        descripcion: 'Disco de freno ventilado 280mm',
        precio: 15800.00,
        costo: 9480.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 25,
        estado: 'activo',
        brand_id: brembo.id,
        category_id: frenos.id
      },
      {
        sku: 'B004',
        nombre: 'Cilindro Freno Rueda TRW',
        descripcion: 'Cilindro de freno para rueda trasera',
        precio: 6800.00,
        costo: 4080.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 20,
        estado: 'activo',
        brand_id: ferodo.id,
        category_id: frenos.id
      },
      {
        sku: 'B005',
        nombre: 'Zapatas de Freno Traseras',
        descripcion: 'Zapatas de freno para freno de tambor',
        precio: 7200.00,
        costo: 4320.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 16,
        estado: 'activo',
        brand_id: ferodo.id,
        category_id: frenos.id
      },
      {
        sku: 'B006',
        nombre: 'Líquido de Frenos DOT 4',
        descripcion: 'Líquido de frenos de alta performance',
        precio: 2800.00,
        costo: 1680.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 40,
        estado: 'activo',
        brand_id: castrol.id,
        category_id: frenos.id
      },
      {
        sku: 'B007',
        nombre: 'Pastillas Cerámicas Premium',
        descripcion: 'Pastillas de freno cerámicas de alta gama',
        precio: 18500.00,
        costo: 11100.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 12,
        estado: 'activo',
        brand_id: brembo.id,
        category_id: pastillas.id
      },
      {
        sku: 'B008',
        nombre: 'Disco Freno Trasero Sólido',
        descripcion: 'Disco de freno trasero para vehículos compactos',
        precio: 9500.00,
        costo: 5700.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 22,
        estado: 'activo',
        brand_id: brembo.id,
        category_id: frenos.id
      },

      {
        sku: 'A001',
        nombre: 'Aceite Motor 5W-30 Sintético',
        descripcion: 'Aceite de motor totalmente sintético',
        precio: 8500.00,
        costo: 5100.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 50,
        estado: 'activo',
        brand_id: castrol.id,
        category_id: aceites.id
      },
      {
        sku: 'A002',
        nombre: 'Aceite Motor 10W-40 Semisintético',
        descripcion: 'Aceite semisintético para uso general',
        precio: 5800.00,
        costo: 3480.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 45,
        estado: 'activo',
        brand_id: castrol.id,
        category_id: aceites.id
      },
      {
        sku: 'A003',
        nombre: 'Aceite Transmisión ATF Dextron VI',
        descripcion: 'Fluido para transmisiones automáticas',
        precio: 12500.00,
        costo: 7500.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 25,
        estado: 'activo',
        brand_id: liquiMoly.id,
        category_id: aceites.id
      },
      {
        sku: 'A004',
        nombre: 'Grasa Multiuso Litio',
        descripcion: 'Grasa multiuso para rodamientos y chasís',
        precio: 3200.00,
        costo: 1920.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 35,
        estado: 'activo',
        brand_id: liquiMoly.id,
        category_id: aceites.id
      },
      {
        sku: 'A005',
        nombre: 'Aceite Motor Diesel 15W-40',
        descripcion: 'Aceite específico para motores diesel',
        precio: 7200.00,
        costo: 4320.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 30,
        estado: 'activo',
        brand_id: castrol.id,
        category_id: aceites.id
      },
      {
        sku: 'A006',
        nombre: 'Aditivo Limpiador Motor',
        descripcion: 'Aditivo para limpieza interna del motor',
        precio: 4500.00,
        costo: 2700.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 28,
        estado: 'activo',
        brand_id: liquiMoly.id,
        category_id: aceites.id
      },
      {
        sku: 'A007',
        nombre: 'Refrigerante Anticongelante',
        descripcion: 'Líquido refrigerante concentrado G12++',
        precio: 3800.00,
        costo: 2280.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 42,
        estado: 'activo',
        brand_id: liquiMoly.id,
        category_id: aceites.id
      },
      {
        sku: 'A008',
        nombre: 'Aceite Caja Manual 75W-90',
        descripcion: 'Aceite para cajas manuales y diferenciales',
        precio: 9800.00,
        costo: 5880.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 20,
        estado: 'activo',
        brand_id: castrol.id,
        category_id: aceites.id
      },

      {
        sku: 'E001',
        nombre: 'Bujías Iridium NGK ILKAR7B11',
        descripcion: 'Bujías de iridio para máximo rendimiento',
        precio: 8500.00,
        costo: 5100.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 24,
        estado: 'activo',
        brand_id: ngk.id,
        category_id: encendido.id
      },
      {
        sku: 'E002',
        nombre: 'Cables de Bujía 8mm',
        descripcion: 'Juego de cables de alta tensión',
        precio: 12000.00,
        costo: 7200.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 18,
        estado: 'activo',
        brand_id: ngk.id,
        category_id: encendido.id
      },
      {
        sku: 'E003',
        nombre: 'Bobina de Encendido Individual',
        descripcion: 'Bobina de encendido para motores modernos',
        precio: 15800.00,
        costo: 9480.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 15,
        estado: 'activo',
        brand_id: bosch.id,
        category_id: encendido.id
      },
      {
        sku: 'E004',
        nombre: 'Distribuidor Completo',
        descripcion: 'Distribuidor con tapa y rotor incluido',
        precio: 28500.00,
        costo: 17100.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 8,
        estado: 'activo',
        brand_id: bosch.id,
        category_id: encendido.id
      },
      {
        sku: 'E005',
        nombre: 'Sensor de Posición Cigüeñal',
        descripcion: 'Sensor CKP para sistema de inyección',
        precio: 8900.00,
        costo: 5340.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 12,
        estado: 'activo',
        brand_id: bosch.id,
        category_id: encendido.id
      },
      {
        sku: 'E006',
        nombre: 'Modulo de Encendido Electrónico',
        descripcion: 'Módulo de control de encendido',
        precio: 24000.00,
        costo: 14400.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 6,
        estado: 'activo',
        brand_id: bosch.id,
        category_id: encendido.id
      },
      {
        sku: 'E007',
        nombre: 'Bujías Convencionales BP6ES',
        descripcion: 'Bujías estándar para motores carburados',
        precio: 2800.00,
        costo: 1680.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 50,
        estado: 'activo',
        brand_id: ngk.id,
        category_id: encendido.id
      },
      {
        sku: 'E008',
        nombre: 'Condensador de Encendido',
        descripcion: 'Condensador para sistemas clásicos',
        precio: 1500.00,
        costo: 900.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 30,
        estado: 'activo',
        brand_id: bosch.id,
        category_id: encendido.id
      },

      {
        sku: 'T001',
        nombre: 'Correa de Distribución Gates',
        descripcion: 'Correa de distribución reforzada',
        precio: 8500.00,
        costo: 5100.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 20,
        estado: 'activo',
        brand_id: gates.id,
        category_id: transmision.id
      },
      {
        sku: 'T002',
        nombre: 'Kit Distribución Completo',
        descripcion: 'Kit con correa, tensores y bomba de agua',
        precio: 28000.00,
        costo: 16800.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 10,
        estado: 'activo',
        brand_id: gates.id,
        category_id: transmision.id
      },
      {
        sku: 'T003',
        nombre: 'Embrague Kit 3 Piezas',
        descripcion: 'Kit de embrague disco, plato y collarin',
        precio: 45000.00,
        costo: 27000.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 8,
        estado: 'activo',
        brand_id: mahle.id,
        category_id: transmision.id
      },
      {
        sku: 'T004',
        nombre: 'Correa Alternador Poly-V',
        descripcion: 'Correa de accesorios multicanal',
        precio: 4200.00,
        costo: 2520.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 25,
        estado: 'activo',
        brand_id: gates.id,
        category_id: transmision.id
      },
      {
        sku: 'T005',
        nombre: 'Tensor de Correa Automático',
        descripcion: 'Tensor automático para correa de accesorios',
        precio: 12500.00,
        costo: 7500.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 15,
        estado: 'activo',
        brand_id: gates.id,
        category_id: transmision.id
      },
      {
        sku: 'T006',
        nombre: 'Rodamiento Embrague',
        descripcion: 'Collarín de embrague de liberación',
        precio: 8900.00,
        costo: 5340.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 18,
        estado: 'activo',
        brand_id: mahle.id,
        category_id: transmision.id
      },
      {
        sku: 'T007',
        nombre: 'Bomba de Agua Completa',
        descripcion: 'Bomba de agua con junta incluida',
        precio: 15600.00,
        costo: 9360.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 12,
        estado: 'activo',
        brand_id: gates.id,
        category_id: motor.id
      },
      {
        sku: 'T008',
        nombre: 'Cadena de Distribución',
        descripcion: 'Cadena de distribución para motores TSI',
        precio: 18500.00,
        costo: 11100.00,
        imagen_url: 'https://via.placeholder.com/200x150/9ca3af?text=Producto',
        stock: 8,
        estado: 'activo',
        brand_id: mahle.id,
        category_id: transmision.id
      }
    ];

    const products = await Product.bulkCreate(productsData.map(p => ({
      ...p,
      imagen_url: (!p.imagen_url || p.imagen_url.includes('placeholder')) ? defaultProductImage : p.imagen_url
    })));

    const fitments = [

      { product_id: products[0].id, vehicle_id: vehicles[0].id },
      { product_id: products[0].id, vehicle_id: vehicles[1].id },

      { product_id: products[1].id, vehicle_id: vehicles[0].id },
      { product_id: products[1].id, vehicle_id: vehicles[1].id },

      { product_id: products[8].id, vehicle_id: vehicles[0].id },
      { product_id: products[8].id, vehicle_id: vehicles[2].id },
      { product_id: products[8].id, vehicle_id: vehicles[4].id },

      { product_id: products[9].id, vehicle_id: vehicles[0].id },
      { product_id: products[9].id, vehicle_id: vehicles[2].id },

      { product_id: products[32].id, vehicle_id: vehicles[0].id },
      { product_id: products[32].id, vehicle_id: vehicles[1].id },
      { product_id: products[32].id, vehicle_id: vehicles[2].id },

      { product_id: products[24].id, vehicle_id: vehicles[1].id },
      { product_id: products[24].id, vehicle_id: vehicles[3].id },
      { product_id: products[24].id, vehicle_id: vehicles[4].id },
      { product_id: products[24].id, vehicle_id: vehicles[5].id },
      { product_id: products[24].id, vehicle_id: vehicles[6].id },

      { product_id: products[16].id, vehicle_id: vehicles[0].id },
      { product_id: products[16].id, vehicle_id: vehicles[1].id },
      { product_id: products[16].id, vehicle_id: vehicles[2].id },
      { product_id: products[16].id, vehicle_id: vehicles[3].id },
      { product_id: products[16].id, vehicle_id: vehicles[4].id },
      { product_id: products[16].id, vehicle_id: vehicles[5].id },

      { product_id: products[2].id, vehicle_id: vehicles[0].id },
      { product_id: products[2].id, vehicle_id: vehicles[2].id }
    ];

    await Fitment.bulkCreate(fitments);

    process.exit(0);
  } catch (err) {
    console.error(' Error en seed:', err?.message || err);
    if (err?.stack) console.error(err.stack);
    if (err?.errors) console.error(err.errors);
    process.exit(1);
  }
})();