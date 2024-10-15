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
  DialogDescription,
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
import { ScrollArea } from "../ui/scroll-area";
import { api, fetchSuppliers, fetchStoreProducts, fetchLPO } from "@/services/api";

const schema = z.object({
  supplier: z.string().nonempty({ message: "Supplier is required" }),
  lpo: z.string().nullable(),
  date: z.string().nonempty({ message: "Date is required" }),
  status: z.enum(["Pending", "Completed", "Cancelled"]),
  remarks: z.string().optional(),
  items: z
    .array(
      z.object({
        product: z.string().nonempty({ message: "Product is required" }),
        sku: z.string().optional(),
        quantity: z.number().positive({ message: "Quantity must be positive" }),
        unit_price: z
          .number()
          .nonnegative({ message: "Unit price must be non-negative" }),
      })
    )
    .nonempty({ message: "At least one item is required" }),
});

const PurchaseModal = ({ isOpen, onClose, purchaseId }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [lpos, setLPOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceDocumentUrl, setInvoiceDocumentUrl] = useState(null);
  const [lpoItems, setLPOItems] = useState([]);

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
      lpo: null,
      date: new Date().toISOString().split("T")[0],
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
        const [suppliersData, productsData, lposData] = await Promise.all([
          fetchSuppliers(),
          fetchStoreProducts(),
          api.get("/local-purchase-orders/"),
        ]);
        setSuppliers(suppliersData.results);
        setProducts(productsData.results);
        setLPOs(lposData.data.results);

        if (purchaseId) {
          const purchase = await api.get(`/purchases/${purchaseId}/`);
          // Convert supplier id to string
          purchase.data.supplier = purchase.data.supplier.toString();
          // Convert LPO id to string if it exists, otherwise set to null
          purchase.data.lpo = purchase.data.lpo ? purchase.data.lpo.toString() : null;
          // Convert product ids to strings in items array
          purchase.data.items = purchase.data.items.map((item) => ({
            ...item,
            product: item.product.toString(),
          }));
          reset(purchase.data);
          setInvoiceDocumentUrl(purchase.data.invoice_document);
        } else {
          reset({
            supplier: "",
            lpo: null,
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
            remarks: "",
            items: [{ product: "", quantity: 1, unit_price: 0 }],
          });
          setInvoiceDocumentUrl(null);
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
  }, [purchaseId, reset, isOpen]);

  const loadLPOItems = async (lpoId) => {
    try {
      const response = await api.get(`/local-purchase-orders/${lpoId}/items/`);
      setLPOItems(response.data);
      return response.data;
    } catch (error) {
      console.error("Error loading LPO items:", error);
      return [];
    }
  };

  const handleLPOChange = async (lpoId) => {
    setValue("lpo", lpoId);
    const items = await loadLPOItems(lpoId);
    
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
      const purchaseData = {
        supplier: data.supplier,
        lpo: data.lpo || null,
        date: data.date,
        status: data.status,
        remarks: data.remarks,
        items: formattedItems
      };

      let response;
      if (purchaseId) {
        response = await api.put(`/purchases/${purchaseId}/`, purchaseData);
      } else {
        response = await api.post("/purchases/", purchaseData);
      }

      // Handle file upload separately if there's a new file
      if (data.invoice_document && data.invoice_document[0] instanceof File) {
        const formData = new FormData();
        formData.append('invoice_document', data.invoice_document[0]);
        await api.patch(`/purchases/${response.data.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving purchase:", error);
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
      setValue(`items.${index}.sku`, selectedProduct.sku); // Add this line
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4">
          <DialogTitle>
            {purchaseId ? "Edit Purchase" : "New Purchase"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow">
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
                  <Label htmlFor="lpo">Local Purchase Order</Label>
                  <Controller
                    name="lpo"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleLPOChange(value);
                        }}
                        value={field.value || undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select LPO" />
                        </SelectTrigger>
                        <SelectContent>
                          {lpos.map((lpo) => (
                            <SelectItem key={lpo.id} value={lpo.id.toString()}>
                              {lpo.lpo_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    {...register("date")}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm">{errors.date.message}</p>
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
                          <SelectItem value="Completed">Completed</SelectItem>
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
                <Label htmlFor="invoice_document">Invoice Document</Label>
                <div className="flex items-center space-x-2">
                  <Input type="file" {...register("invoice_document")} />
                  {invoiceDocumentUrl && (
                    <a
                      href={invoiceDocumentUrl}
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
                    <TableHead>Code</TableHead>
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
                          type="text"
                          {...register(`items.${index}.sku`)}
                          readOnly
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;