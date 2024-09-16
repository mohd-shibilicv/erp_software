"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Plus, CalendarIcon, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const countries = [
  { label: "Qatar", value: "qatar", cities: ["Doha", "Al Wakrah", "Al Khor"] },
  { label: "Oman", value: "oman", cities: ["Muscat", "Salalah", "Sohar"] },
  {
    label: "Saudi Arabia",
    value: "saudi_arabia",
    cities: ["Riyadh", "Jeddah", "Mecca"],
  },
  {
    label: "United Kingdom",
    value: "uk",
    cities: ["London", "Manchester", "Birmingham"],
  },
];

const products = [
  { label: "Restaurant Management", value: "restaurant_system" },
  { label: "Stock Management", value: "stock_management" },
  { label: "Laundry Management", value: "laundry_management" },
];

const statuses = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Cancelled", value: "cancelled" },
];

const careofs = [
  { label: "Nasscript", value: "nasscript" },
  { label: "Hisaan", value: "hisaan" },
];

// Mock function to fetch relationship data
const fetchRelationshipData = async (id) => {
  // In a real application, this would be an API call
  return {
    id: parseInt(id),
    clientName: "John Doe",
    mobileNumber: "1234567890",
    whatsappNumber: "0987654321",
    email: "john.doe@example.com",
    country: "qatar",
    city: "Doha",
    products: ["restaurant_system"],
    reminderDate: new Date("2023-06-10"),
    meetingDate: new Date("2023-06-15"),
    status: "pending",
    careOf: "nasscript",
    shortNote: "Initial meeting scheduled",
    remarks: "Client interested in additional features",
  };
};

export default function ClientRelationshipForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [relationship, setRelationship] = useState({
    clientName: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    country: "",
    city: "",
    products: [],
    reminderDate: null,
    meetingDate: null,
    status: "",
    careOf: "",
    shortNote: "",
    remarks: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRelationshipData(id).then(setRelationship);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(
      id ? "Updating relationship:" : "Creating relationship:",
      relationship
    );
    setIsLoading(false);
    navigate("/admin/client-relationship");
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Deleting relationship:", relationship);
    setIsLoading(false);
    navigate("/admin/client-relationship");
  };

  const handleBack = () => {
    navigate("/admin/client-relationship");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {id ? "Edit Client Relationship" : "Create New Client Relationship"}
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input
                value={relationship.clientName}
                onChange={(e) =>
                  setRelationship({
                    ...relationship,
                    clientName: e.target.value,
                  })
                }
                placeholder="Client Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input
                value={relationship.mobileNumber}
                onChange={(e) =>
                  setRelationship({
                    ...relationship,
                    mobileNumber: e.target.value,
                  })
                }
                placeholder="Mobile Number"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input
                value={relationship.whatsappNumber}
                onChange={(e) =>
                  setRelationship({
                    ...relationship,
                    whatsappNumber: e.target.value,
                  })
                }
                placeholder="WhatsApp Number"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={relationship.email}
                onChange={(e) =>
                  setRelationship({ ...relationship, email: e.target.value })
                }
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select
                value={relationship.country}
                onValueChange={(value) =>
                  setRelationship({ ...relationship, country: value })
                }
              >
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
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Select
                value={relationship.city}
                onValueChange={(value) =>
                  setRelationship({ ...relationship, city: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {countries
                    .find((c) => c.value === relationship.country)
                    ?.cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Products</Label>
              <ScrollArea className="h-[150px] w-full border rounded-md p-2">
                {products.map((product) => (
                  <div
                    key={product.value}
                    className="flex items-center space-x-2 py-1"
                  >
                    <input
                      type="checkbox"
                      id={product.value}
                      checked={relationship.products.includes(product.value)}
                      onChange={() => {
                        const updatedProducts = relationship.products.includes(
                          product.value
                        )
                          ? relationship.products.filter(
                              (p) => p !== product.value
                            )
                          : [...relationship.products, product.value];
                        setRelationship({
                          ...relationship,
                          products: updatedProducts,
                        });
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={product.value}>{product.label}</label>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <Label>Reminder Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !relationship.reminderDate && "text-muted-foreground"
                    )}
                  >
                    {relationship.reminderDate ? (
                      format(relationship.reminderDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={relationship.reminderDate}
                    onSelect={(date) =>
                      setRelationship({ ...relationship, reminderDate: date })
                    }
                    disabled={(date) =>
                      date < new Date() || date > new Date("2030-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Meeting Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !relationship.meetingDate && "text-muted-foreground"
                    )}
                  >
                    {relationship.meetingDate ? (
                      format(relationship.meetingDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={relationship.meetingDate}
                    onSelect={(date) =>
                      setRelationship({ ...relationship, meetingDate: date })
                    }
                    disabled={(date) =>
                      date < new Date() - 1 || date > new Date("2030-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={relationship.status}
                onValueChange={(value) =>
                  setRelationship({ ...relationship, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>In Care of</Label>
              <Select
                value={relationship.careOf}
                onValueChange={(value) =>
                  setRelationship({ ...relationship, careOf: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Care of" />
                </SelectTrigger>
                <SelectContent>
                  {careofs.map((careof) => (
                    <SelectItem key={careof.value} value={careof.value}>
                      {careof.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Short Note</Label>
              <Input
                value={relationship.shortNote}
                onChange={(e) =>
                  setRelationship({
                    ...relationship,
                    shortNote: e.target.value,
                  })
                }
                placeholder="Short note"
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label>Remarks</Label>
              <Textarea
                value={relationship.remarks}
                onChange={(e) =>
                  setRelationship({ ...relationship, remarks: e.target.value })
                }
                placeholder="Remarks"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isLoading}
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="default" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : id ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
            {id && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
