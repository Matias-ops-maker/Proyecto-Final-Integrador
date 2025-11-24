import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export async function publicSalesPdf(req, res) {
    try {
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-ventas-publico.pdf");
        
        doc.pipe(res);

        doc.fontSize(20).text("Reporte de Ventas - RepuestosAuto", { align: 'center' });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`);
        doc.text("Tipo: Resumen público de ventas");
        doc.moveDown();

        const salesData = [
            { product: "Filtro de Aceite Bosch", quantity: 45, revenue: 1147.50 },
            { product: "Pastillas de Freno Brembo", quantity: 23, revenue: 1955.00 },
            { product: "Aceite Motor Mobil 1", quantity: 67, revenue: 3015.00 },
            { product: "Batería Bosch S4", quantity: 12, revenue: 1440.00 },
            { product: "Filtro de Aire K&N", quantity: 34, revenue: 1020.00 }
        ];

        doc.fontSize(14).text("Estadísticas Generales:", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Total de productos vendidos: ${salesData.reduce((sum, item) => sum + item.quantity, 0)}`);
        doc.text(`Ingresos totales: $${salesData.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}`);
        doc.text(`Productos diferentes: ${salesData.length}`);
        doc.moveDown();

        doc.fontSize(14).text("Productos Más Vendidos:", { underline: true });
        doc.moveDown(0.5);
        
        const tableTop = doc.y;
        const tableLeft = 50;
        const rowHeight = 25;
        const colWidths = [250, 80, 100];

        doc.fontSize(10);
        doc.text("Producto", tableLeft, tableTop);
        doc.text("Cantidad", tableLeft + colWidths[0], tableTop);
        doc.text("Ingresos", tableLeft + colWidths[0] + colWidths[1], tableTop);
        
        doc.moveTo(tableLeft, tableTop + 15)
           .lineTo(tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop + 15)
           .stroke();

        salesData.forEach((item, index) => {
            const y = tableTop + (index + 1) * rowHeight;
            doc.text(item.product, tableLeft, y);
            doc.text(item.quantity.toString(), tableLeft + colWidths[0], y);
            doc.text(`$${item.revenue.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1], y);
        });

        doc.fontSize(8);
        doc.text("RepuestosAuto - Reporte generado automáticamente", 50, doc.page.height - 50, { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: "Error generando reporte PDF" });
    }
}

export async function publicSalesXlsx(req, res) {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ventas');

        worksheet.columns = [
            { header: 'Producto', key: 'product', width: 30 },
            { header: 'Cantidad Vendida', key: 'quantity', width: 15 },
            { header: 'Ingresos', key: 'revenue', width: 15 },
            { header: 'Precio Promedio', key: 'avgPrice', width: 15 }
        ];

        const salesData = [
            { product: "Filtro de Aceite Bosch", quantity: 45, revenue: 1147.50, avgPrice: 25.50 },
            { product: "Pastillas de Freno Brembo", quantity: 23, revenue: 1955.00, avgPrice: 85.00 },
            { product: "Aceite Motor Mobil 1", quantity: 67, revenue: 3015.00, avgPrice: 45.00 },
            { product: "Batería Bosch S4", quantity: 12, revenue: 1440.00, avgPrice: 120.00 },
            { product: "Filtro de Aire K&N", quantity: 34, revenue: 1020.00, avgPrice: 30.00 }
        ];

        salesData.forEach(row => {
            worksheet.addRow(row);
        });

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };

        const totalRow = worksheet.addRow({
            product: 'TOTAL',
            quantity: salesData.reduce((sum, item) => sum + item.quantity, 0),
            revenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
            avgPrice: ''
        });
        totalRow.font = { bold: true };

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-ventas-publico.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: "Error generando reporte Excel" });
    }
}

export async function publicInventoryPdf(req, res) {
    try {
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-inventario-publico.pdf");
        
        doc.pipe(res);

        doc.fontSize(20).text("Reporte de Inventario - RepuestosAuto", { align: 'center' });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`);
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
        doc.moveDown();

        doc.fontSize(14).text("Estado del Inventario:", { underline: true });
        doc.moveDown(0.5);
        
        const tableTop = doc.y;
        const tableLeft = 50;
        const rowHeight = 25;

        doc.fontSize(10);
        doc.text("Producto", tableLeft, tableTop);
        doc.text("Stock", tableLeft + 200, tableTop);
        doc.text("Categoría", tableLeft + 260, tableTop);
        doc.text("Estado", tableLeft + 360, tableTop);
        
        doc.moveTo(tableLeft, tableTop + 15)
           .lineTo(tableLeft + 450, tableTop + 15)
           .stroke();

        inventoryData.forEach((item, index) => {
            const y = tableTop + (index + 1) * rowHeight;
            doc.text(item.product, tableLeft, y);
            doc.text(item.stock.toString(), tableLeft + 200, y);
            doc.text(item.category, tableLeft + 260, y);
            doc.text(item.status, tableLeft + 360, y);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: "Error generando reporte PDF" });
    }
}

export async function publicInventoryXlsx(req, res) {
    try {
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

        inventoryData.forEach(row => {
            worksheet.addRow(row);
        });

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };

        const totalRow = worksheet.addRow({
            product: 'TOTAL PRODUCTOS',
            stock: inventoryData.reduce((sum, item) => sum + item.stock, 0),
            category: inventoryData.length + ' tipos',
            status: 'Resumen'
        });
        totalRow.font = { bold: true };

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-inventario-publico.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: "Error generando reporte Excel" });
    }
}
