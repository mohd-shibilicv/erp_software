import React from "react";

const InvoiceWithFooter = React.forwardRef(({ items, customerAccount, invoiceNumber, invoiceDate, calculateSubTotal, footerImage, calculateTotalDiscount, calculateTotalTax }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Invoice</h1>
      <div className="mb-4">
        <p><strong>Invoice Number:</strong> {invoiceNumber}</p>
        <p><strong>Date:</strong> {invoiceDate}</p>
        <p><strong>Customer:</strong> {customerAccount}</p>
      </div>

      <div className="flex-grow">
        <table className="w-full mb-4 border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 w-12">SL</th>
              <th className="text-left py-2 px-2 w-20">Code</th>
              <th className="text-left py-2 px-2">Item</th>
              <th className="text-right py-2 px-2 w-20">Quantity</th>
              <th className="text-right py-2 px-2 w-24">Discount(%)</th>
              <th className="text-center py-2 px-2 w-24">Tax</th>
              <th className="text-right py-2 px-2 w-24">Unit Price</th>
              <th className="text-right py-2 px-2 w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="text-left py-2 px-2">{item.id || 'N/A'}</td>
                <td className="text-left py-2 px-2 font-mono">{item?.product?.code || 'N/A'}</td>
                <td className="text-left py-2 px-2">{item.product?.name || 'N/A'}</td>
                <td className="text-center py-2 px-2">{item.quantity}</td>
                <td className="text-center py-2 px-2">{item.discount} %</td>
                <td className="text-center py-2 px-2">{item.taxRate}</td>
                <td className="text-center py-2 px-2">{item.unitPrice.toFixed(2)}</td>
                <td className="text-right py-2 px-2">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right">
          <p><strong>Subtotal:</strong> {calculateSubTotal().toFixed(2)}</p>
          <p><strong>Discount:</strong> {calculateTotalDiscount().toFixed(2)}</p>
          <p><strong>Total Tax:</strong> {calculateTotalTax().toFixed(2)}</p>
          <p className="text-xl font-bold mt-4">
            <strong>Total:</strong> {calculateSubTotal().toFixed(2)}
          </p>
        </div>
      </div>

      {footerImage && (
        <div className="pb-2">
          <img src={footerImage} alt="Footer" className="w-full h-32 object-cover" />
        </div>
      )}
    </div>
  );
});


export default InvoiceWithFooter;
