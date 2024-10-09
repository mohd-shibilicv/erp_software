"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MultiProductInflowModal({
  isCreateModalOpen,
  setIsCreateModalOpen,
  fetchProductInflows,
  products,
  suppliers,
  api,
}) {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [inflowItems, setInflowItems] = useState([
    {
      id: 1,
      product: "",
      quantity_received: "",
      manufacturing_date: "",
      expiry_date: "",
    },
  ]);
  const [errors, setErrors] = useState({});
  const [openSupplier, setOpenSupplier] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState({});
  const [openMfgDatePopover, setOpenMfgDatePopover] = React.useState({});
  const [openExpiryDatePopover, setOpenExpiryDatePopover] = React.useState({});

  const addInflowItem = () => {
    setInflowItems([
      ...inflowItems,
      {
        id: inflowItems.length + 1,
        product: "",
        quantity_received: "",
        manufacturing_date: "",
        expiry_date: "",
      },
    ]);
  };

  const removeInflowItem = (id) => {
    setInflowItems(inflowItems.filter((item) => item.id !== id));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[id];
      return newErrors;
    });
  };

  const updateInflowItem = (id, field, value) => {
    setInflowItems(
      inflowItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    validateField(id, field, value);
  };

  const validateField = (id, field, value) => {
    let error = "";
    switch (field) {
      case "product":
        if (!value) error = "Product is required";
        break;
      case "quantity_received":
        if (!value) error = "Quantity is required";
        else if (isNaN(value) || parseInt(value) <= 0)
          error = "Quantity must be a positive number";
        break;
      case "manufacturing_date":
        if (value && new Date(value) > new Date())
          error = "Date cannot be in the future";
        break;
      case "expiry_date":
        if (value && new Date(value) < new Date())
          error = "Date cannot be in the past";
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: { ...prevErrors[id], [field]: error },
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!selectedSupplier) {
      formErrors.supplier = "Supplier is required";
    }
    inflowItems.forEach((item) => {
      let itemErrors = {};
      if (!item.product) itemErrors.product = "Product is required";
      if (!item.quantity_received)
        itemErrors.quantity_received = "Quantity is required";
      else if (
        isNaN(item.quantity_received) ||
        parseInt(item.quantity_received) <= 0
      )
        itemErrors.quantity_received = "Quantity must be a positive number";
      if (
        item.manufacturing_date &&
        new Date(item.manufacturing_date) > new Date()
      )
        itemErrors.manufacturing_date =
          "Manufacturing date cannot be in the future";
      if (item.expiry_date && new Date() > new Date(item.expiry_date))
        itemErrors.expiry_date = "Expiry date cannot be in the past";
      if (Object.keys(itemErrors).length > 0) {
        formErrors[item.id] = itemErrors;
      }
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCreateInflow = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const inflowItemsWithSupplier = inflowItems.map((item) => ({
      ...item,
      supplier: selectedSupplier,
    }));

    try {
      await api.post("/product-inflow/", inflowItemsWithSupplier);
      setIsCreateModalOpen(false);
      fetchProductInflows();
      resetForm();
    } catch (error) {
      console.error("Failed to create product inflow:", error);
    }
  };

  const resetForm = () => {
    setSelectedSupplier("");
    setInflowItems([
      {
        id: 1,
        product: "",
        quantity_received: "",
        manufacturing_date: "",
        expiry_date: "",
      },
    ]);
    setErrors({});
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Create Multiple Product Inflows</DialogTitle>
          <DialogDescription>
            Add multiple product inflow records for a single supplier
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateInflow}>
          <div className="mb-4">
            <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSupplier}
                  className={cn(
                    "w-[200px] justify-between",
                    errors.supplier && "border-red-500"
                  )}
                >
                  {selectedSupplier
                    ? suppliers.find(
                        (s) => s.id.toString() === selectedSupplier
                      )?.name
                    : "Select supplier..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search supplier..." />
                  <CommandList>
                    <CommandEmpty>No supplier found.</CommandEmpty>
                    <CommandGroup>
                      {suppliers.map((supplier) => (
                        <CommandItem
                          key={supplier.id}
                          value={supplier.name}
                          onSelect={() => {
                            setSelectedSupplier(supplier.id.toString());
                            setOpenSupplier(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSupplier === supplier.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {supplier.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.supplier && (
              <p className="text-xs text-red-500 mt-1">{errors.supplier}</p>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>MFG Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inflowItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Popover
                      open={openProducts[item.id]}
                      onOpenChange={(open) =>
                        setOpenProducts((prev) => ({
                          ...prev,
                          [item.id]: open,
                        }))
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openProducts[item.id]}
                          className={cn(
                            "w-full justify-between",
                            errors[item.id]?.product && "border-red-500"
                          )}
                        >
                          {item.product
                            ? products.find(
                                (p) => p.id.toString() === item.product
                              )?.name
                            : "Select product..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search product..." />
                          <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={product.name}
                                  onSelect={() => {
                                    setOpenProducts((prev) => ({
                                      ...prev,
                                      [item.id]: false,
                                    }));
                                    updateInflowItem(
                                      item.id,
                                      "product",
                                      product.id.toString()
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item.product === product.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {product.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors[item.id]?.product && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[item.id].product}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity_received}
                      onChange={(e) =>
                        updateInflowItem(
                          item.id,
                          "quantity_received",
                          e.target.value
                        )
                      }
                      className={cn(
                        "w-full",
                        errors[item.id]?.quantity_received && "border-red-500"
                      )}
                    />
                    {errors[item.id]?.quantity_received && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[item.id].quantity_received}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Popover
                      open={openMfgDatePopover[item.id]}
                      onOpenChange={(open) =>
                        setOpenMfgDatePopover((prev) => ({
                          ...prev,
                          [item.id]: open,
                        }))
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          aria-expanded={openMfgDatePopover[item.id]}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !item.manufacturing_date && "text-muted-foreground",
                            errors[item.id]?.manufacturing_date &&
                              "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {item.manufacturing_date ? (
                            format(new Date(item.manufacturing_date), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            item.manufacturing_date
                              ? new Date(item.manufacturing_date)
                              : undefined
                          }
                          onSelect={(date) => {
                            updateInflowItem(
                              item.id,
                              "manufacturing_date",
                              date ? format(date, "yyyy-MM-dd") : ""
                            );
                            setOpenMfgDatePopover((prev) => ({
                              ...prev,
                              [item.id]: false,
                            }));
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors[item.id]?.manufacturing_date && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[item.id].manufacturing_date}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Popover
                      open={openExpiryDatePopover[item.id]}
                      onOpenChange={(open) =>
                        setOpenExpiryDatePopover((prev) => ({
                          ...prev,
                          [item.id]: open,
                        }))
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          aria-expanded={openExpiryDatePopover[item.id]}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !item.expiry_date && "text-muted-foreground",
                            errors[item.id]?.expiry_date && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {item.expiry_date ? (
                            format(new Date(item.expiry_date), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            item.expiry_date
                              ? new Date(item.expiry_date)
                              : undefined
                          }
                          onSelect={(date) => {
                            updateInflowItem(
                              item.id,
                              "expiry_date",
                              date ? format(date, "yyyy-MM-dd") : ""
                            );
                            setOpenExpiryDatePopover((prev) => ({
                              ...prev,
                              [item.id]: false,
                            }));
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors[item.id]?.expiry_date && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[item.id].expiry_date}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInflowItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={addInflowItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <DialogFooter>
              <Button type="submit">Create Inflows</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
