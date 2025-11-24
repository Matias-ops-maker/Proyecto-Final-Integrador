import dotenv from "dotenv";
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
} from "./models/index.js";
import bcrypt from "bcrypt";

(async () => {
    try {
        // Sincronizar modelos y borrar datos existentes (force: true)
        await sequelize.sync({ force: true });
        
        // Crear usuarios
        const passAdmin = await bcrypt.hash("admin123", 10);
        const admin = await User.create({ 
            nombre: "Administrador", 
            email: "admin@repuestos.com", 
            password: passAdmin, 
            rol: "admin"
        });

        const passUser = await bcrypt.hash("user123", 10);
        const user1 = await User.create({ 
            nombre: "Juan Pérez",  // Corregido el carácter especial
            email: "juan@gmail.com", 
            password: passUser,
            rol: "user"
        });

        const user2 = await User.create({ 
            nombre: "María García",  // Corregido el carácter especial
            email: "maria@gmail.com", 
            password: passUser,
            rol: "user"
        });

        // Crear carritos de compra
        await Cart.create({ user_id: admin.id });
        await Cart.create({ user_id: user1.id });
        await Cart.create({ user_id: user2.id });

        // Crear marcas de productos
        const bosch = await Brand.create({ nombre: "Bosch" });
        const mann = await Brand.create({ nombre: "Mann Filter" });
        const gates = await Brand.create({ nombre: "Gates" });
        const ngk = await Brand.create({ nombre: "NGK" });
        const mobil = await Brand.create({ nombre: "Mobil 1" });
        const brembo = await Brand.create({ nombre: "Brembo" });
        const ferodo = await Brand.create({ nombre: "Ferodo" });
        const castrol = await Brand.create({ nombre: "Castrol" });
        const valvoline = await Brand.create({ nombre: "Valvoline" });
        const shell = await Brand.create({ nombre: "Shell" });
        const denso = await Brand.create({ nombre: "Denso" });
        const monroe = await Brand.create({ nombre: "Monroe" });
        const bilstein = await Brand.create({ nombre: "Bilstein" });
        const sachs = await Brand.create({ nombre: "Sachs" });
        const lemforder = await Brand.create({ nombre: "Lemförder" });
        const trw = await Brand.create({ nombre: "TRW" });
        const valeo = await Brand.create({ nombre: "Valeo" });
        const mahle = await Brand.create({ nombre: "Mahle" });
        const hella = await Brand.create({ nombre: "Hella" });
        const osram = await Brand.create({ nombre: "Osram" });
        const bardahl = await Brand.create({ nombre: "Bardahl" });
        const eibach = await Brand.create({ nombre: "Eibach" });
        const koni = await Brand.create({ nombre: "Koni" });
        const pirelli = await Brand.create({ nombre: "Pirelli" });
        const michelin = await Brand.create({ nombre: "Michelin" });
        const continental = await Brand.create({ nombre: "Continental" });

        // Crear categorías de productos
        const motor = await Category.create({ 
            nombre: "Motor", 
            descripcion: "Componentes del motor" 
        });
        
        const filtros = await Category.create({ 
            nombre: "Filtros", 
            descripcion: "Filtros de motor y habitáculo",  // Corregido el carácter especial
            parent_id: motor.id 
        });
        
        const lubricantes = await Category.create({ 
            nombre: "Lubricantes", 
            descripcion: "Aceites y grasas",
            parent_id: motor.id 
        });

        const frenos = await Category.create({ 
            nombre: "Frenos", 
            descripcion: "Sistema de frenado" 
        });
        
        const pastillas = await Category.create({ 
            nombre: "Pastillas", 
            descripcion: "Pastillas de freno",
            parent_id: frenos.id 
        });

        const transmision = await Category.create({ 
            nombre: "Transmisión",  // Corregido el carácter especial
            descripcion: "Sistema de transmisión" 
        });

        const encendido = await Category.create({ 
            nombre: "Encendido", 
            descripcion: "Sistema de encendido" 
        });

        const suspension = await Category.create({ 
            nombre: "Suspensión", 
            descripcion: "Sistema de suspensión y dirección"  // Corregido el carácter especial
        });

        const electrica = await Category.create({ 
            nombre: "Eléctrica",  // Corregido el carácter especial
            descripcion: "Sistema eléctrico y electrónico" 
        });

        const neumaticos = await Category.create({ 
            nombre: "Neumáticos",  // Corregido el carácter especial
            descripcion: "Neumáticos y llantas" 
        });

        const escape = await Category.create({ 
            nombre: "Escape", 
            descripcion: "Sistema de escape" 
        });

        const climatizacion = await Category.create({ 
            nombre: "Climatización",  // Corregido el carácter especial
            descripcion: "Sistema de aire acondicionado" 
        });

        // Crear vehículos
        const vehicles = await Vehicle.bulkCreate([
            { marca: "Volkswagen", modelo: "Golf", año_desde: 2010, año_hasta: 2020, motor: "1.6 TDI" },
            { marca: "Volkswagen", modelo: "Polo", año_desde: 2015, año_hasta: null, motor: "1.0 TSI" },
            { marca: "Ford", modelo: "Focus", año_desde: 2012, año_hasta: 2018, motor: "2.0 TDCi" },
            { marca: "Ford", modelo: "Fiesta", año_desde: 2013, año_hasta: null, motor: "1.6 Ti-VCT" },
            { marca: "Chevrolet", modelo: "Cruze", año_desde: 2011, año_hasta: 2019, motor: "1.8 LT" },
            { marca: "Toyota", modelo: "Corolla", año_desde: 2014, año_hasta: null, motor: "1.8 Hybrid" },
            { marca: "Honda", modelo: "Civic", año_desde: 2016, año_hasta: null, motor: "1.5 VTEC" },
            { marca: "Nissan", modelo: "Sentra", año_desde: 2013, año_hasta: 2020, motor: "1.6 16V" }
        ]);

        // Crear productos
        const products = await Product.bulkCreate([
            {
                sku: "F001",
                nombre: "Filtro de Aceite W 712/75",
                descripcion: "Filtro de aceite compatible con motores VW/Audi 1.6-2.0 TDI",
                precio: 3500.00,
                costo: 2100.00,
                imagen_url: "https://example.com/images/filtro-oil-71275.jpg",  // Enlace de imagen corregido
                stock: 25,
                estado: "activo",
                brand_id: mann.id,
                category_id: filtros.id
            },
            {
                sku: "F002",
                nombre: "Filtro de Aire C 25 114",
                descripcion: "Filtro de aire para VW Golf, Polo y Audi A3",
                precio: 2800.00,
                costo: 1680.00,
                stock: 30,
                estado: "activo",
                brand_id: mann.id,
                category_id: filtros.id
            },
            {
                sku: "B001",
                nombre: "Pastillas de Freno Delanteras",
                descripcion: "Pastillas de freno cerámicas para eje delantero",
                precio: 12000.00,
                costo: 7200.00,
                stock: 15,
                estado: "activo",
                brand_id: bosch.id,
                category_id: pastillas.id
            },
            {
                sku: "B002",
                nombre: "Pastillas de Freno Traseras",
                descripcion: "Pastillas de freno orgánicas para eje trasero",
                precio: 8500.00,
                costo: 5100.00,
                stock: 18,
                estado: "activo",
                brand_id: bosch.id,
                category_id: pastillas.id
            },
            {
                sku: "G001",
                nombre: "Correa de Distribución",
                descripcion: "Correa de distribución para motores 1.6-2.0",
                precio: 15000.00,
                costo: 9000.00,
                stock: 12,
                estado: "activo",
                brand_id: gates.id,
                category_id: transmision.id
            },
            {
                sku: "N001",
                nombre: "Bujías Iridium",
                descripcion: "Juego de 4 bujías de iridio NGK",
                precio: 18000.00,
                costo: 10800.00,
                stock: 20,
                estado: "activo",
                brand_id: ngk.id,
                category_id: encendido.id
            },
            {
                sku: "M001",
                nombre: "Aceite Motor 5W-30",
                descripcion: "Aceite sintético 5W-30 para motores modernos - 4L",
                precio: 8900.00,
                costo: 5340.00,
                stock: 40,
                estado: "activo",
                brand_id: mobil.id,
                category_id: lubricantes.id
            },
            {
                sku: "F003",
                nombre: "Filtro Combustible",
                descripcion: "Filtro de combustible para motores diesel",
                precio: 4200.00,
                costo: 2520.00,
                stock: 22,
                estado: "activo",
                brand_id: bosch.id,
                category_id: filtros.id
            }
        ]);

        // Relacionar productos con vehículos (fitments)
        const fitments = [
            { product_id: products[0].id, vehicle_id: vehicles[0].id },
            { product_id: products[0].id, vehicle_id: vehicles[1].id },
            { product_id: products[1].id, vehicle_id: vehicles[0].id },
            { product_id: products[1].id, vehicle_id: vehicles[1].id },
            { product_id: products[2].id, vehicle_id: vehicles[0].id },
            { product_id: products[2].id, vehicle_id: vehicles[2].id },
            { product_id: products[2].id, vehicle_id: vehicles[4].id },
            { product_id: products[3].id, vehicle_id: vehicles[0].id },
            { product_id: products[3].id, vehicle_id: vehicles[2].id },
            { product_id: products[4].id, vehicle_id: vehicles[0].id },
            { product_id: products[4].id, vehicle_id: vehicles[1].id },
            { product_id: products[4].id, vehicle_id: vehicles[2].id },
            { product_id: products[5].id, vehicle_id: vehicles[1].id },
            { product_id: products[5].id, vehicle_id: vehicles[3].id },
            { product_id: products[5].id, vehicle_id: vehicles[4].id },
            { product_id: products[5].id, vehicle_id: vehicles[5].id },
            { product_id: products[5].id, vehicle_id: vehicles[6].id },
            { product_id: products[6].id, vehicle_id: vehicles[0].id },
            { product_id: products[6].id, vehicle_id: vehicles[1].id },
            { product_id: products[6].id, vehicle_id: vehicles[2].id },
            { product_id: products[6].id, vehicle_id: vehicles[3].id },
            { product_id: products[6].id, vehicle_id: vehicles[4].id },
            { product_id: products[6].id, vehicle_id: vehicles[5].id },
            { product_id: products[7].id, vehicle_id: vehicles[0].id },
            { product_id: products[7].id, vehicle_id: vehicles[2].id }
        ];

        await Fitment.bulkCreate(fitments);

        process.exit(0);  // Indicar éxito
    } catch (err) {
        console.error(err);  // Mostrar error
        process.exit(1);  // Indicar fallo
    }
})();
