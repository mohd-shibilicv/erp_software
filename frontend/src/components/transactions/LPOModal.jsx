import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  api,
  fetchSuppliers,
  fetchStoreProducts,
  fetchLPO,
  fetchPurchaseRequests,
} from "@/services/api";
import { ScrollArea } from "../ui/scroll-area";
import Loader from "../layout/Loader";
import { DialogDescription } from "@radix-ui/react-dialog";

const schema = z.object({
  supplier: z.string().nonempty({ message: "Supplier is required" }),
  purchase_request: z.string().optional(),
  delivery_date: z.string().nonempty({ message: "Delivery date is required" }),
  status: z.enum(["Pending", "Approved", "Cancelled"]),
  remarks: z.string().optional(),
  quotation_document: z.any().optional(),
  items: z
    .array(
      z.object({
        product: z.string().nonempty({ message: "Product is required" }),
        quantity: z.number().positive({ message: "Quantity must be positive" }),
        unit_price: z
          .number()
          .nonnegative({ message: "Unit price must be non-negative" }),
      })
    )
    .nonempty({ message: "At least one item is required" }),
});

const LPOModal = ({ isOpen, onClose, lpoId }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quotationDocumentUrl, setQuotationDocumentUrl] = useState(null);
  const [purchaseRequestItems, setPurchaseRequestItems] = useState([]);

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      supplier: "",
      purchase_request: "",
      delivery_date: new Date().toISOString().split("T")[0],
      status: "Pending",
      remarks: "",
      items: [{ product: "", quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [suppliersData, productsData, purchaseRequestsData] = await Promise.all([
          fetchSuppliers(),
          fetchStoreProducts(),
          fetchPurchaseRequests(),
        ]);
        setSuppliers(suppliersData.results);
        setProducts(productsData.results);
        setPurchaseRequests(purchaseRequestsData.results);

        if (lpoId) {
          const lpo = await fetchLPO(lpoId);
          // Convert supplier id to string
          lpo.supplier = lpo.supplier.toString();
          // Convert purchase request id to string if it exists, otherwise set to null
          lpo.purchase_request = lpo.purchase_request ? lpo.purchase_request.toString() : null;
          // Convert product ids to strings in items array
          lpo.items = lpo.items.map((item) => ({
            ...item,
            product: item.product.toString(),
          }));
          reset(lpo);
          setQuotationDocumentUrl(lpo.quotation_document);
        } else {
          reset({
            supplier: "",
            purchase_request: null,
            delivery_date: new Date().toISOString().split("T")[0],
            status: "Pending",
            remarks: "",
            items: [{ product: "", quantity: 1, unit_price: 0 }],
          });
          setQuotationDocumentUrl(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) {
      loadData();
    }
  }, [lpoId, reset, isOpen]);

  const loadPurchaseRequestItems = async (purchaseRequestId) => {
    try {
      const response = await api.get(`/purchase-requests/${purchaseRequestId}/items/`);
      setPurchaseRequestItems(response.data);
      return response.data;
    } catch (error) {
      console.error("Error loading purchase request items:", error);
      return [];
    }
  };

  const handlePurchaseRequestChange = async (purchaseRequestId) => {
    setValue("purchase_request", purchaseRequestId);
    const items = await loadPurchaseRequestItems(purchaseRequestId);
    
    // Auto-fill the items
    const formattedItems = items.map(item => ({
      product: item.product.toString(),
      quantity: item.quantity,
      unit_price: item.unit_price
    }));
    
    setValue("items", formattedItems);
  };

  const onSubmit = async (data) => {
    try {
      // Convert the items to the format expected by the backend
      const formattedItems = data.items.map(item => ({
        product: item.product,
        quantity: parseFloat(item.quantity),
        unit_price: parseFloat(item.unit_price),
        total_price: parseFloat(item.quantity) * parseFloat(item.unit_price)
      }));

      // Prepare the data object
      const lpoData = {
        supplier: data.supplier,
        purchase_request: data.purchase_request || null,
        delivery_date: data.delivery_date,
        status: data.status,
        remarks: data.remarks,
        items: formattedItems
      };

      let response;
      if (lpoId) {
        response = await api.put(`/local-purchase-orders/${lpoId}/`, lpoData);
      } else {
        response = await api.post("/local-purchase-orders/", lpoData);
      }

      // Handle file upload separately if there's a new file
      if (data.quotation_document && data.quotation_document[0] instanceof File) {
        const formData = new FormData();
        formData.append('quotation_document', data.quotation_document[0]);
        await api.patch(`/local-purchase-orders/${response.data.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("LPO saved:", response.data);
      onClose();
    } catch (error) {
      console.error("Error saving LPO:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  const calculateTotal = (items) => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
  };

  const watchedItems = watch("items");
  const total = calculateTotal(watchedItems);

  const handleProductChange = (index, productId) => {
    const selectedProduct = products.find((p) => p.id.toString() === productId);
    if (selectedProduct) {
      setValue(`items.${index}.unit_price`, selectedProduct.price);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4">
          <DialogTitle>
            {lpoId ? "Edit Local Purchase Order" : "New Local Purchase Order"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-grow"
        >
          <ScrollArea className="flex-grow px-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Controller
                  name="supplier"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.supplier && (
                  <p className="text-red-500 text-sm">{errors.supplier.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="purchase_request">Purchase Request</Label>
                <Controller
                  name="purchase_request"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handlePurchaseRequestChange(value);
                      }}
                      value={field.value || undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select purchase request" />
                      </SelectTrigger>
                      <SelectContent>
                        {purchaseRequests.map((pr) => (
                          <SelectItem key={pr.id} value={pr.id.toString()}>
                            {pr.request_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="delivery_date">Delivery Date</Label>
                <Input
                  type="date"
                  {...register("delivery_date")}
                />
                {errors.delivery_date && (
                  <p className="text-red-500 text-sm">{errors.delivery_date.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status.message}</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea {...register("remarks")} />
            </div>
            <div className="mb-4">
              <Label htmlFor="quotation_document">Quotation Document</Label>
              <div className="flex items-center space-x-2">
                <Input type="file" {...register("quotation_document")} />
                {quotationDocumentUrl && (
                  <a
                    href={quotationDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:text-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View
                  </a>
                )}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Controller
                        name={`items.${index}.product`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleProductChange(index, value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id.toString()}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                      />
                    </TableCell>
                    <TableCell>
                      {(watchedItems[index]?.quantity || 0) *
                        (watchedItems[index]?.unit_price || 0)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ product: "", quantity: 1, unit_price: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <div className="mt-4 text-right font-bold">Total: {total}</div>
          </ScrollArea>
          <div className="flex justify-end gap-2 p-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LPOModal;