import { forwardRef, useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

const PrintableAgreementDetails = forwardRef(({ agreement }, ref) => {
  // State to hold the image representation of the PDF
  const [tcImage, setTcImage] = useState(null);
  
  // Helper function to determine if a file is an image based on its extension
  const isImageFile = (fileUrl) => /\.(jpg|jpeg|png|gif)$/i.test(fileUrl);
  const isPDFFile = (fileUrl) => /\.pdf$/i.test(fileUrl);
  
  // Effect to convert PDF to Image
  useEffect(() => {
    const convertPdfToImage = async (pdfUrl) => {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      // Get the first page of the PDF
      const page = await pdf.getPage(1);
      const scale = 1.5; // Scale for the rendered image
      const viewport = page.getViewport({ scale });

      // Prepare canvas using PDF page dimensions
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      // Convert canvas to image URL
      setTcImage(canvas.toDataURL());
    };

    if (agreement.tc_file && isPDFFile(agreement.tc_file)) {
      convertPdfToImage(agreement.tc_file);
    }
  }, [agreement.tc_file]);

  useEffect(() => {
    console.log('Terms & Conditions File:', agreement.tc_file);
    console.log('Signed Agreement File:', agreement.signed_agreement);
  }, [agreement]);

  return (
    <div ref={ref} className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Client Agreement</h1>
      <div className="space-y-4">
        {/* Client Information */}
        <h2 className="text-xl font-semibold">Client Information</h2>
        <p><strong>Client Name:</strong> {agreement.clientName}</p>
        <p><strong>Company Name:</strong> {agreement.company_name}</p>
        <p><strong>CR Number:</strong> {agreement.cr_number}</p>
        <p><strong>Baladiya:</strong> {agreement.baladiya}</p>
        <p><strong>Project Name:</strong> {agreement.project_name}</p>
        
        {/* Agreement Details */}
        <h2 className="text-xl font-semibold mt-6">Agreement Details</h2>
        <p><strong>Quotation Number:</strong> {agreement.quotation_number}</p>
        <p><strong>Payment Date:</strong> {agreement.payment_date}</p>
        <p><strong>Project Start Date:</strong> {agreement.project_start_date}</p>
        <p><strong>Project End Date:</strong> {agreement.project_end_date}</p>
        
        {/* Payment Terms as Table */}
        <h2 className="text-xl font-semibold mt-6">Payment Terms</h2>
        {agreement.payment_terms && agreement.payment_terms.length > 0 ? (
          <table className="w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left border-b">Date</th>
                <th className="py-2 px-3 text-left border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {agreement.payment_terms.map((term) => (
                <tr key={term.id}>
                  <td className="py-2 px-3 border-b">{term.date}</td>
                  <td className="py-2 px-3 border-b">{term.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payment terms available.</p>
        )}
        
        {/* Total Amount below the table */}
        {agreement.total_amount && (
          <p className="mt-4"><strong>Total Amount:</strong> {agreement.total_amount}</p>
        )}
        
        {/* Terms & Conditions and Signed Agreement */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Additional Documents</h2>
          
          {/* Displaying Terms & Conditions */}
          <p><strong>Terms & Conditions:</strong></p>
  {tcImage ? (
    <img src={tcImage} alt="Terms & Conditions" className="mt-4" />
  ) : (
    <a href={agreement.tc_file} className="text-blue-500 underline">Download Terms & Conditions</a>
  )}

          {/* Displaying Signed Agreement */}
          <p className="mt-6"><strong>Signed Agreement:</strong></p>
          {isImageFile(agreement.signed_agreement) ? (
            <img src={agreement.signed_agreement} alt="Signed Agreement" className="mt-4" />
          ) : isPDFFile(agreement.signed_agreement) ? (
            <iframe
              src={agreement.signed_agreement}
              width="100%"
              height="500px"
              title="Signed Agreement"
              className="mt-4"
            ></iframe>
          ) : (
            <a href={agreement.signed_agreement} className="text-blue-500 underline">Download Signed Agreement</a>
          )}
        </div>
      </div>
    </div>
  );
});

export default PrintableAgreementDetails;
