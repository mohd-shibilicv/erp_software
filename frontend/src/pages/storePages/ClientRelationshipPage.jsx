import React, { useState } from "react";
import { Plus, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout/Layout";
import CustomerAccountModal from "@/components/modals/CustomerAccountModal";

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

const clientAccounts = [
  {
    id: 1,
    name: "John Doe",
    mobile_number: "7025223151",
    whatsapp_number: "7025223151",
    email: "john.doe@gmail.com",
  },
  {
    id: 2,
    name: "John Snow",
    mobile_number: "8987786756",
    whatsapp_number: "9728297383",
    email: "john.snow@gmail.com",
  },
  {
    id: 3,
    name: "Jane Smith",
    mobile_number: "9012892343",
    whatsapp_number: "6863874637",
    email: "jane.smith@gmail.com",
  },
];

const ClientRelationshipPage = () => {
  const [clientAccount, setClientAccount] = useState(null);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [reminderDate, setReminderDate] = useState(null);
  const [meetingDate, setMeetingDate] = useState(null);
  const [status, setStatus] = useState("");
  const [careOf, setCareOf] = useState("");
  const [shortNote, setShortNote] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isClientAccountModalOpen, setIsClientAccountModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClientAccount = async (formData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setClientAccount(formData);
    setIsClientAccountModalOpen(false);
    setIsLoading(false);
  };

  const handleProductSelection = (value) => {
    setSelectedProducts((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Reset form or show success message
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card className="w-full mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-bold">Add Client Relationship</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Client Account</Label>
                <div className="flex gap-2 items-center">
                  <Select
                    value={clientAccount?.name || ""}
                    onValueChange={(value) => setClientAccount({ name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>
                    <SelectContent>
                    {clientAccounts.map((clientAccount) => (
                    <SelectItem
                      key={clientAccount.id}
                      value={clientAccount.name}
                    >
                      {clientAccount.name}
                    </SelectItem>
                  ))}
                    </SelectContent>
                  </Select>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setIsClientAccountModalOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add Client Account</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  type="text"
                  defaultValue={clientAccount?.phone_number || ""}
                  placeholder="Mobile Number"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input
                  type="text"
                  defaultValue={clientAccount?.whatsapp_number || ""}
                  placeholder="WhatsApp Number"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  defaultValue={clientAccount?.email || ""}
                  placeholder="Email"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={country} onValueChange={setCountry}>
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
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries
                      .find((c) => c.value === country)
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
                        checked={selectedProducts.includes(product.value)}
                        onChange={() => handleProductSelection(product.value)}
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
                        !reminderDate && "text-muted-foreground"
                      )}
                    >
                      {reminderDate ? (
                        format(reminderDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={reminderDate}
                      onSelect={setReminderDate}
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
                        !meetingDate && "text-muted-foreground"
                      )}
                    >
                      {meetingDate ? (
                        format(meetingDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={meetingDate}
                      onSelect={setMeetingDate}
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
                <Select value={status} onValueChange={setStatus}>
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
                <Select value={careOf} onValueChange={setCareOf}>
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
                  placeholder="Short note"
                  value={shortNote}
                  onChange={(e) => setShortNote(e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-full">
                <Label>Remarks</Label>
                <Textarea
                  placeholder="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
      <CustomerAccountModal
        isOpen={isClientAccountModalOpen}
        onClose={() => setIsClientAccountModalOpen(false)}
        onSave={handleSaveClientAccount}
      />
    </>
  );
};

export default ClientRelationshipPage;
