import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ScrollArea } from "../ui/scroll-area";
import { api } from "@/services/api";

const schema = z.object({
  purchase: z.string().nonempty({ message: "Purchase is required" }),
  status: z.enum(["Pending", "Approved", "Completed", "Cancelled"]),
  reason: z.string().optional(),
  items: z
    .array(
      z.object({
        purchase_item: z.string().nonempty({ message: "Purchase item is required" }),
        quantity: z.number().positive({ message: "Quantity must be positive" }),
        unit_price: z.number().nonnegative({ message: "Unit price must be non-negative" }),
        sku: z.string().optional(),
      })
    )
    .nonempty({ message: "At least one item is required" }),
});

const PurchaseReturnModal = ({ isOpen, onClose, purchaseReturnId }) => {
  const [purchases, setPurchases] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
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
      purchase: "",
      status: "Pending",
      reason: "",
      items: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [purchasesData] = await Promise.all([
          api.get("/purchases/"),
        ]);
        setPurchases(purchasesData.data.results);

        if (purchaseReturnId) {
          const purchaseReturn = await api.get(`/purchase-returns/${purchaseReturnId}/`);
          const purchaseItems = await loadPurchaseItems(purchaseReturn.data.purchase);
          
          reset({
            purchase: purchaseReturn.data.purchase.toString(),
            status: purchaseReturn.data.status,
            reason: purchaseReturn.data.reason,
            items: purchaseReturn.data.items.map((item) => ({
              purchase_item: item.purchase_item.toString(),
              quantity: item.quantity,
              unit_price: item.unit_price,
              sku: purchaseItems.find(pi => pi.id.toString() === item.purchase_item.toString())?.sku || '',
            })),
          });
        } else {
            reset({
                purchase: "",
                status: "Pending",
                reason: "",
                items: [],
            });
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [purchaseReturnId, reset]);

  const loadPurchaseItems = async (purchaseId) => {
    try {
      const response = await api.get(`/purchases/${purchaseId}/items/`);
      setPurchaseItems(response.data);
      return response.data;
    } catch (error) {
      console.error("Error loading purchase items:", error);
      return [];
    }
  };

  const handlePurchaseChange = async (purchaseId) => {
    setValue("purchase", purchaseId);
    const items = await loadPurchaseItems(purchaseId);
    
    // Auto-fill the items
    const formattedItems = items.map(item => ({
      purchase_item: item.id.toString(),
      quantity: item.quantity,
      unit_price: item.unit_price,
      sku: item.sku,
    }));
    
    replace(formattedItems);
  };

  const onSubmit = async (data) => {
    try {
      if (purchaseReturnId) {
        await api.put(`/purchase-returns/${purchaseReturnId}/`, data);
      } else {
        await api.post("/purchase-returns/", data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving purchase return:", error);
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
            {purchaseReturnId ? "Edit Purchase Return" : "New Purchase Return"}
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
                  <Label htmlFor="purchase">Purchase</Label>
                  <Controller
                    name="purchase"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handlePurchaseChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select purchase">
                            {field.value ? purchases.find(p => p.id.toString() === field.value)?.purchase_number : "Select purchase"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {purchases.map((purchase) => (
                            <SelectItem key={purchase.id} value={purchase.id.toString()}>
                              {purchase.purchase_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.purchase && (
                    <p className="text-red-500 text-sm">{errors.purchase.message}</p>
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
                <Label htmlFor="reason">Reason</Label>
                <Textarea {...register("reason")} />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Input
                          type="text"
                          value={purchaseItems.find(item => item.id.toString() === field.purchase_item)?.product_name || ''}
                          readOnly
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
                          readOnly={!!purchaseReturnId}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                          readOnly
                        />
                      </TableCell>
                      <TableCell>
                        {(watchedItems[index]?.quantity || 0) *
                          (watchedItems[index]?.unit_price || 0)
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

export default PurchaseReturnModal;