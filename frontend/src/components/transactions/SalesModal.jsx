import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { saleService, salesOrderService } from '@/services/purchaseService';
import { fetchClients, fetchStoreProducts } from '@/services/api';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  client: z.string().min(1, "Client is required"),
  sales_order: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["Pending", "Completed", "Cancelled"]),
  notes: z.string().optional(),
  items: z.array(z.object({
    product: z.string().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unit_price: z.number().min(0, "Unit price must be non-negative"),
  })).min(1, "At least one item is required"),
});

const SalesModal = ({ isOpen, onClose, saleId }) => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
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
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      sales_order: "",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
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
        const [clientsData, productsData, salesOrdersData] = await Promise.all([
          fetchClients(),
          fetchStoreProducts(),
          salesOrderService.getAllSalesOrders(),
        ]);
        setClients(clientsData.results);
        setProducts(productsData.results);
        setSalesOrders(salesOrdersData.data.results);

        if (saleId) {
          const saleData = await saleService.getSale(saleId);
          reset({
            client: saleData.client.toString(),
            sales_order: saleData.sales_order ? saleData.sales_order.toString() : "",
            date: format(new Date(saleData.date), "yyyy-MM-dd"),
            status: saleData.status,
            notes: saleData.notes,
            items: saleData.items.map((item) => ({
              product: item.product.toString(),
              quantity: item.quantity,
              unit_price: item.unit_price,
            })),
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
  }, [saleId, reset, isOpen]);

  const handleProductChange = (index, productId) => {
    const selectedProduct = products.find((p) => p.id.toString() === productId);
    if (selectedProduct) {
      setValue(`items.${index}.unit_price`, selectedProduct.price);
    }
  };

  const handleSalesOrderChange = async (salesOrderId) => {
    if (salesOrderId) {
      try {
        const salesOrderData = (await salesOrderService.getSalesOrder(salesOrderId)).data;
        setValue("client", salesOrderData.client);
        setValue("items", salesOrderData.items.map((item) => ({
          product: item.product.toString(),
          quantity: item.quantity,
          unit_price: item.unit_price,
        })));
      } catch (error) {
        console.error("Error fetching sales order data:", error);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedItems = data.items.map(item => ({
        product: item.product,
        quantity: parseFloat(item.quantity),
        unit_price: parseFloat(item.unit_price),
        total_price: parseFloat(item.quantity) * parseFloat(item.unit_price)
      }));

      const saleData = {
        client: data.client,
        sales_order: data.sales_order || null,
        date: data.date,
        status: data.status,
        notes: data.notes,
        items: formattedItems
      };

      if (saleId) {
        await saleService.updateSale(saleId, saleData);
      } else {
        await saleService.createSale(saleData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving sale:", error);
    }
  };

  const watchedItems = watch("items");
  const total = watchedItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0),
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4">
          <DialogTitle>
            {saleId ? "Edit Sale" : "New Sale"}
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
                  <Label htmlFor="client">Client</Label>
                  <Controller
                    name="client"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.client && (
                    <p className="text-red-500 text-sm">{errors.client.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="sales_order">Sales Order</Label>
                  <Controller
                    name="sales_order"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSalesOrderChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sales order" />
                        </SelectTrigger>
                        <SelectContent>
                          {salesOrders.map((order) => (
                            <SelectItem key={order.id} value={order.id.toString()}>
                              {order.order_number}
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea {...register("notes")} />
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
              <div className="mt-4 text-right font-bold">Total: {total.toFixed(2)}</div>
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

export default SalesModal;