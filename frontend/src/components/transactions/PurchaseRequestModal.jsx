import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";
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
import {
  api,
  fetchSuppliers,
  fetchStoreProducts,
  fetchPurchaseRequest,
} from "@/services/api";
import { ScrollArea } from "../ui/scroll-area";
import Loader from "../layout/Loader";

const schema = z.object({
  supplier: z.string().nonempty({ message: "Supplier is required" }),
  expected_delivery_date: z
    .string()
    .nonempty({ message: "Expected delivery date is required" }),
  status: z.enum(["Draft", "Approved", "Rejected"]),
  notes: z.string().optional(),
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

const PurchaseRequestModal = ({ isOpen, onClose, purchaseRequestId }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      expected_delivery_date: new Date().toISOString().split("T")[0],
      status: "Draft",
      notes: "",
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
        const [suppliersData, productsData] = await Promise.all([
          fetchSuppliers(),
          fetchStoreProducts(),
        ]);
        setSuppliers(suppliersData.results);
        setProducts(productsData.results);

        if (purchaseRequestId) {
          const purchaseRequest = await fetchPurchaseRequest(purchaseRequestId);
          // Convert supplier id to string
          purchaseRequest.supplier = purchaseRequest.supplier.toString();
          // Convert product ids to strings in items array
          purchaseRequest.items = purchaseRequest.items.map((item) => ({
            ...item,
            product: item.product.toString(),
          }));
          reset(purchaseRequest);
        } else {
          reset({
            supplier: "",
            expected_delivery_date: new Date().toISOString().split("T")[0],
            status: "Draft",
            notes: "",
            items: [{ product: "", quantity: 1, unit_price: 0 }],
          });
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
  }, [purchaseRequestId, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      let response;
      if (purchaseRequestId) {
        response = await api.put(
          `/purchase-requests/${purchaseRequestId}/`,
          data
        );
      } else {
        response = await api.post("/purchase-requests/", data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving purchase request:", error);
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
      setValue(`items.${index}.sku_code`, selectedProduct.sku);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4">
          <DialogTitle>
            {purchaseRequestId
              ? "Edit Purchase Request"
              : "New Purchase Request"}
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
                <Label htmlFor="expected_delivery_date">
                  Expected Delivery Date
                </Label>
                <Controller
                  name="expected_delivery_date"
                  control={control}
                  render={({ field }) => (
                    <Input id="expected_delivery_date" type="date" {...field} />
                  )}
                />
                {errors.expected_delivery_date && (
                  <span className="text-red-500 text-sm">
                    {errors.expected_delivery_date.message}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Controller
                  name="supplier"
                  control={control}
                  render={({ field }) => {
                    const selectedSupplier = suppliers.find(
                      (s) => s.id.toString() === field.value
                    );
                    return (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setValue("supplier", value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Supplier">
                            {selectedSupplier
                              ? selectedSupplier.name
                              : "Select Supplier"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={supplier.id.toString()}
                            >
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                {errors.supplier && (
                  <span className="text-red-500 text-sm">
                    {errors.supplier.message}
                  </span>
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
                        render={({ field }) => {
                          const selectedProduct = products.find(
                            (p) => p.id.toString() === field.value
                          );
                          return (
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProductChange(index, value);
                              }}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Product">
                                  {selectedProduct
                                    ? selectedProduct.name
                                    : "Select Product"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id.toString()}
                                  >
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        {...register(`items.${index}.sku_code`)}
                        readOnly
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...register(`items.${index}.unit_price`, {
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={(
                          watchedItems[index].quantity *
                          watchedItems[index].unit_price
                        ).toFixed(2)}
                        readOnly
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
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
              onClick={() =>
                append({ product: "", quantity: 1, unit_price: 0 })
              }
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea {...register("notes")} />
              </div>
              <div>
                <Label>Grand Total</Label>
                <Input type="number" value={total.toFixed(2)} readOnly />
              </div>
            </div>
          </ScrollArea>

          <div className="w-full flex justify-end gap-2 px-6 py-4">
            <Button type="submit">
              {purchaseRequestId ? "Update" : "Submit"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseRequestModal;
