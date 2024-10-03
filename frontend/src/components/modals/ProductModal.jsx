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

export function ProductModal({ isOpen, onClose, productId, onProductChange }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    opening_stock: "",
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        opening_stock: "",
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
            <div className="flex flex-col gap-1">
              <Label htmlFor="opening_stock" className="text-start">
                Opening Stock
              </Label>
              <Input
                id="opening_stock"
                name="opening_stock"
                 placeholder="Enter Product Opening Stock"
                type="number"
                value={product.opening_stock}
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
