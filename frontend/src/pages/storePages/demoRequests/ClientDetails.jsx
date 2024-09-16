import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, CheckCircle2, ChevronsUpDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/services/api";
import { Combobox } from "@/components/ui/Combobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ClientDetails({ client, onBack }) {
  const [assignTo, setAssignTo] = useState(client.assigned_staff);
  const [status, setStatus] = useState(client.status || "pending");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await api.get("/staff/");
      setStaffList(response.data.results);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post(`/client-requests/${client.id}/assign_staff/`, {
        staff_id: assignTo,
        status: status,
      });
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving changes:", error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const isChanged =
    assignTo !== client.assigned_staff || status !== client.status;

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mt-4">
          Client Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            {[
              { label: "Name", value: client.client_name },
              { label: "Email", value: client.client_email },
              { label: "Number", value: client.client_number },
              { label: "Company", value: client.company_name },
              { label: "Schedule Date", value: format(client.scheduled_date, "PPPp") },
            ].map((item, index) => (
              <div key={index} className="flex">
                <Label className="w-1/3 font-medium">{item.label}:</Label>
                <span className="w-2/3">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[
              { label: "Company Size", value: client.company_size },
              { label: "Platform", value: client.platform },
              { label: "Type of Service", value: client.service_requested },
            ].map((item, index) => (
              <div key={index} className="flex">
                <Label className="w-1/3 font-medium">{item.label}:</Label>
                <span className="w-2/3">{item.value}</span>
              </div>
            ))}
            <div className="flex items-center">
              <Label className="w-1/3 font-medium">Assign To:</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between")}
                  >
                    {assignTo
                      ? staffList.find((staff) => staff.id === assignTo)
                          ?.username
                      : "Select  staff..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No staff found.</CommandEmpty>
                      <CommandGroup>
                        {staffList.map((staff) => (
                          <CommandItem
                            key={staff.id}
                            value={staff.username}
                            onSelect={(currentValue) => {
                              setAssignTo(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                assignTo === staff.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {staff.username}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center">
              <Label className="w-1/3 font-medium">Status:</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {["pending", "scheduled", "completed", "cancelled"].map(
                    (option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="capitalize"
                      >
                        {option}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="mb-8">
          <h3 className="font-semibold mb-3">More Details About the Project</h3>
          <p className="text-sm leading-relaxed">{client.service_requested}</p>
        </div>
        {saveSuccess !== null && (
          <Alert
            variant={saveSuccess ? "default" : "destructive"}
            className="mb-4"
          >
            {saveSuccess ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{saveSuccess ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {saveSuccess
                ? "Changes have been saved successfully."
                : "There was an error saving the changes. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to list
        </Button>
        <Button onClick={handleSave} disabled={!isChanged || isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
