import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { clientAgreement } from "@/services/crmServiceApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableAgreementDetails from "./PrintableAgreementDetails";
import { getFileExtension } from "@/lib/getFileExtension";

const ClientAgreementDetails = () => {
  const { id } = useParams();
  const [agreement, setAgreement] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const response = await clientAgreement.get(id);
        setAgreement(response.data);
      } catch (err) {
        setError(`Failed to fetch agreement details. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAgreement();
  }, [id]);
  if (loading) {
    return <p>Loading...</p>;
  }
  const handleBackClick = () => {
    navigate(-1);
  };
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await clientAgreement.delete(id);
      setShowDeleteDialog(false);
      navigate("/admin/agreement", { replace: true });
    } catch (error) {
      console.error("Error deleting quotation", error);
      setError("Failed to delete quotation");
    } finally {
      setIsLoading(false);
    }
  };
  if (error) {
    return <p>{error}</p>;
  }
  if (!agreement) {
    return <p>No details available</p>;
  }
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Agreement Details</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Client Name:</p>
            <p className="text-gray-700 ml-2">{agreement.clientName}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Quotation Number:</p>
            <p className="text-gray-700 ml-2">{agreement.quotation_number}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Company Name:</p>
            <p className="text-gray-700 ml-2">{agreement.company_name}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">CR Number:</p>
            <p className="text-gray-700 ml-2">{agreement.cr_number}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Baladiya:</p>
            <p className="text-gray-700 ml-2">{agreement.baladiya}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Project Name:</p>
            <p className="text-gray-700 ml-2">{agreement.project_name}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Total Amount:</p>
            <p className="text-gray-700 ml-2">{agreement.total_amount}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Payment Date:</p>
            <p className="text-gray-700 ml-2">{agreement.payment_date}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Project Start Date:</p>
            <p className="text-gray-700 ml-2">{agreement.project_start_date}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700 font-semibold">Project End Date:</p>
            <p className="text-gray-700 ml-2">{agreement.project_end_date}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-blue-500 font-semibold">Terms & Conditions:</p>
            {agreement?.tc_file ? (
              <>
                <div className="flex gap-2">
                  <a
                    href={"#"}
                    className="text-blue-500 underline ml-2 cursor-pointer"
                    // target="_blank"
                    // rel="noopener noreferrer"
                    // download={`terms-and-conditions${getFileExtension(
                    //   agreement.tc_file
                    // )}`}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await fetch(agreement.tc_file);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `terms-and-conditions${getFileExtension(
                          agreement.tc_file
                        )}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Download failed:", error);
                      }
                    }}
                  >
                    Download
                  </a>
                  <a
                    href={agreement.tc_file}
                    target="_blank"
                    className="text-blue-500 underline ml-2 cursor-pointer"
                  >
                    View
                  </a>
                </div>
              </>
            ) : (
              <>
               <div>N/A</div>
              </>
            )}
          </div>
          <div className="flex justify-between">
            <p className="text-blue-500 font-semibold">Signed Agreement:</p>
            {agreement?.signed_agreement ? (
              <>
                <div className="flex-gap-2">
                  <a
                    // download={"signed_agreement"}
                    href={"#"}
                    className="text-blue-500 underline ml-2 cursor-pointer"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await fetch(
                          agreement.signed_agreement
                        );
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `signed_agreement${getFileExtension(
                          agreement.signed_agreement
                        )}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Download failed:", error);
                      }
                    }}
                  >
                    Download
                  </a>
                  <a
                    target="_blank"
                    href={agreement.signed_agreement}
                    className="text-blue-500 underline ml-2 cursor-pointer"
                  >
                    View
                  </a>
                </div>
              </>
            ) : (
              <>
                <div>N/A</div>
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
        Payment Terms
      </h2>
      {agreement.payment_terms && agreement.payment_terms.length > 0 ? (
        <div className="space-y-4">
          {agreement.payment_terms.map((term) => (
            <div key={term.id} className="p-4 bg-gray-100 rounded-md">
              <div className="flex justify-between">
                <p className="text-gray-800 font-semibold">Date:</p>
                <p className="ml-2">{term.date}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-800 font-semibold">Amount:</p>
                <p className="ml-2">{term.amount}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBackClick}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Back
            </button>

            <div className="flex space-x-2">
              {id && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print Agreement
              </Button>
            </div>
          </div>

          {showDeleteDialog && (
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete this quotation?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the quotation.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No payment terms available.</p>
      )}
      {/* Hidden component to print */}
      <div style={{ display: "none" }}>
        <PrintableAgreementDetails ref={printRef} agreement={agreement} />
      </div>
    </div>
  );
};

export default ClientAgreementDetails;
