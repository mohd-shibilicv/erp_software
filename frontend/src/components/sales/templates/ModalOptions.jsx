import React, { useRef,useState } from 'react'
import InvoicePrint from './InvoicePrint';
import InvoiceWithHeaderFooter from './InvoiceWithHeaderFooter'
import InvoiceWithHeader from './InvoiceWithHeader';
import InvoiceWithFooter from './InvoiceWithFooter';
import { useReactToPrint } from 'react-to-print';



const ModalOptions = ({ onClose, items, customerAccount, invoiceNumber, invoiceDate, calculateSubTotal, calculateTotalDiscount,calculateTotalTax  }) => {
    const [selectedInvoiceType, setSelectedInvoiceType] = useState(null);
    const [headerImage, setHeaderImage] = useState(null);
    const [footerImage, setFooterImage] = useState(null);
    const [isImageProvided, setIsImageProvided] = useState(false);
    const invoicePrintRef = useRef();
  
    const handlePrintContent = useReactToPrint({
      content: () => invoicePrintRef.current,
    });
  
    const handleInvoiceSelection = (type) => {
        setSelectedInvoiceType(type);
        if (type === "headerFooter" || type === "header" || type === "footer") {
          setIsImageProvided(false);
        } else if (type === "noHeaderFooter") {
          handlePrintContent();
        }
      };
  
    const handleImageUpload = () => {
      if (selectedInvoiceType === "headerFooter") {
        if (headerImage && footerImage) {
          setIsImageProvided(true);
          handlePrintContent();
        } else {
          alert("Please provide both header and footer images.");
        }
      } else if (selectedInvoiceType === "header") {
        if (headerImage) {
          setIsImageProvided(true);
          handlePrintContent();
        } else {
          alert("Please provide a header image.");
        }
      } else if (selectedInvoiceType === "footer") {
        if (footerImage) {
          setIsImageProvided(true);
          handlePrintContent();
        } else {
          alert("Please provide a footer image.");
        }
      }
    };
  
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Invoice Generator</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Select Invoice Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: "headerFooter", label: "With Header and Footer" },
                  { type: "header", label: "With Header" },
                  { type: "footer", label: "With Footer" },
                  { type: "noHeaderFooter", label: "Without Header and Footer" },
                ].map(({ type, label }) => (
                  <div
                    key={type}
                    onClick={() => handleInvoiceSelection(type)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedInvoiceType === type ? 'bg-violet-100 border-violet-400' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-medium text-gray-700 text-center">{label}</h4>
                  </div>
                ))}
              </div>
            </div>
            
            {(selectedInvoiceType === "headerFooter" || selectedInvoiceType === "header" || selectedInvoiceType === "footer") && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 2: Upload Images</h3>
                <div className="space-y-4">
                  {selectedInvoiceType !== "footer" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Header Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setHeaderImage(URL.createObjectURL(e.target.files[0]))}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                      {headerImage && (
                        <div className="mt-2 p-2 border border-violet-200 rounded-md">
                          <img src={headerImage} alt="Header" className="max-h-20 object-contain mx-auto" />
                        </div>
                      )}
                    </div>
                  )}
                  {selectedInvoiceType !== "header" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Footer Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFooterImage(URL.createObjectURL(e.target.files[0]))}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                      {footerImage && (
                        <div className="mt-2 p-2 border border-violet-200 rounded-md">
                          <img src={footerImage} alt="Footer" className="max-h-20 object-contain mx-auto" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleImageUpload}
              className="w-full px-4 py-3 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors text-lg font-semibold"
            >
              Generate Invoice
            </button>
          </div>
        </div>
      
        {/* Hidden components for printing */}
<div style={{ display: "none" }}>
  {selectedInvoiceType === "headerFooter" && (
    <InvoiceWithHeaderFooter
      ref={invoicePrintRef}
      items={items}
      customerAccount={customerAccount}
      invoiceNumber={invoiceNumber}
      invoiceDate={invoiceDate}
      calculateSubTotal={calculateSubTotal}
      headerImage={headerImage}
      footerImage={footerImage}
      calculateTotalDiscount={calculateTotalDiscount}
      calculateTotalTax={calculateTotalTax}
    />
  )}
  {selectedInvoiceType === "header" && (
    <InvoiceWithHeader
      ref={invoicePrintRef}
      items={items}
      customerAccount={customerAccount}
      invoiceNumber={invoiceNumber}
      invoiceDate={invoiceDate}
      calculateSubTotal={calculateSubTotal}
      headerImage={headerImage}
      calculateTotalDiscount={calculateTotalDiscount}
      calculateTotalTax={calculateTotalTax}
    />
  )}
  {selectedInvoiceType === "footer" && (
    <InvoiceWithFooter
      ref={invoicePrintRef}
      items={items}
      customerAccount={customerAccount}
      invoiceNumber={invoiceNumber}
      invoiceDate={invoiceDate}
      calculateSubTotal={calculateSubTotal}
      footerImage={footerImage}
      calculateTotalDiscount={calculateTotalDiscount}
      calculateTotalTax={calculateTotalTax}
    />
  )}
  {selectedInvoiceType === "noHeaderFooter" && (
    <InvoicePrint
      ref={invoicePrintRef}
      items={items}
      customerAccount={customerAccount}
      invoiceNumber={invoiceNumber}
      invoiceDate={invoiceDate}
      calculateSubTotal={calculateSubTotal}
      calculateTotalDiscount={calculateTotalDiscount}
      calculateTotalTax={calculateTotalTax}
    />
  )}
</div>
      </div>
    );
  };
  
export default ModalOptions;
    







