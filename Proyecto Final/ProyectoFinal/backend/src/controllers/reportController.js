import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export async function salesPdf(req, res) {
    try {
        const salesData = [
            { 
                fecha: "2024-10-01", 
                cliente: "Juan Pérez", 
                productos: "Filtro de aceite, Pastillas de freno", 
                total: 45000,
                estado: "Entregado"
            },
            { 
                fecha: "2024-10-02", 
                cliente: "María García", 
                productos: "Aceite motor 5W-30", 
                total: 28000,
                estado: "En proceso"
            },
            { 
                fecha: "2024-10-03", 
                cliente: "Carlos López", 
                productos: "Amortiguador Monroe", 
                total: 12500,
                estado: "Pendiente"
            }
        ];

        const doc = new PDFDocument();
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.pdf");
        
        doc.pipe(res);

        doc.fontSize(20).text("Reporte de Ventas", 50, 50);
        doc.fontSize(12).text(`Fecha del reporte: ${new Date().toLocaleDateString("es-AR")}`, 50, 80);
        doc.moveDown(2);

        salesData.forEach((order, index) => {
            doc.text(`${index + 1}. Fecha: ${order.fecha}`);
            doc.text(`   Cliente: ${order.cliente}`);
            doc.text(`   Productos: ${order.productos}`);
            doc.text(`   Total: $${order.total.toFixed(2)}`);
            doc.text(`   Estado: ${order.estado}`);
            doc.moveDown(0.5);
        });

        const totalVentas = salesData.reduce((sum, order) => sum + order.total, 0);
        doc.moveDown(1);
        doc.fontSize(14).text(`Total de ventas: $${totalVentas.toFixed(2)}`);
        doc.text(`Número de órdenes: ${salesData.length}`);

        doc.end();

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function salesXlsx(req, res) {
    try {
        const salesData = [
            { 
                fecha: "2024-10-01", 
                cliente: "Juan Pérez", 
                productos: "Filtro de aceite, Pastillas de freno", 
                total: 45000,
                estado: "Entregado"
            },
            { 
                fecha: "2024-10-02", 
                cliente: "María García", 
                productos: "Aceite motor 5W-30", 
                total: 28000,
                estado: "En proceso"
            },
            { 
                fecha: "2024-10-03", 
                cliente: "Carlos López", 
                productos: "Amortiguador Monroe", 
                total: 12500,
                estado: "Pendiente"
            }
        ];
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte de Ventas");

        worksheet.columns = [
            { header: "Fecha", key: "fecha", width: 15 },
            { header: "Cliente", key: "cliente", width: 30 },
            { header: "Productos", key: "productos", width: 40 },
            { header: "Total", key: "total", width: 15 },
            { header: "Estado", key: "estado", width: 15 }
        ];

        salesData.forEach(order => {
            worksheet.addRow({
                fecha: order.fecha,
                cliente: order.cliente,
                productos: order.productos,
                total: `$${order.total.toFixed(2)}`,
                estado: order.estado
            });
        });

        worksheet.getRow(1).font = { bold: true };
        
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.xlsx");
        
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function inventoryPdf(req, res) {
    try {
        const inventoryData = [
            { 
                nombre: "Filtro de aceite para Toyota Corolla", 
                categoria: "Filtros",
                marca: "MANN-FILTER",
                precio: 15000,
                stock: 45,
                estado: "Disponible"
            },
            { 
                nombre: "Pastillas de freno delanteras", 
                categoria: "Frenos",
                marca: "Brembo",
                precio: 35000,
                stock: 23,
                estado: "Disponible"
            },
            { 
                nombre: "Aceite motor 5W-30 sintético 1L", 
                categoria: "Lubricantes",
                marca: "Mobil 1",
                precio: 28000,
                stock: 8,
                estado: "Stock bajo"
            }
        ];

        const doc = new PDFDocument();
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_inventario.pdf");
        
        doc.pipe(res);

        doc.fontSize(20).text("Reporte de Inventario", 50, 50);
        doc.fontSize(12).text(`Fecha del reporte: ${new Date().toLocaleDateString("es-AR")}`, 50, 80);
        doc.moveDown(2);

        inventoryData.forEach((product, index) => {
            doc.text(`${index + 1}. Producto: ${product.nombre}`);
            doc.text(`   Categoría: ${product.categoria}`);
            doc.text(`   Marca: ${product.marca}`);
            doc.text(`   Precio: $${product.precio.toFixed(2)}`);
            doc.text(`   Stock: ${product.stock} unidades`);
            doc.text(`   Estado: ${product.estado}`);
            doc.moveDown(0.5);
        });

        const totalProductos = inventoryData.length;
        const stockBajo = inventoryData.filter(p => p.stock < 10).length;
        const valorTotal = inventoryData.reduce((sum, product) => sum + (product.precio * product.stock), 0);
        
        doc.moveDown(1);
        doc.fontSize(14).text("Resumen del Inventario:");
        doc.fontSize(12).text(`Total de productos: ${totalProductos}`);
        doc.text(`Productos con stock bajo: ${stockBajo}`);
        doc.text(`Valor total del inventario: $${valorTotal.toFixed(2)}`);

        doc.end();

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function inventoryXlsx(req, res) {
    try {
        const inventoryData = [
            { 
                nombre: "Filtro de aceite para Toyota Corolla", 
                categoria: "Filtros",
                marca: "MANN-FILTER",
                precio: 15000,
                stock: 45,
                estado: "Disponible"
            },
            { 
                nombre: "Pastillas de freno delanteras", 
                categoria: "Frenos",
                marca: "Brembo",
                precio: 35000,
                stock: 23,
                estado: "Disponible"
            },
            { 
                nombre: "Aceite motor 5W-30 sintético 1L", 
                categoria: "Lubricantes",
                marca: "Mobil 1",
                precio: 28000,
                stock: 8,
                estado: "Stock bajo"
            }
        ];

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte de Inventario");

        worksheet.columns = [
            { header: "Producto", key: "nombre", width: 40 },
            { header: "Categoría", key: "categoria", width: 20 },
            { header: "Marca", key: "marca", width: 20 },
            { header: "Precio", key: "precio", width: 15 },
            { header: "Stock", key: "stock", width: 10 },
            { header: "Estado", key: "estado", width: 15 }
        ];

        inventoryData.forEach(product => {
            worksheet.addRow({
                nombre: product.nombre,
                categoria: product.categoria,
                marca: product.marca,
                precio: `$${product.precio.toFixed(2)}`,
                stock: product.stock,
                estado: product.estado
            });
        });

        worksheet.getRow(1).font = { bold: true };
        
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_inventario.xlsx");
        
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function dashboardStats(req, res) {
    try {

        const stats = {
            totalVentas: 175000,
            ventasMes: 95000,
            ordenesPendientes: 12,
            productosStockBajo: 6,
            totalProductos: 40,
            ventasRecientes: [
                { 
                    fecha: "2024-10-01", 
                    cliente: "Juan Pérez", 
                    total: 45000,
                    estado: "Entregado"
                },
                { 
                    fecha: "2024-10-02", 
                    cliente: "María García", 
                    total: 28000,
                    estado: "En proceso"
                },
                { 
                    fecha: "2024-10-03", 
                    cliente: "Carlos López", 
                    total: 12500,
                    estado: "Pendiente"
                }
            ],
            productosPopulares: [
                { nombre: "Filtro de aceite", ventas: 25 },
                { nombre: "Pastillas de freno", ventas: 18 },
                { nombre: "Aceite motor 5W-30", ventas: 15 }
            ]
        };

        res.json(stats);

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
