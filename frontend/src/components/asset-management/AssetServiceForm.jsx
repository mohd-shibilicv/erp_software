"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export default function AssetServiceForm() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Simulated API call
        const mockAssets = [
          { _id: "1", itemName: "Laptop" },
          { _id: "2", itemName: "Monitor" },
          { _id: "3", itemName: "Printer" },
        ];
        setAssets(mockAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast({
          title: "Error",
          description: "Failed to fetch assets",
          variant: "destructive",
        });
      }
    };
    fetchAssets();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!data.cost) {
        throw new Error("Please fill the cost field");
      }
      if (isNaN(data.cost) || Number(data.cost) < 1) {
        throw new Error("Cost must be a non-negative number");
      }

      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Asset service added successfully",
      });
      reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
          <CardTitle>Create Asset Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assetId">Select Asset</Label>
                <Select onValueChange={(value) => setValue("assetId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset._id} value={asset._id}>
                        {asset.itemName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  onChange={(e) => setValue("image", e.target.files[0])}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Service Description</Label>
                <Input
                  id="service"
                  placeholder="e.g., Tyre change"
                  {...register("service", {
                    required: "Service description is required",
                  })}
                />
                {errors.service && (
                  <p className="text-sm text-red-500">
                    {errors.service.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Service Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="Enter service cost"
                  {...register("cost", {
                    required: "Cost is required",
                    min: {
                      value: 1,
                      message: "Cost must be a positive number",
                    },
                  })}
                />
                {errors.cost && (
                  <p className="text-sm text-red-500">{errors.cost.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
