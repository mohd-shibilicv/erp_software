/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";

const SupplierModal = ({
  isOpen,
  onClose,
  onSave,
  supplier,
  supplierLoading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    contact_person: "",
    phone_number: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData({
        name: "",
        email: "",
        location: "",
        contact_person: "",
        phone_number: "",
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Edit Supplier" : "Add Supplier"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1 text-start">
              <Label htmlFor="name" className="text-start">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3 bg-slate-50 bg-slate-50"
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <Label htmlFor="email" className="text-start">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3 bg-slate-50"
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <Label htmlFor="location" className="text-start">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3 bg-slate-50"
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <Label htmlFor="contact_person" className="text-start">
                Contact Person
              </Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                className="col-span-3 bg-slate-50"
              />
            </div>
            <div className="flex flex-col gap-1 ">
              <Label htmlFor="phone_number" className="text-start">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="col-span-3 bg-slate-50"
              />
            </div>
          </div>
          <DialogFooter>
            {supplierLoading ? (
              <>
                <Button
                  className="bg-purple-700 flex items-center gap-2"
                  type="button"
                >
                  Loading <LoaderCircle className="w-5 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button type="submit">
                  {supplier ? "Update" : "Add"} Supplier
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierModal;
