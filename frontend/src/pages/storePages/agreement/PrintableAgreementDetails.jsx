/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { getOrdinalSuffix } from "@/lib/getNumberOrderSuffix";

const PrintableAgreementDetails = forwardRef(({ agreement }, ref) => {
  const [tcImage, setTcImage] = useState(null);

  // Helper function to determine if a file is an image based on its extension
  const isImageFile = (fileUrl) => /\.(jpg|jpeg|png|gif)$/i.test(fileUrl);
  const isPDFFile = (fileUrl) => /\.pdf$/i.test(fileUrl);

  // Effect to convert PDF to Image
  useEffect(() => {
    const convertPdfToImage = async (pdfUrl) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.min.mjs`;
      const loadingTask = pdfjsLib.getDocument(pdfUrl);

      const pdf = await loadingTask.promise;

      // Get the first page of the PDF
      const page = await pdf.getPage(1);
      const scale = 1.5; // Scale for the rendered image
      const viewport = page.getViewport({ scale });

      // Prepare canvas using PDF page dimensions
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
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
    console.log("Terms & Conditions File:", agreement.tc_file);
    console.log("Signed Agreement File:", agreement.signed_agreement);
  }, [agreement]);

  return (
    <div ref={ref} className="printable-content p-6 bg-gray-50">
      <div className="w-full mb-2">
        <img src="/nasscript_full_banner_logo.png" className="h-5" alt="" />
      </div>
      <h1 className="text-[13px] underline font-bold mb-1 text-center">
        Software End User License Agreement
      </h1>
      <div className="">
        <p className="text-[10px] text-black">
          This License agreement is made between{" "}
          <b>“{agreement.project_name}”</b>
          (Herein referred to as “The End User”) and <b>NASSCRIPT</b> (Herein
          referred to as “Reseller”) on behalf of{" "}
          <b>NASSCRIPT SOFTWARE INNOVATIONS, DOHA, QATAR CR 160099</b>
        </p>
      </div>
      <div className="mt-2">
        <p className="text-[10px] text-black">
          <b className="underline">NOTICE TO USER:</b> Please read this License
          Agreement carefully. By using all or any portion of “The Software”,
          you accept all the Terms and Conditions of this agreement.
        </p>
      </div>

      <div className="mt-2 w-full flex flex-col gap-1">
        <h2 className="font-semibold text-[10px]">Client Information: </h2>
        <div className=" border-black border">
          <div className="grid grid-cols-12 min-h-7 border-b border-black">
            <div className="col-span-3 px-1 flex items-center border-r border-black">
              <span className="font-semibold text-[9.4px]">Client name</span>
            </div>
            <div className="col-span-3 px-1 flex items-center border-r border-black">
              <span className="font-semibold text-[9.4px]">Company name</span>
            </div>
            <div className="col-span-2 px-1 flex items-center border-r border-black">
              <span className="font-semibold text-[9.4px]">Project name</span>
            </div>
            <div className="col-span-2 px-1 flex items-center border-r border-black">
              <span className="font-semibold text-[9.4px]">Cr No.</span>
            </div>
            <div className="col-span-2 px-1 flex items-center ">
              <span className="font-semibold text-[9.4px]">Baladiya</span>
            </div>
          </div>
          <div className="grid grid-cols-12 min-h-8 border-b ">
            <div className="col-span-3 p-1 border-r border-black">
              <span className="text-[9.4px]">{agreement.clientName}</span>
            </div>
            <div className="col-span-3 p-1 border-r border-black">
              <span className="text-[9.4px]">{agreement.company_name}</span>
            </div>
            <div className="col-span-2 p-1 border-r border-black">
              <span className=" text-[9.4px]">{agreement.project_name}</span>
            </div>
            <div className="col-span-2 p-1 border-r border-black">
              <span className=" text-[9.4px]"> {agreement.cr_number}</span>
            </div>
            <div className="col-span-2 p-1 ">
              <span className=" text-[9.4px]">{agreement.baladiya}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 w-full flex flex-col gap-1">
        <h2 className="font-semibold text-[10px]">Agreement Details: </h2>
        <div className=" border-black border">
          <div className="grid grid-cols-12 min-h-7 border-b border-black">
            <div className="col-span-4 px-1 flex items-center border-r border-black">
              <span className="font-semibold text-[9.4px]">
                Quotation Number
              </span>
            </div>
            <div className="col-span-4 px-1 flex items-center border-r border-black">
              <span className="font-semibold text-[9.4px]">Payment Date</span>
            </div>
            <div className="col-span-2 px-1 flex items-center border-r border-black">
              <span className="font-semibold text-[9.4px]">Project Start</span>
            </div>
            <div className="col-span-2 px-1 flex items-center ">
              <span className="font-semibold text-[9.4px]">Project end</span>
            </div>
          </div>
          <div className="grid grid-cols-12 min-h-8 border-b ">
            <div className="col-span-4 p-1 border-r border-black">
              <span className="text-[9.4px]">{agreement.quotation_number}</span>
            </div>
            <div className="col-span-4 p-1 border-r border-black">
              <span className="text-[9.4px]">{agreement.payment_date}</span>
            </div>
            <div className="col-span-2 p-1 border-r border-black">
              <span className=" text-[9.4px]">
                {agreement.project_start_date}
              </span>
            </div>
            <div className="col-span-2 p-1 ">
              <span className=" text-[9.4px]">
                {" "}
                {agreement.project_end_date}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {/* Client Information */}
        {/* <h2 className="text-xl font-semibold">Client Information</h2>
        <p>
          <strong>Client Name:</strong> {agreement.clientName}
        </p>
        <p>
          <strong>Company Name:</strong> {agreement.company_name}
        </p>
        <p>
          <strong>CR Number:</strong> {agreement.cr_number}
        </p>
        <p>
          <strong>Baladiya:</strong> {agreement.baladiya}
        </p>
        <p>
          <strong>Project Name:</strong> {agreement.project_name}
        </p> */}

        {/* Agreement Details */}
        {/* <h2 className="text-xl font-semibold mt-6">Agreement Details</h2>
        <p>
          <strong>Quotation Number:</strong> {agreement.quotation_number}
        </p>
        <p>
          <strong>Payment Date:</strong> {agreement.payment_date}
        </p>
        <p>
          <strong>Project Start Date:</strong> {agreement.project_start_date}
        </p>
        <p>
          <strong>Project End Date:</strong> {agreement.project_end_date}
        </p> */}

        {/* Payment Terms as Table */}
        {/* <h2 className="text-xl font-semibold mt-6">Payment Terms</h2>
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
        )} */}

        {/* Total Amount below the table */}
        {/* {agreement.total_amount && (
          <p className="mt-4">
            <strong>Total Amount:</strong> {agreement.total_amount}
          </p>
        )} */}

        {/* Terms & Conditions and Signed Agreement */}
        <div className="mt-6 hidden">
          <h2 className="text-xl font-semibold">Additional Documents</h2>

          {/* Displaying Terms & Conditions */}
          <p>
            <strong>Terms & Conditions:</strong>
          </p>
          {tcImage ? (
            <>
              <img src={tcImage} alt="Terms & Conditions" className="mt-4" />
            </>
          ) : (
            <>
              <iframe
                src={agreement.tc_file}
                className="w-full h-[200px] border"
                type=""
              />
              {/* <a href={agreement.tc_file} className="text-blue-500 underline">Download Terms & Conditions</a> */}
            </>
          )}

          {/* Displaying Signed Agreement */}
          <p className="mt-6">
            <strong>Signed Agreement:</strong>
          </p>
          {isImageFile(agreement.signed_agreement) ? (
            <img
              src={agreement.signed_agreement}
              alt="Signed Agreement"
              className="mt-4"
            />
          ) : isPDFFile(agreement.signed_agreement) ? (
            <iframe
              src={agreement.signed_agreement}
              width="100%"
              height="300px"
              title="Signed Agreement"
              className="mt-4"
            ></iframe>
          ) : (
            <>
              <a
                href={agreement.signed_agreement}
                className="text-blue-500 underline"
              >
                Download Signed Agreement
              </a>
            </>
          )}
        </div>
      </div>
      <div className="mt-3">
        <div>
          <h2 className="font-semibold text-[10px]">Estimated Cost: -</h2>
        </div>
        <div className="mt-2 w-full border border-black flex flex-col">
          <div className="w-full border-b border-black grid grid-cols-12 min-h-8">
            <div className="h-full col-span-1 p-1 border-r border-black">
              <span className="font-semibold text-[9.4px] ">Sr.#</span>
            </div>
            <div className="h-full col-span-6 p-1 border-r border-black">
              <span className="font-semibold text-[9.4px] border-r">
                Description
              </span>
            </div>
            <div className="h-full col-span-2 p-1 flex flex-col gap-1 border-black border-r">
              <span className="font-semibold text-[9.4px] ">Rate</span>
              <span className="font-semibold text-[9.4px] ">{"(QAR)"}</span>
            </div>
            <div className="h-full col-span-1 p-1 border-r border-black">
              <span className="font-semibold text-[9.4px] ">Qty</span>
            </div>
            <div className="h-full col-span-2 p-1 flex flex-col gap-1">
              <span className="font-semibold text-[9.4px] ">Amount</span>
              <span className="font-semibold text-[9.4px] ">{"(QAR)"}</span>
            </div>
          </div>
          <div className="w-full  grid grid-cols-12 min-h-16">
            <div className="h-full col-span-1 p-1 border-r border-black">
              <span className="text-[8.4px] ">1. </span>
            </div>
            <div className="h-full col-span-6 p-1 flex flex-col gap-1 border-r border-black">
              <p className="text-[10px]">Project based on mentioned scope</p>
              <ul className="ml-4 list-disc">
                <li className="text-[10px]">
                  The Complete Trading and Accounting Management Solution
                </li>
              </ul>
            </div>
            <div className="h-full col-span-2 p-1 flex flex-col gap-1 border-r border-black">
              <span className="font-semibold text-[9.4px]">19000</span>
            </div>
            <div className="h-full col-span-1 p-1 border-r border-black">
              <span className="font-semibold text-[9.4px] ">
                <span className="font-semibold">1</span>
              </span>
            </div>
            <div className="h-full col-span-2 p-1 flex flex-col gap-1">
              <span className="font-semibold text-[9.4px]">19000</span>
            </div>
          </div>
          <div className="w-full border-b grid grid-cols-12 min-h-6 border-t border-black">
            <div className="col-span-10 border-r border-black h-full px-1 flex items-center">
              <span className="text-[10px] font-semibold">Grand Total</span>
            </div>
            <div className="col-span-2 h-full px-1 flex items-center">
              <span className="text-[10px] font-semibold">
                {agreement.total_amount}
              </span>
            </div>
          </div>
          <div className="w-full h-5 border-b border-black"></div>
          <div className="w-full min-h-28  p-1">
            <div className="w-full flex gap-1 text-black text-[10px]">
              <span>✓</span> <span>Payment Terms:</span>
            </div>
            <div className="pl-4">
              <ul className=" ml-4" style={{ listStyleType: "circle" }}>
                {agreement?.payment_terms?.map((term, I) => (
                  <li key={term?.id} className="text-[10px]">
                    {I + 1}
                    <sup>{getOrdinalSuffix(I + 1)}</sup>
                    {"  "}
                    QR {term?.amount} Advance (AS PER DISCUSSION) DATE –{" "}
                    {term?.date}
                  </li>
                ))}
                {/* <li className="text-[10px]">
                  1 <sup>st</sup> QR 6000 Advance (AS PER DISCUSSION) DATE – 2 –
                  06-2024
                </li>
                <li className="text-[10px]">
                  QR 6000 Advance (AS PER DISCUSSION) DATE – 2 – 06-2024
                </li>
                <li className="text-[10px]">
                  QR 6000 Advance (AS PER DISCUSSION) DATE – 2 – 06-2024
                </li>
                <li className="text-[10px]">
                  QR 6000 Advance (AS PER DISCUSSION) DATE – 2 – 06-2024
                </li> */}
              </ul>
            </div>
            <div className="w-full mt-2 flex gap-1 text-black text-[10px]">
              <span>✓</span>{" "}
              <span>
                Warranty – 1 Year from the date of hosting on live server
              </span>
            </div>
            <div className="w-full flex gap-1 text-black text-[10px]">
              <span>✓</span>{" "}
              <span>
                AMC Charge after 1 Year Warranty Period: 10% of the net
                installation cost
              </span>
            </div>
            <div className="w-full flex gap-1 text-black text-[10px]">
              <span>
                Delivery Time – 60 Days from the date of receipt of advance.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="w-full mb-2">
          <img src="/nasscript_full_banner_logo.png" className="h-5" alt="" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-[10px]">
            For NASSCRIPT Software Innovations:
          </h4>
          <p className="text-[10px]">
            This Agreement represents the entire agreement between the parties
            concerning the subject matter hereof and supersedes all prior
            agreements, understandings, and representations
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 mt-5">
        <h2 className="text-center font-bold text-[10px]">
          Nasscript Software Innovations
        </h2>
        <p className="text-[11px]">
          Doha, Qatar | Email:{" "}
          <a
            href="mailto:info@nasscript.com"
            className="text-blue-500 underline"
          >
            info@nasscript.com
          </a>{" "}
          | Website:{" "}
          <a href="www.nasscript.com" className="text-blue-500 underline">
            www.nasscript.com
          </a>
        </p>
      </div>
    </div>
  );
});

export default PrintableAgreementDetails;
