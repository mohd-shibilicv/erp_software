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

export default function BranchCreationForm() {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    branchName: "",
    branchCode: "",
    branchLocation: "",
    branchManager: "",
    userId: user._id,
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const formRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    const trimmedData = {
      branchName: formData.branchName.trim(),
      branchCode: formData.branchCode.trim(),
      branchLocation: formData.branchLocation.trim(),
      branchManager: formData.branchManager.trim(),
    };

    if (!trimmedData.branchName) errors.branchName = "Branch Name is required.";
    if (!trimmedData.branchCode) errors.branchCode = "Branch Code is required.";
    if (!trimmedData.branchLocation)
      errors.branchLocation = "Branch Location is required.";
    if (!trimmedData.branchManager)
      errors.branchManager = "Branch Manager is required.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Branch added successfully.",
      });
      formRef?.current?.reset();
      setSuccessMessage("Branch added successfully.");
      setValidationErrors({});
      setFormData({
        branchName: "",
        branchCode: "",
        branchLocation: "",
        branchManager: "",
        userId: user._id,
      });
    } catch (error) {
      console.error("Error adding branch:", error);
      toast({
        title: "Error",
        description: "Failed to add branch.",
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
          <CardTitle>Create New Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Input
                  type="text"
                  id="branchName"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                />
                {validationErrors.branchName && (
                  <p className="text-red-500 text-xs  mt-1">
                    {validationErrors.branchName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchCode">Branch Code</Label>
                <Input
                  type="text"
                  id="branchCode"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                  placeholder="Enter branch code"
                />
                {validationErrors.branchCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.branchCode}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchLocation">Branch Location</Label>
                <Input
                  type="text"
                  id="branchLocation"
                  name="branchLocation"
                  value={formData.branchLocation}
                  onChange={handleChange}
                  placeholder="Enter branch location"
                />
                {validationErrors.branchLocation && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.branchLocation}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchManager">Branch Manager</Label>
                <Input
                  type="text"
                  id="branchManager"
                  name="branchManager"
                  value={formData.branchManager}
                  onChange={handleChange}
                  placeholder="Enter branch manager's name"
                />
                {validationErrors.branchManager && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.branchManager}
                  </p>
                )}
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
              {loading ? "Adding..." : "Add Branch"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
