import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { salesOrderService } from "../../services/purchaseService";
import { fetchClients, fetchStoreProducts } from "../../services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  client: z.string().min(1, "Client is required"),
  expected_delivery_date: z
    .string()
    .min(1, "Expected delivery date is required"),
  status: z.enum(["Draft", "Confirmed", "Cancelled"]),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        product: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unit_price: z.number().min(0, "Unit price must be non-negative"),
      })
    )
    .min(1, "At least one item is required"),
});

const SalesOrderModal = ({ isOpen, onClose, salesOrder, onSave }) => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [salesOrderId, setSalesOrderId] = useState(null);

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
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
    setSalesOrderId(salesOrder?.id);

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [clientsData, productsData] = await Promise.all([
          fetchClients(),
          fetchStoreProducts(),
        ]);
        setClients(clientsData.results);
        setProducts(productsData.results);

        if (salesOrder) {
          reset({
            client: salesOrder?.client?.toString() || "",
            expected_delivery_date: format(
              new Date(salesOrder.expected_delivery_date),
              "yyyy-MM-dd"
            ),
            status: salesOrder.status,
            notes: salesOrder.notes,
            items: salesOrder.items.map((item) => ({
              product: item.product.toString(),
              quantity: item.quantity,
              unit_price: item.unit_price,
            })),
          });
        } else {
          reset({
            client: "",
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
  }, [salesOrderId, reset, isOpen]);

  const handleProductChange = (index, productId) => {
    const selectedProduct = products.find((p) => p.id.toString() === productId);
    if (selectedProduct) {
      setValue(`items.${index}.unit_price`, selectedProduct.price);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (salesOrder) {
        await salesOrderService.updateSalesOrder(salesOrderId, data);
      } else {
        await salesOrderService.createSalesOrder(data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving sales order:", error);
    }
  };

  const watchedItems = watch("items");
  const total = watchedItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0),
    0
  );

  const handleCancel = () => {
    reset(); // Reset the form
    onClose(); // Close the modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4">
          <DialogTitle>
            {salesOrder ? "Edit Sales Order" : "New Sales Order"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-grow"
          >
            <ScrollArea className="flex-grow px-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Controller
                    name="client"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Client">
                            {field.value
                              ? clients.find(
                                  (c) => c.id.toString() === field.value
                                )?.name
                              : "Select Client"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id.toString()}
                            >
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.client && (
                    <p className="text-red-500 text-sm">
                      {errors.client.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="expected_delivery_date">
                    Expected Delivery Date
                  </Label>
                  <Input type="date" {...register("expected_delivery_date")} />
                  {errors.expected_delivery_date && (
                    <p className="text-red-500 text-sm">
                      {errors.expected_delivery_date.message}
                    </p>
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
                                <SelectValue placeholder="Select Product">
                                  {field.value
                                    ? products.find(
                                        (p) => p.id.toString() === field.value
                                      )?.name
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
                          )}
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
                        {(
                          (watchedItems[index]?.quantity || 0) *
                          (watchedItems[index]?.unit_price || 0)
                        ).toFixed(2)}
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                {salesOrder ? "Update" : "Submit"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalesOrderModal;
