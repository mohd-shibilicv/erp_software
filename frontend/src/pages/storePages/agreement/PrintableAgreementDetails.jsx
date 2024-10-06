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
    <div ref={ref} className="printable-content p-6 bg-white">
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
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">
          1. IPR of Software and Database
        </h3>

        <div className="flex">
          <span className="text-[10px]">1.1</span>
          <div>
            <p className="text-[10px]">
              Ownership: All rights, title, and interest in and to the Software,
              including all intellectual property rights, are and shall remain
              the exclusive property of NASSCRIPT.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">1.2</span>
          <div>
            <p className="text-[10px]">
              Usage Restrictions: The Software is licensed, not sold, and is
              intended solely for use by the End User on a limited number of
              client computers as specified in the associated quotation. The End
              User is prohibited from copying, duplicating, selling, or
              otherwise distributing the Software without the prior written
              consent of NASSCRIPT. Any unauthorized use of the Software is a
              violation of both this Agreement and applicable laws.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">1.3</span>
          <div>
            <p className="text-[10px]">
              Database Protection: The database structures within the Software
              {`(such as "ezyTrade")`} are copyrighted and proprietary to
              NASSCRIPT. The End User shall not use any third-party software to
              view, read, or write to this database without prior written
              approval from NASSCRIPT. Copying or distributing the database and
              its contents, other than for backup purposes, is strictly
              prohibited.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">1.4</span>
          <div>
            <p className="text-[10px]">
              Reverse Engineering: The End User shall not reverse engineer,
              decompile, disassemble, or attempt to derive the source code of
              the Software
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">2. License Grant</h3>

        <div className="flex">
          <span className="text-[10px]">1.1</span>
          <div>
            <p className="text-[10px]">
              Ownership: All rights, title, and interest in and to the Software,
              including all intellectual property rights, are and shall remain
              the exclusive property of NASSCRIPT.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">2.1</span>
          <div>
            <p className="text-[10px]">
              License: NASSCRIPT grants the End User a non-exclusive,
              non-transferable license to use the Software under the terms and
              conditions outlined in this Agreement.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">2.2</span>
          <div>
            <p className="text-[10px]">
              Transferability: The End User may not assign, transfer, or
              sublicense the Software or this Agreement to any other party
              without the express written consent of NASSCRIPT.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">2.3</span>
          <div>
            <p className="text-[10px]">
              Support and Maintenance: The license includes free support and
              maintenance for one (1) year from the date of installation. Beyond
              this period, support and maintenance will be subject to a separate
              maintenance agreement.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">
          3. Support / Service / Maintenance
        </h3>

        <div className="flex">
          <span className="text-[10px]">3.1</span>
          <div>
            <p className="text-[10px]">
              Support and Maintenance Terms: - Free Support: The End User is
              entitled to free support and maintenance for one (1) year
              following the installation of the Software. - Maintenance
              Contract: After the first year, a maintenance contract must be
              signed to continue receiving support services. In the absence of a
              maintenance contract, support services will be available at a
              fixed fee per incident. - Scope of Services: Support services
              include technical assistance via telephone, email, or remote
              desktop access. Fault reporting must be submitted in writing to
              <a
                href="mailto:support@nasscript.com"
                className="text-blue-500 underline"
              >
                support@nasscript.com
              </a>
              , detailing the circumstances under which the fault occurred.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">3.2</span>
          <div>
            <p className="text-[10px]">
              Priority Levels: Support services will address defects according
              to the following priority levels: - Priority Level 1: Complete
              loss of service; response within 1 working hour, with a workaround
              or resolution within 1 working day. - Priority Level 2: Severe
              loss of service; response within 2 working hours, with a
              workaround or resolution within 3 working days. - Priority Level
              3: Minor loss of service; response within 1 working day, with
              resolution in the next software release or within 2 months. -
              Priority Level 4: No loss of service, minor errors; response
              within 1 working day, with resolution in the next software
              release.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">3.3</span>
          <div>
            <p className="text-[10px]">
              Software Upgrades: Major software upgrades, which include new
              features or substantial enhancements, may be offered for an
              additional fee.End User software versions will be upgraded to new
              releases at no additional cost if the End User continues with the
              Annual Maintenance Contract (AMC).
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">2.3</span>
          <div>
            <p className="text-[10px]">
              Support and Maintenance: The license includes free support and
              maintenance for one (1) year from the date of installation. Beyond
              this period, support and maintenance will be subject to a separate
              maintenance agreement.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">
          4. Disclaimer of Warranties
        </h3>

        <div className="flex">
          <span className="text-[10px]">4.1</span>
          <div>
            <p className="text-[10px]">
              No Warranty: The Software is provided {`"as is,"`} without any express
              or implied warranties, including but not limited to, warranties of
              performance, merchantability, or fitness for a particular purpose.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">4.2</span>
          <div>
            <p className="text-[10px]">
              Limitation of Liability: NASSCRIPT shall not be liable for any
              consequential, incidental, or special damages arising from the use
              or inability to use the Software, including but not limited to,
              loss of data, profits, or business opportunities, even if
              NASSCRIPT has been advised of the possibility of such damages
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">4.3</span>
          <div>
            <p className="text-[10px]">
              Assumption of Risk: The End User assumes all risks associated with
              the use of the Software, including but not limited to, testing the
              Software before relying on it. NASSCRIPT strongly advises the End
              User to thoroughly test the Software to ensure its suitability for
              their needs
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">
          5. Service warranty period
        </h3>

        <div className="flex">
          <span className="text-[10px]">5.1</span>
          <div>
            <p className="text-[10px]">
              Warranty Coverage: The Software is warranted for one (1) year from
              the date of final implementation or hosting on the End User’s
              servers. This warranty covers any bugs or errors in the Software.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">5.2</span>
          <div>
            <p className="text-[10px]">
              Exclusions: The warranty does not cover modifications, additional
              installations, or reinstallations.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">5.3</span>
          <div>
            <p className="text-[10px]">
              Contract Renewal: To continue receiving service after the warranty
              period, the End User must renew the maintenance contract by
              notifying NASSCRIPT at least 20 days prior to the expiry date.
              Payment for the renewal must be completed at least 7 days before
              the expiry date
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">6. Termination of License</h3>

        <div className="flex">
          <span className="text-[10px]">6.1</span>
          <div>
            <p className="text-[10px]">
              Termination by End User: The End User may terminate this Agreement
              at any time by providing written notice to NASSCRIPT.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">6.2</span>
          <div>
            <p className="text-[10px]">
              Termination by Licensor: NASSCRIPT may terminate this Agreement if
              the End User breaches any of the terms of this Agreement.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">6.3</span>
          <div>
            <p className="text-[10px]">
              Post-Termination Obligations: Upon termination, the End User must
              cease all use of the Software and delete or return any copies of
              the Software and associated documentation.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">7. Confidentiality</h3>

        <div className="flex">
          <span className="text-[10px]">7.1</span>
          <div>
            <p className="text-[10px]">
              Confidential Information: Both parties acknowledge that during the
              term of this Agreement, they may have access to confidential or
              proprietary information of the other party, including but not
              limited to, business operations, financial details, and trade
              secrets.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">7.2</span>
          <div>
            <p className="text-[10px]">
              Non-Disclosure: Each party agrees to hold the other party’s
              confidential information in strict confidence and not to disclose
              such information to any third party without the prior written
              consent of the disclosing party.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">7.3</span>
          <div>
            <p className="text-[10px]">
              Survival of Confidentiality: The confidentiality obligations set
              forth in this Agreement shall survive the termination of this
              Agreement for a period of two (2) years or until such time as the
              confidential information becomes publicly available through no
              fault of the receiving party.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">
          8. Data protection and Privacy
        </h3>

        <div className="flex">
          <span className="text-[10px]">8.1</span>
          <div>
            <p className="text-[10px]">
              Data Protection: NASSCRIPT will comply with applicable data
              protection laws regarding the handling of personal data. The End
              User is responsible for obtaining any necessary consents for the
              processing of data using the Software.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">8.2</span>
          <div>
            <p className="text-[10px]">
              Privacy: NASSCRIPT will implement reasonable measures to protect
              the End {`User's`} data from unauthorized access or disclosure.
              The End User acknowledges that data security is an inherent risk
              and agrees to take reasonable precautions.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">
          9. Governing Law and Jurisdiction
        </h3>

        <div className="flex">
          <span className="text-[10px]">9.1</span>
          <div>
            <p className="text-[10px]">
              Governing Law: This Agreement shall be governed by and construed
              in accordance with the laws of Qatar.
            </p>
          </div>
        </div>
        <div className="flex">
          <span className="text-[10px]">9.2</span>
          <div>
            <p className="text-[10px]">
              Jurisdiction: Any disputes arising out of or in connection with
              this Agreement shall be resolved in the courts of Qatar.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">10. Force Majeure</h3>

        <div className="flex">
          <span className="text-[10px]">10.1</span>
          <div>
            <p className="text-[10px]">
              Force Majeure: Neither party shall be liable for any failure or
              delay in performance under this Agreement due to circumstances
              beyond its reasonable control, including but not limited to,
              natural disasters, wars, pandemics, or governmental actions.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">11. Indemnification </h3>

        <div className="flex">
          <span className="text-[10px]">11.1</span>
          <div>
            <p className="text-[10px]">
              Indemnification: The End User agrees to indemnify, defend, and
              hold harmless NASSCRIPT from any claims, damages, or losses
              arising out of the End User’s misuse of the Software or violation
              of this Agreement.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">12. Audit Rights</h3>

        <div className="flex">
          <span className="text-[10px]">12.1</span>
          <div>
            <p className="text-[10px]">
              Audit Rights: NASSCRIPT reserves the right to audit the End User’s
              use of the Software to ensure compliance with the terms of this
              Agreement. The End User agrees to cooperate with such audits and
              provide necessary access and information
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="font-semibold text-[10px]">
          13. Scope of Work & Commercials{" "}
        </h3>

        <div className="flex">
          <span className="text-[10px]">13.1</span>
          <div>
            <p className="text-[10px]">
              Scope of Work: - Features: The scope of the Software development
              is detailed in the project documentation provided to the End User.
            </p>
          </div>
        </div>
      </div>

<div className="pt-2"></div>
      <div className="mt-2  w-full flex flex-col gap-1">
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
          <div className="grid grid-cols-12 min-h-5 border-b ">
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
              <span className="font-semibold text-[9.4px] ">
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
                  The Complete Project
                </li>
              </ul>
            </div>
            <div className="h-full col-span-2 p-1 flex flex-col gap-1 border-r border-black">
              <span className="font-semibold text-[9.4px]"> {agreement.total_amount}</span>
            </div>
            <div className="h-full col-span-1 p-1 border-r border-black">
              <span className="font-semibold text-[9.4px] ">
                <span className="font-semibold">1</span>
              </span>
            </div>
            <div className="h-full col-span-2 p-1 flex flex-col gap-1">
              <span className="font-semibold text-[9.4px]"> {agreement.total_amount}</span>
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
      <div className="mt-8">
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
      <div className="flex flex-col items-center gap-1 mt-2">
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
