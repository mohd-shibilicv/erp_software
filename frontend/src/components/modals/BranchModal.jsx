"use client";

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
import { api } from "@/services/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

const BranchModal = ({ isOpen, onClose, onSave, branch }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact_details: "",
    manager: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unassignedManagers, setUnassignedManagers] = useState([]);

  useEffect(() => {
    if (branch) {
      setFormData(branch);
    } else {
      setFormData({
        name: "",
        location: "",
        contact_details: "",
        manager: "",
      });
    }
    setErrors({});
  }, [branch]);

  useEffect(() => {
    const fetchUnassignedManagers = async () => {
      try {
        const response = await api.get("/users/unassigned_managers/");
        setUnassignedManagers(response.data);
      } catch (error) {
        console.error("Error fetching unassigned managers:", error);
      }
    };

    fetchUnassignedManagers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleManagerChange = (value) => {
    setFormData((prev) => ({ ...prev, manager: value }));
    setErrors((prev) => ({ ...prev, manager: "" }));
  };

  const validateForm = async () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Branch name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.contact_details.trim())
      newErrors.contact_details = "Contact details are required";
    if (!formData.manager) newErrors.manager = "Manager is required";

    // Check for unique branch name
    if (!newErrors.name) {
      try {
        const response = await api.post("/branches/check_unique/", {
          name: formData.name,
          id: branch?.id, // Include current branch id for edit case
        });
        const { nameExists } = response.data;
        if (nameExists)
          newErrors.name = "A branch with this name already exists";
      } catch (error) {
        console.error("Error checking unique branch name:", error);
        newErrors.general = "An error occurred. Please try again.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const isValid = await validateForm();
    if (isValid) {
      onSave(formData);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{branch ? "Edit Branch" : "Add Branch"}</DialogTitle>
          <DialogDescription>
            {branch
              ? "Edit the details of this branch."
              : "Add a new branch to your organization."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`col-span-3 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm col-start-2 col-span-3">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`col-span-3 ${
                  errors.location ? "border-red-500" : ""
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm col-start-2 col-span-3">
                  {errors.location}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_details" className="text-right">
                Contact Details
              </Label>
              <Input
                id="contact_details"
                name="contact_details"
                value={formData.contact_details}
                onChange={handleChange}
                className={`col-span-3 ${
                  errors.contact_details ? "border-red-500" : ""
                }`}
              />
              {errors.contact_details && (
                <p className="text-red-500 text-sm col-start-2 col-span-3">
                  {errors.contact_details}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager" className="text-right">
                Manager
              </Label>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPopoverOpen}
                    className={`col-span-3 w-full justify-between ${
                      errors.manager ? "border-red-500" : ""
                    }`}
                  >
                    {formData.manager
                      ? unassignedManagers.find(
                          (m) => m.id === formData.manager
                        )?.username
                      : "Select a manager"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search manager..." />
                    <CommandList>
                      <CommandEmpty>No managers found.</CommandEmpty>
                      <CommandGroup>
                        {unassignedManagers.map((manager) => (
                          <CommandItem
                            key={manager.id}
                            value={manager.username}
                            onSelect={() => {
                              handleManagerChange(manager.id);
                              setIsPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.manager === manager.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {manager.username}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.manager && (
                <p className="text-red-500 text-sm col-start-2 col-span-3">
                  {errors.manager}
                </p>
              )}
            </div>
          </div>
          {errors.general && (
            <p className="text-red-500 text-sm mb-4">{errors.general}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : (branch ? "Update" : "Add") + " Branch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BranchModal;
