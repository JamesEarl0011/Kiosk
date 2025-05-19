import PDFDocument from "pdfkit";

export const generateReceiptPDF = (order) => {
  const doc = new PDFDocument({ size: [80, 297] }); // 80mm width (thermal paper size)
  doc.text("Your Store Name", { align: "center" });
  doc.text(`Receipt #: ${order.receiptNumber}`);
  doc.text(`Date: ${order.orderDate.toLocaleString()}`);
  doc.moveDown();

  order.items.forEach((item) => {
    doc.text(`${item.quantity}x ${item.name} - ₱${item.price * item.quantity}`);
  });

  doc.moveDown();
  doc.text(`Total: ₱${order.totalPrice}`, { align: "right" });
  return doc;
};
