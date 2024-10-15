import React, { useEffect } from "react";
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
import { clientService } from "@/services/crmServiceApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countries } from "@/lib/countries";
import { useToast } from "@/components/ui/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile_number: z.string().min(1, "Mobile number is required"),
  whatsapp_number: z.string().optional(),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
});

export function ClientDialog({ isOpen, onClose, onClientSaved, initialData }) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      mobile_number: "",
      whatsapp_number: "",
      email: "",
      country: "",
      city: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        Object.keys(initialData).forEach((key) => {
          setValue(key, initialData[key] || "");
        });
      } else {
        reset();
      }
    }
  }, [isOpen, initialData, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      let response;
      if (initialData) {
        response = await clientService.update(initialData.id, data);
      } else {
        response = await clientService.create(data);
      }
      onClientSaved(response.data);
      onClose();
      toast({
        title: "Success",
        description: `Customer ${
          initialData ? "updated" : "created"
        } successfully.`,
      });
    } catch (error) {
      console.error(
        `Error ${initialData ? "updating" : "creating"} client:`,
        error
      );
      toast({
        title: "Error",
        description: `Failed to ${
          initialData ? "update" : "create"
        } customer. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Customer" : "Create New Customer"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the customer details below."
              : "Enter the new customer details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile_number" className="text-right">
                Mobile Number
              </Label>
              <div className="col-span-3">
                <Controller
                  name="mobile_number"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.mobile_number && <p className="text-red-500 text-sm mt-1">{errors.mobile_number.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatsapp_number" className="text-right">
                Whatsapp Number
              </Label>
              <div className="col-span-3">
                <Controller
                  name="whatsapp_number"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.whatsapp_number && <p className="text-red-500 text-sm mt-1">{errors.whatsapp_number.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <div className="col-span-3">
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <div className="col-span-3">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!control._formValues.country}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries
                          .find((c) => c.value === control._formValues.country)
                          ?.cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update" : "Create"} Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
