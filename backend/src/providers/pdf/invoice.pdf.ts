import PDFDocument from "pdfkit";
import type { Order, OrderItem } from "@prisma/client";

type InvoiceOrder = Order & { items: OrderItem[] };

export function generateInvoicePdf(order: InvoiceOrder): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("CareKart", { continued: true }).fontSize(10).text("  Tax Invoice", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#555").text(`Invoice for Order ${order.orderNumber}`);
    doc.text(`Date: ${order.placedAt.toDateString()}`);
    doc.fillColor("#000");
    doc.moveDown();

    doc.fontSize(11).text("Bill To / Ship To", { underline: true });
    doc.fontSize(10).text(order.shipName);
    doc.text(order.shipLine1);
    if (order.shipLine2) doc.text(order.shipLine2);
    doc.text(`${order.shipCity}, ${order.shipState} - ${order.shipPincode}`);
    doc.text(`Phone: ${order.shipPhone}`);
    if (order.billingGstin) doc.text(`GSTIN: ${order.billingGstin}`);
    doc.moveDown();

    const tableTop = doc.y;
    const columns = { name: 50, qty: 300, price: 360, gst: 430, total: 490 };
    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Item", columns.name, tableTop);
    doc.text("Qty", columns.qty, tableTop);
    doc.text("Unit Price", columns.price, tableTop);
    doc.text("GST", columns.gst, tableTop);
    doc.text("Total", columns.total, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).stroke();

    doc.font("Helvetica");
    let y = tableTop + 22;
    for (const item of order.items) {
      doc.fontSize(9);
      doc.text(`${item.productName} (${item.sizeLabel})`, columns.name, y, { width: 240 });
      doc.text(String(item.quantity * item.packQty), columns.qty, y);
      doc.text(`₹${Number(item.unitPrice).toFixed(2)}`, columns.price, y);
      doc.text(`${Number(item.gstRate).toFixed(1)}%`, columns.gst, y);
      doc.text(`₹${Number(item.lineTotal).toFixed(2)}`, columns.total, y);
      y += 20;
    }

    doc.moveTo(50, y + 5).lineTo(545, y + 5).stroke();
    y += 15;

    const summaryLine = (label: string, value: string, bold = false) => {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(10);
      doc.text(label, 380, y, { width: 100 });
      doc.text(value, columns.total, y);
      y += 16;
    };

    summaryLine("Subtotal", `₹${Number(order.subtotal).toFixed(2)}`);
    if (Number(order.discountAmount) > 0) {
      summaryLine("Discount", `-₹${Number(order.discountAmount).toFixed(2)}`);
    }
    summaryLine("Shipping", Number(order.shippingAmount) === 0 ? "FREE" : `₹${Number(order.shippingAmount).toFixed(2)}`);
    summaryLine("GST (included)", `₹${Number(order.taxAmount).toFixed(2)}`);
    summaryLine("Total", `₹${Number(order.totalAmount).toFixed(2)}`, true);

    doc.moveDown(2);
    doc.fontSize(8).fillColor("#888").text("This is a computer-generated invoice and does not require a signature.", 50, y + 20);

    doc.end();
  });
}
