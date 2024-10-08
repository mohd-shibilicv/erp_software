"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Check,
  ChevronsUpDown,
  CalendarIcon,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OutflowModalForm({
  products,
  branches,
  onSubmit,
  onCancel,
  initialData = [],
}) {
  const [outflowItems, setOutflowItems] = useState(
    initialData.length > 0
      ? initialData
      : [
          {
            id: 1,
            product: "",
            branch: "",
            quantity_sent: "",
            expiry_date: null,
          },
        ]
  );

  const [errors, setErrors] = useState({});
  const [openProductsPopover, setOpenProductsPopover] = useState({});
  const [openBranchPopover, setOpenBranchPopover] = useState({});
  const [openExpiryPopover, setOpenExpiryPopover] = useState({});

  useEffect(() => {
    if (initialData.length > 0) {
      setOutflowItems(initialData);
    }
  }, [initialData]);

  const addOutflowItem = () => {
    setOutflowItems([
      ...outflowItems,
      {
        id: outflowItems.length + 1,
        product: "",
        branch: "",
        quantity_sent: "",
        expiry_date: null,
      },
    ]);
  };

  const removeOutflowItem = (id) => {
    setOutflowItems(outflowItems.filter((item) => item.id !== id));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[id];
      return newErrors;
    });
  };

  const updateOutflowItem = (id, field, value) => {
    setOutflowItems(
      outflowItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

    validateField(id, field, value);
  };

  const validateField = (id, field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "product":
        if (!value) {
          newErrors[id] = { ...newErrors[id], product: "Product is required" };
        } else {
          delete newErrors[id]?.product;
        }
        break;
      case "branch":
        if (!value) {
          newErrors[id] = { ...newErrors[id], branch: "Branch is required" };
        } else {
          delete newErrors[id]?.branch;
        }
        break;
      case "quantity_sent":
        const product = products.find(
          (p) =>
            p.id.toString() ===
            outflowItems.find((item) => item.id === id)?.product
        );
        if (!value) {
          newErrors[id] = {
            ...newErrors[id],
            quantity_sent: "Quantity is required",
          };
        } else if (isNaN(parseInt(value)) || parseInt(value) <= 0) {
          newErrors[id] = {
            ...newErrors[id],
            quantity_sent: "Quantity must be a positive number",
          };
        } else if (product && parseInt(value) > product.quantity) {
          newErrors[id] = {
            ...newErrors[id],
            quantity_sent: `Quantity exceeds available stock (${product.quantity})`,
          };
        } else {
          delete newErrors[id]?.quantity_sent;
        }
        break;
      case "expiry_date":
        if (value && new Date(value) < new Date()) {
          newErrors[id] = {
            ...newErrors[id],
            expiry_date: "Expiry date cannot be in the past",
          };
        } else {
          delete newErrors[id]?.expiry_date;
        }
        break;
    }

    if (Object.keys(newErrors[id] || {}).length === 0) {
      delete newErrors[id];
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    outflowItems.forEach((item) => {
      if (!item.product) {
        newErrors[item.id] = {
          ...newErrors[item.id],
          product: "Product is required",
        };
      }
      if (!item.branch) {
        newErrors[item.id] = {
          ...newErrors[item.id],
          branch: "Branch is required",
        };
      }
      if (!item.quantity_sent) {
        newErrors[item.id] = {
          ...newErrors[item.id],
          quantity_sent: "Quantity is required",
        };
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(outflowItems);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Quantity Sent</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outflowItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Popover
                  open={openProductsPopover[item.id]}
                  onOpenChange={(open) =>
                    setOpenProductsPopover((prev) => ({
                      ...prev,
                      [item.id]: open,
                    }))
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProductsPopover[item.id]}
                      className={cn(
                        "w-full justify-between",
                        errors[item.id]?.product && "border-red-500"
                      )}
                    >
                      {item.product
                        ? products.find((p) => p.id.toString() === item.product)
                            ?.name
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
                                setOpenProductsPopover((prev) => ({
                                  ...prev,
                                  [item.id]: false,
                                }));
                                updateOutflowItem(
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
                <Popover
                  open={openBranchPopover[item.id]}
                  onOpenChange={(open) =>
                    setOpenBranchPopover((prev) => ({
                      ...prev,
                      [item.id]: open,
                    }))
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        errors[item.id]?.branch && "border-red-500"
                      )}
                    >
                      {item.branch
                        ? branches.find((b) => b.id.toString() === item.branch)
                            ?.name
                        : "Select branch..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search branch..." />
                      <CommandList>
                        <CommandEmpty>No branch found.</CommandEmpty>
                        <CommandGroup>
                          {branches.map((branch) => (
                            <CommandItem
                              key={branch.id}
                              value={branch.name}
                              onSelect={() => {
                                setOpenBranchPopover((prev) => ({
                                  ...prev,
                                  [item.id]: false,
                                }));
                                updateOutflowItem(
                                  item.id,
                                  "branch",
                                  branch.id.toString()
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.branch === branch.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {branch.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors[item.id]?.branch && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[item.id].branch}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity_sent}
                  onChange={(e) =>
                    updateOutflowItem(item.id, "quantity_sent", e.target.value)
                  }
                  className={cn(
                    "w-full",
                    errors[item.id]?.quantity_sent && "border-red-500"
                  )}
                />
                {errors[item.id]?.quantity_sent && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[item.id].quantity_sent}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Popover
                  open={openExpiryPopover[item.id]}
                  onOpenChange={(open) =>
                    setOpenExpiryPopover((prev) => ({
                      ...prev,
                      [item.id]: open,
                    }))
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
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
                        <span>Not Available</span>
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
                        updateOutflowItem(
                          item.id,
                          "expiry_date",
                          date ? format(date, "yyyy-MM-dd") : null
                        );
                        setOpenExpiryPopover((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }));
                      }}
                      initialFocus
                    />
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        updateOutflowItem(item.id, "expiry_date", null);
                        setOpenExpiryPopover((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }));
                      }}
                    >
                      Clear Date
                    </Button>
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
                  onClick={() => removeOutflowItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Please correct the errors before submitting.
          </AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-4 w-full flex justify-between">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex w-full gap-2 justify-end">
          <Button type="button" variant="outline" onClick={addOutflowItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
          <Button type="submit" disabled={Object.keys(errors).length > 0}>
            Create Outflows
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
