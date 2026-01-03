import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Order, OrderItem, Product } from "../models/index.js";

export class ReportService {
  static async generateSalesData() {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: OrderItem,
            include: [{ model: Product, attributes: ['nombre', 'precio'] }]
          }
        ],
        order: [['creado_en', 'DESC']]
      });

      if (!orders || orders.length === 0) {
        return {
          data: [
            {
              fecha: "2024-10-01",
              cliente: "Demo",
              productos: "N/A",
              total: 0,
              estado: "Demo"
            }
          ]
        };
      }

      const salesData = orders.map(order => ({
        fecha: new Date(order.creado_en).toLocaleDateString(),
        cliente: order.id.toString(),
        productos: order.OrderItems?.map(oi => oi.Product?.nombre).join(', ') || 'N/A',
        total: order.total || 0,
        estado: order.estado || 'pendiente'
      }));

      return { data: salesData };
    } catch (error) {
      throw {
        code: 'SALES_DATA_ERROR',
        message: 'Error generating sales data',
        error
      };
    }
  }

  static async generateSalesPdf() {
    try {
      const salesResult = await this.generateSalesData();
      const salesData = salesResult.data;

      return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

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
      });
    } catch (error) {
      throw {
        code: 'SALES_PDF_ERROR',
        message: 'Error generating sales PDF',
        error
      };
    }
  }

  static async generateSalesXlsx() {
    try {
      const salesResult = await this.generateSalesData();
      const salesData = salesResult.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ventas");

      worksheet.columns = [
        { header: "Fecha", key: "fecha", width: 15 },
        { header: "Cliente", key: "cliente", width: 15 },
        { header: "Productos", key: "productos", width: 30 },
        { header: "Total", key: "total", width: 12 },
        { header: "Estado", key: "estado", width: 12 }
      ];

      salesData.forEach(row => worksheet.addRow(row));

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      throw {
        code: 'SALES_XLSX_ERROR',
        message: 'Error generating sales XLSX',
        error
      };
    }
  }

  static async generatePublicSalesPdf() {
    try {
      const salesData = [
        { product: "Filtro de Aceite Bosch", quantity: 45, revenue: 1147.50 },
        { product: "Pastillas de Freno Brembo", quantity: 23, revenue: 1955.00 },
        { product: "Aceite Motor Mobil 1", quantity: 67, revenue: 3015.00 },
        { product: "Batería Bosch S4", quantity: 12, revenue: 1440.00 },
        { product: "Filtro de Aire K&N", quantity: 34, revenue: 1020.00 }
      ];

      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.fontSize(20).text("Reporte de Ventas - RepuestosAuto", { align: 'center' });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`);
        doc.text("Tipo: Resumen público de ventas");
        doc.moveDown();

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

        doc.end();
      });
    } catch (error) {
      throw {
        code: 'PUBLIC_SALES_PDF_ERROR',
        message: 'Error generating public sales PDF',
        error
      };
    }
  }

  static async generatePublicSalesXlsx() {
    try {
      const salesData = [
        { product: "Filtro de Aceite Bosch", quantity: 45, revenue: 1147.50 },
        { product: "Pastillas de Freno Brembo", quantity: 23, revenue: 1955.00 },
        { product: "Aceite Motor Mobil 1", quantity: 67, revenue: 3015.00 },
        { product: "Batería Bosch S4", quantity: 12, revenue: 1440.00 },
        { product: "Filtro de Aire K&N", quantity: 34, revenue: 1020.00 }
      ];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ventas Públicas");

      worksheet.columns = [
        { header: "Producto", key: "product", width: 30 },
        { header: "Cantidad", key: "quantity", width: 12 },
        { header: "Ingresos", key: "revenue", width: 15 }
      ];

      salesData.forEach(row => worksheet.addRow(row));

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      throw {
        code: 'PUBLIC_SALES_XLSX_ERROR',
        message: 'Error generating public sales XLSX',
        error
      };
    }
  }
}
