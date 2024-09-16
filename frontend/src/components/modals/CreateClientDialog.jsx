import React, { useState } from "react";
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

export function CreateClientDialog({ isOpen, onClose, onClientCreated }) {
  const [newClient, setNewClient] = useState({
    name: "",
    mobile_number: "",
    whatsapp_number: "",
    email: "",
    country: "",
    city: "",
  });

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await clientService.create(newClient);
      onClientCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                placeholder="Client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                Mobile Number
              </Label>
              <Input
                id="mobile_number"
                name="mobile_number"
                value={newClient.mobile_number}
                onChange={handleInputChange}
                placeholder="Client mobile number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                Whatsapp Number
              </Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                value={newClient.whatsapp_number}
                onChange={handleInputChange}
                placeholder="Client whatsapp number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={newClient.email}
                onChange={handleInputChange}
                placeholder="Client email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={newClient.country}
                onValueChange={(value) =>
                  setNewClient({ ...newClient, country: value })
                }
              >
                <SelectTrigger id="country">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select
                value={newClient.city}
                onValueChange={(value) =>
                  setNewClient({ ...newClient, city: value })
                }
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {countries
                    .find((c) => c.value === newClient.country)
                    ?.cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
