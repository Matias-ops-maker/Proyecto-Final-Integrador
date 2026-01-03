import { ReportService } from "../services/reportService.js";
import { ApiResponse } from "../helpers/apiHelpers.js";

export async function publicSalesPdf(req, res) {
    try {
        const pdfBuffer = await ReportService.generatePublicSalesPdf();
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-ventas-publico.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error generando reporte PDF");
    }
}

export async function publicSalesXlsx(req, res) {
    try {
        const buffer = await ReportService.generatePublicSalesXlsx();
        
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-ventas-publico.xlsx");
        res.send(buffer);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error generando reporte Excel");
    }
}

export async function publicInventoryPdf(req, res) {
    try {
        const { default: PDFDocument } = await import("pdfkit");
        
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=reporte-inventario-publico.pdf");
            res.send(Buffer.concat(chunks));
        });
        doc.on('error', () => {
            return ApiResponse.error(res, 500, "Error generando PDF");
        });

        doc.fontSize(20).text("Reporte de Inventario - RepuestosAuto", { align: 'center' });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
        doc.text("Tipo: Resumen público de inventario");
        doc.moveDown();

        const inventoryData = [
            { product: "Filtro de Aceite Bosch", stock: 150, category: "Filtros", status: "Disponible" },
            { product: "Pastillas de Freno Brembo", stock: 75, category: "Frenos", status: "Disponible" },
            { product: "Aceite Motor Mobil 1", stock: 200, category: "Aceites", status: "Disponible" },
            { product: "Batería Bosch S4", stock: 25, category: "Eléctrica", status: "Bajo Stock" },
            { product: "Filtro de Aire K&N", stock: 5, category: "Filtros", status: "Crítico" }
        ];

        doc.fontSize(14).text("Estadísticas de Inventario:", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Total de productos: ${inventoryData.length}`);
        doc.text(`Stock total: ${inventoryData.reduce((sum, item) => sum + item.stock, 0)} unidades`);
        doc.text(`Productos con bajo stock: ${inventoryData.filter(item => item.stock < 50).length}`);

        doc.end();
    } catch (error) {
        return ApiResponse.error(res, 500, "Error generando reporte PDF");
    }
}

export async function publicInventoryXlsx(req, res) {
    try {
        const { default: ExcelJS } = await import("exceljs");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventario');

        worksheet.columns = [
            { header: 'Producto', key: 'product', width: 30 },
            { header: 'Stock Actual', key: 'stock', width: 15 },
            { header: 'Categoría', key: 'category', width: 20 },
            { header: 'Estado', key: 'status', width: 15 }
        ];

        const inventoryData = [
            { product: "Filtro de Aceite Bosch", stock: 150, category: "Filtros", status: "Disponible" },
            { product: "Pastillas de Freno Brembo", stock: 75, category: "Frenos", status: "Disponible" },
            { product: "Aceite Motor Mobil 1", stock: 200, category: "Aceites", status: "Disponible" },
            { product: "Batería Bosch S4", stock: 25, category: "Eléctrica", status: "Bajo Stock" },
            { product: "Filtro de Aire K&N", stock: 5, category: "Filtros", status: "Crítico" }
        ];

        inventoryData.forEach(row => worksheet.addRow(row));
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-inventario-publico.xlsx");
        res.send(buffer);
    } catch (error) {
        return ApiResponse.error(res, 500, "Error generando reporte Excel");
    }
}
