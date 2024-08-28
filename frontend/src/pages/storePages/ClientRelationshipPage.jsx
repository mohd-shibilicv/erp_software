import React, { useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
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
import Layout from "@/components/layout/Layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CustomerAccountModal from "@/components/modals/CustomerAccountModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

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

const locations = [
  { label: "Qatar", value: "qatar" },
  { label: "Oman", value: "oman" },
  { label: "Saudi Arabia", value: "saudi_arabia" },
  { label: "United Kingdom", value: "uk" },
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
]

const careofs = [
    { label: "Nasscript", value: "nasscript" },
    { label: "Hisaan", value: "hisaan" },
]

const ClientRelationshipPage = () => {
  const [clientAccount, setClientAccount] = useState({});
  const [location, setLocation] = useState(locations[0].value);
  const [product, setProduct] = useState("");
  const [reminderDate, setReminderDate] = useState(null);
  const [meetingDate, setMeetingDate] = useState(null);
  const [status, setStatus] = useState(null);
  const [careOf, setCareOf] = useState(null);
  const [isClientAccountModalOpen, setIsClientAccountModalOpen] =
    useState(false);

  const updateAccount = (id, field, value) => {
    setClientAccount(
      clientAccounts.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleSaveClientAccount = async (formData) => {
    console.log("Client Account Created:", formData);
    setIsClientAccountModalOpen(false);
  };

  return (
    <Layout>
      <Card className="w-full mx-auto">
        <CardHeader className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold">Add Client Relationship</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <Input
                type="date"
                className="w-40"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <Input placeholder="File No." className="w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex gap-2 items-center">
              <Select
                value={clientAccount.name}
                onValueChange={setClientAccount}
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
                    <div
                      className="p-2 border rounded cursor-pointer"
                      onClick={() => setIsClientAccountModalOpen(true)}
                    >
                      <Plus />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Client Account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="text"
              value={clientAccount.mobile_number}
              placeholder="Mobile Number"
              onChange={(e) =>
                updateAccount(
                  clientAccount.id,
                  "mobile_number",
                  parseInt(e.target.value)
                )
              }
              className="w-full"
            />
            <Input
              type="text"
              value={clientAccount.whatsapp_number}
              placeholder="Whatsapp Number"
              onChange={(e) =>
                updateAccount(
                  clientAccount.id,
                  "whatsapp_number",
                  parseInt(e.target.value)
                )
              }
              className="w-full"
            />
            <Input
              type="email"
              value={clientAccount.email}
              placeholder="Email"
              onChange={(e) =>
                updateAccount(
                  clientAccount.id,
                  "email",
                  parseInt(e.target.value)
                )
              }
              className="w-full"
            />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.value} value={product.value}>
                    {product.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !reminderDate && "text-muted-foreground"
                  )}
                >
                  {reminderDate ? (
                    format(reminderDate, "PPP")
                  ) : (
                    <span>Reminder Date</span>
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
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !meetingDate && "text-muted-foreground"
                  )}
                >
                  {meetingDate ? (
                    format(meetingDate, "PPP")
                  ) : (
                    <span>Meeting Date</span>
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
                    date < new Date() || date > new Date("2030-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue value={status} placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setCareOf}>
              <SelectTrigger>
                <SelectValue value={careOf} placeholder="In Care of" />
              </SelectTrigger>
              <SelectContent>
                {careofs.map((careof) => (
                  <SelectItem key={careof.value} value={careof.value}>
                    {careof.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Short note"></Input>
            <Textarea placeholder="Remarks"></Textarea>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
      <CustomerAccountModal
        isOpen={isClientAccountModalOpen}
        onClose={() => setIsClientAccountModalOpen(false)}
        onSave={handleSaveClientAccount}
      />
    </Layout>
  );
};

export default ClientRelationshipPage;
