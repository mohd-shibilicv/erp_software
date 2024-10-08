"use client";

import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

export default function AssetCreationForm() {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    supplier: {
      name: "",
      invoiceNumber: "",
    },
    qty: 0,
    itemName: "",
    itemCode: "",
    category: "",
    specification: "",
    depreciationPercentage: "",
    assetValue: "",
    image: null,
    userId: user._id,
    warentyStart: null,
    warentyEnd: null,
    invoiceImage: null,
  });

  const [imageError, setImageError] = useState(false);
  const [imageProgress, setImageProgress] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("supplier.")) {
      const field = name.split(".")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        supplier: { ...prevFormData.supplier, [field]: value },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (event) => {
    const { name } = event.target;
    const image = event.target.files[0];
    if (!image) {
      setImageError(true);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: image }));
    setImageError(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.supplier.name)
      errors.supplierName = "Supplier name is required";
    if (!formData.supplier.invoiceNumber)
      errors.supplierInvoiceNumber = "Invoice number is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Asset added successfully.");
      setFormData({
        ...formData,
        date: new Date().toISOString().split("T")[0],
        supplier: { name: "", invoiceNumber: "" },
        qty: 0,
        itemName: "",
        itemCode: "",
        category: "",
        specification: "",
        depreciationPercentage: "",
        assetValue: "",
        image: null,
        warentyStart: null,
        warentyEnd: null,
        invoiceImage: null,
      });
      formRef?.current?.reset();
      toast({
        title: "Success",
        description: "Asset added successfully",
      });
    } catch (error) {
      console.error("Error adding asset:", error);
      toast({
        title: "Error",
        description: "Failed to add asset",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Create New Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier.name">Supplier Name</Label>
                <Input
                  type="text"
                  id="supplier.name"
                  name="supplier.name"
                  value={formData.supplier.name}
                  onChange={handleChange}
                  required
                />
                {validationErrors.supplierName && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.supplierName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier.invoiceNumber">
                  Supplier Invoice No
                </Label>
                <Input
                  type="text"
                  id="supplier.invoiceNumber"
                  name="supplier.invoiceNumber"
                  value={formData.supplier.invoiceNumber}
                  onChange={handleChange}
                  required
                />
                {validationErrors.supplierInvoiceNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.supplierInvoiceNumber}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemCode">Item Code</Label>
                <Input
                  type="text"
                  id="itemCode"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specification">Specification</Label>
                <Input
                  type="text"
                  id="specification"
                  name="specification"
                  value={formData.specification}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depreciationPercentage">
                  Depreciation Percentage
                </Label>
                <Input
                  type="number"
                  id="depreciationPercentage"
                  name="depreciationPercentage"
                  value={formData.depreciationPercentage}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetValue">Asset Value</Label>
                <Input
                  type="number"
                  id="assetValue"
                  name="assetValue"
                  value={formData.assetValue}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imageProgress !== null && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${Math.round(imageProgress)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload Progress: {Math.round(imageProgress)}%
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="warentyStart">Warranty Start Date</Label>
                <Input
                  type="date"
                  id="warentyStart"
                  name="warentyStart"
                  value={formData.warentyStart}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warentyEnd">Warranty End Date</Label>
                <Input
                  type="date"
                  id="warentyEnd"
                  name="warentyEnd"
                  value={formData.warentyEnd}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceImage">Invoice Image</Label>
                <Input
                  type="file"
                  id="invoiceImage"
                  name="invoiceImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qty">Asset Quantity</Label>
                <Input
                  type="number"
                  id="qty"
                  name="qty"
                  min={0}
                  value={formData.qty}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Alert>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating Asset..." : "Create Asset"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
