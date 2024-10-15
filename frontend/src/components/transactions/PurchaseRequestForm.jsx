import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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
import { api, fetchSuppliers, fetchStoreProducts, fetchPurchaseRequest } from "@/services/api";

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

const PurchaseRequestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
          fetchStoreProducts()
        ]);
        setSuppliers(suppliersData.results);
        setProducts(productsData.results);

        if (id) {
          const purchaseRequest = await fetchPurchaseRequest(id);
          reset(purchaseRequest);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      let response;
      if (id) {
        response = await api.put(`/purchase-requests/${id}/`, data);
      } else {
        response = await api.post("/purchase-requests/", data);
      }
      console.log("Purchase request saved:", response.data);
      navigate("/purchase-requests");
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
    const selectedProduct = products.find(p => p.id.toString() === productId);
    if (selectedProduct) {
      setValue(`items.${index}.unit_price`, selectedProduct.price);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 bg-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6">
        {id ? "Edit Purchase Request" : "New Purchase Request"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col">
                <Label htmlFor="expected_delivery_date" className="mb-1">Expected Delivery Date</Label>
                <Controller
                  name="expected_delivery_date"
                  control={control}
                  render={({ field }) => (
                    <Input id="expected_delivery_date" type="date" {...field} />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="supplier" className="mb-1">Supplier</Label>
                <Controller
                  name="supplier"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Supplier" />
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
                  <span className="text-red-500 text-sm">
                    {errors.supplier.message}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Product" />
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
                        {...register(`items.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...register(`items.${index}.unit_price`, {
                          valueAsNumber: true,
                        })}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={(watchedItems[index].quantity * watchedItems[index].unit_price).toFixed(2)}
                        readOnly
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
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

            <div className="w-full flex justify-end mb-4 mt-4">
              <Button
                onClick={() =>
                  append({ product: "", quantity: 1, unit_price: 0 })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
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
                <Label>Notes</Label>
                <Textarea {...register("notes")} />
              </div>
              <Card>
                <CardContent className="mt-6">
                  <div className="flex justify-between items-center font-bold">
                    <span>Grand Total</span>
                    <Input
                      type="number"
                      value={total.toFixed(2)}
                      className="w-32"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <div className="space-x-2">
            <Button type="submit">{id ? "Update" : "Submit"}</Button>
            <Button variant="outline" type="button" onClick={() => navigate("/purchase-requests")}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default PurchaseRequestForm;