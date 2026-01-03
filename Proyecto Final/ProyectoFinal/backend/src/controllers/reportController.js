import { ReportService } from "../services/reportService.js";
import { ApiResponse } from "../helpers/apiHelpers.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export async function salesPdf(req, res) {
    try {
        if (req.user.rol !== "admin") {
            return ApiResponse.error(res, 403, "No autorizado");
        }

        const pdfBuffer = await ReportService.generateSalesPdf();
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error generando PDF");
    }
}

export async function salesXlsx(req, res) {
    try {
        if (req.user.rol !== "admin") {
            return ApiResponse.error(res, 403, "No autorizado");
        }

        const buffer = await ReportService.generateSalesXlsx();
        
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.xlsx");
        res.send(buffer);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error generando XLSX");
    }
}

export async function dashboardStats(req, res) {
    try {
        if (req.user.rol !== "admin") {
            return ApiResponse.error(res, 403, "No autorizado");
        }

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

        return ApiResponse.success(res, stats);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error obteniendo estadísticas");
    }
}

export async function inventoryPdf(req, res) {
    try {
        if (req.user.rol !== "admin") return ApiResponse.error(res, 403, "No autorizado");

        const inventoryData = [
            { nombre: "Filtro de aceite para Toyota Corolla", categoria: "Filtros", marca: "MANN-FILTER", precio: 15000, stock: 45, estado: "Disponible" },
            { nombre: "Pastillas de freno delanteras", categoria: "Frenos", marca: "Brembo", precio: 35000, stock: 23, estado: "Disponible" },
            { nombre: "Aceite motor 5W-30 sintético 1L", categoria: "Lubricantes", marca: "Mobil 1", precio: 28000, stock: 8, estado: "Stock bajo" }
        ];

        const doc = new PDFDocument();
        const chunks = [];
        doc.on('data', c => chunks.push(c));
        doc.on('end', () => {
            const buf = Buffer.concat(chunks);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=reporte_inventario.pdf");
            res.send(buf);
        });

        doc.fontSize(20).text("Reporte de Inventario", 50, 50);
        doc.moveDown();
        inventoryData.forEach((product, index) => {
            doc.text(`${index + 1}. Producto: ${product.nombre}`);
            doc.text(`   Categoría: ${product.categoria}`);
            doc.text(`   Marca: ${product.marca}`);
            doc.text(`   Precio: $${product.precio.toFixed(2)}`);
            doc.text(`   Stock: ${product.stock} unidades`);
            doc.text(`   Estado: ${product.estado}`);
            doc.moveDown(0.5);
        });

        doc.end();
    } catch (error) {
        return ApiResponse.error(res, 500, "Error generando reporte de inventario");
    }
}

export async function inventoryXlsx(req, res) {
    try {
        if (req.user.rol !== "admin") return ApiResponse.error(res, 403, "No autorizado");

        const inventoryData = [
            { nombre: "Filtro de aceite para Toyota Corolla", categoria: "Filtros", marca: "MANN-FILTER", precio: 15000, stock: 45, estado: "Disponible" },
            { nombre: "Pastillas de freno delanteras", categoria: "Frenos", marca: "Brembo", precio: 35000, stock: 23, estado: "Disponible" },
            { nombre: "Aceite motor 5W-30 sintético 1L", categoria: "Lubricantes", marca: "Mobil 1", precio: 28000, stock: 8, estado: "Stock bajo" }
        ];

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventario');
        worksheet.columns = [
            { header: 'Producto', key: 'nombre', width: 40 },
            { header: 'Categoría', key: 'categoria', width: 20 },
            { header: 'Marca', key: 'marca', width: 20 },
            { header: 'Precio', key: 'precio', width: 15 },
            { header: 'Stock', key: 'stock', width: 10 },
            { header: 'Estado', key: 'estado', width: 15 }
        ];
        inventoryData.forEach(row => worksheet.addRow({ ...row, precio: `$${row.precio.toFixed(2)}` }));
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte_inventario.xlsx");
        res.send(buffer);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error generando XLSX de inventario");
    }
}

