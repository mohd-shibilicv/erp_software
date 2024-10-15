import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Combobox } from "../ui/Combobox";

export function ProductModal({ isOpen, onClose, productId, onProductChange }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const PRODUCT_UNIT_CHOICES = ["piece", "kg", "g", "l", "ml", "m", "cm", "box", "pack", "dozen", "pair"];

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
      });
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}/`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productId) {
        await api.put(`/products/${productId}/`, product);
      } else {
        await api.post("/products/", product);
      }
      onProductChange();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {productId ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name" className="text-start">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                placeholder="Enter Product Name"
                onChange={handleInputChange}
                className="col-span-3 shadow-sm bg-gray-100/50 focus-visible:bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="description" className="text-start">
                Description
              </Label>
              <Textarea
                id="description"
                 placeholder="Enter Product Description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                className="col-span-3 shadow-sm bg-gray-100/50 focus-visible:bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="price" className="text-start">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                 placeholder="Enter Product Amount"
                type="number"
                value={product.price}
                onChange={handleInputChange}
                className="col-span-3 shadow-sm bg-gray-100/50 focus-visible:bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="unit" className="text-start">
                Unit
              </Label>
              <Combobox
                options={PRODUCT_UNIT_CHOICES.map(unit => ({ value: unit, label: unit }))}
                value={product.unit}
                onChange={(value) => handleInputChange({ target: { name: 'unit', value } })}
                placeholder="Select Unit"
                emptyMessage="No unit found."
                searchPlaceholder="Search unit..."
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="reorder_level" className="text-start">
                Minimum Stock Level
              </Label>
              <Input
                id="reorder_level"
                name="reorder_level"
                placeholder="Enter Reorder Level"
                type="number"
                value={product.reorder_level}
                defaultValue={0}
                onChange={handleInputChange}
                className="col-span-3 shadow-sm bg-gray-100/50 focus-visible:bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="quantity" className="text-start">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                placeholder="Enter Product Quantity"
                type="number"
                value={product.quantity}
                onChange={handleInputChange}
                className="col-span-3 shadow-sm bg-gray-100/50 focus-visible:bg-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {productId ? "Update" : "Add"} Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
