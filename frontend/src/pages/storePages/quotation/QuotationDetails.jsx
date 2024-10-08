import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Trash2, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clientQuotation } from '@/services/crmServiceApi';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
const QuotationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      try {
        const response = await api.get(`/quotations/${id}/`);
        console.log("Received quotation data:", response.data);
        setQuotation(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quotation details", error);
        setError("Failed to load quotation details");
        setLoading(false);
      }
    };
    fetchQuotationDetails();
  }, [id]);
  const handleBackClick = () => {
    navigate(-1);
  };
  const handleUpdateClick = async () => {
    try {
      navigate(`/admin/quotation/new/${id}`);
    } catch (error) {
      setError("Error updating client requirement.");
    }
  };
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await clientQuotation.delete(id);
      setShowDeleteDialog(false);
      navigate('/admin/quotation', { replace: true });
    } catch (error) {
      console.error("Error deleting quotation", error);
      setError("Failed to delete quotation");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'QAR',
    }).format(value);
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Quotation Details</h2>
      {quotation ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
              <span className="font-semibold">Quotation Number:</span> <span>{quotation.quotation_number}</span>
              <span className="font-semibold">Version:</span> <span>{quotation.version}</span>
              <span className="font-semibold">Status:</span> <span>{quotation.status}</span>
              <span className="font-semibold">Created At:</span> <span>{new Date(quotation.created_at).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
              <span className="font-semibold">Valid Until:</span> <span>{quotation.valid_until}</span>
              <span className="font-semibold">Client:</span> <span>{quotation.client_name}</span>
              <span className="font-semibold">Client Reference:</span> <span>{quotation.client_reference}</span>
              <span className="font-semibold">Assigned To:</span> <span>{quotation.assigned_to_user || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
              <span className="font-semibold">Requires Approval:</span> <span>{quotation.requires_approval ? 'Yes' : 'No'}</span>
              <span className="font-semibold">Approved By:</span> <span>{quotation.approved_by?.username}</span>
              <span className="font-semibold">Approved At:</span> <span>{quotation.approved_at ? new Date(quotation.approved_at).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
            <span className="font-semibold">Created By:</span> <span>{quotation.created_by_username}</span>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <p>{quotation.notes}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Terms and Conditions:</h3>
              <p>{quotation.terms_and_conditions}</p>
            </div>
          </div>
          
          {/* Items Table with Integrated Totals */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Tax %</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotation.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_sku}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell>{item.discount_percentage}%</TableCell>
                    <TableCell>{item.tax_percentage}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-semibold">Subtotal:</TableCell>
                  <TableCell className="text-right">{formatCurrency(quotation.subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-semibold">Discount Amount:</TableCell>
                  <TableCell className="text-right">{formatCurrency(quotation.discount_amount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-bold">Total Amount:</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(quotation.total_amount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {showDeleteDialog && (
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this quotation?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the quotation.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBackClick}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Back
            </button>
            <div className="space-x-2">
              {id && (
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={isLoading}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button variant="default" onClick={handleUpdateClick} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p>No details found for this quotation.</p>
      )}
    </div>
  );
};

export default QuotationDetails;