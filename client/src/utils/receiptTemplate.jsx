export const generateReceiptHTML = (order) => {
  const date = new Date(order.orderDate).toLocaleString();
  const items = order.items
    .map(
      (item) => `
    <tr>
      <td>${item?.name || "Unknown Item"}</td>
      <td>${item.quantity}x</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Receipt</title>
      <style>
        @page {
          size: 80mm 200mm;
          margin: 0;
        }
        body {
          font-family: 'Courier New', monospace;
          width: 76mm;
          margin: 0;
          padding: 2mm;
          font-size: 12pt;
        }
        .header {
          text-align: center;
          margin-bottom: 3mm;
        }
        .store-name {
          font-size: 17pt;
          font-weight: bold;
        }
        .receipt-info {
          margin: 2mm 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        },
        th, td {
          text-align: left;
          padding: 1mm 0;
        }
        .total {
          margin-top: 3mm;
          border-top: 1px dashed #000;
          padding-top: 2mm;
        }
        .footer {
          margin-top: 4mm;
          text-align: center;
          font-size: 10pt;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="store-name">KIOSK ${order.storeType.toUpperCase()}</div>
        <div>Receipt #${order.receiptNumber}</div>
        <div>${date}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${items}
        </tbody>
      </table>
      
      <div class="total">
        <strong>Total: $${order.totalPrice.toFixed(2)}</strong>
      </div>
      
      <div class="footer">
        Thank you for shopping with us!
      </div>
    </body>
    </html>
  `;
};
