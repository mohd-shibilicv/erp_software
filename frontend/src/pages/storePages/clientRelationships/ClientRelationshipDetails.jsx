import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Plus, CalendarIcon, Loader2, Save, Trash2 } from "lucide-react";
import {
  clientService,
  clientRelationshipService,
} from "@/services/crmServiceApi";
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
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDateForBackend } from "@/lib/formatDate";
import { CreateClientDialog } from "@/components/modals/CreateClientDialog";
import ClientComboBox from "@/components/client/ClientComboBox";

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

export default function ClientRelationshipForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [relationship, setRelationship] = useState({
    client_id: "",
    _products: [],
    reminder_date: null,
    meeting_date: null,
    status: "",
    care_of: "",
    short_note: "",
    remarks: "",
  });

  const [clientDetails, setClientDetails] = useState({
    id: "",
    name: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    country: "",
    city: "",
  });

  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isCreateClientDialogOpen, setIsCreateClientDialogOpen] =
    useState(false);

  useEffect(() => {
    fetchClients();
    if (id) {
      fetchRelationship(id);
    }
  }, [id]);

  const fetchClients = async () => {
    try {
      const response = await clientService.getAll();
      setClients(response.data.results);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch clients. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateClient = (newClient) => {
    setClients([...clients, newClient]);
    handleClientChange(newClient.id.toString());
  };

  const fetchRelationship = async (relationshipId) => {
    try {
      const response = await clientRelationshipService.get(relationshipId);
      const relationshipData = response.data;
      console.log(relationshipData);

      setRelationship({
        client_id: relationshipData.client.id,
        _products: relationshipData.products || [],
        reminder_date: relationshipData.reminder_date,
        meeting_date: relationshipData.meeting_date,
        status: relationshipData.status,
        care_of: relationshipData.care_of,
        short_note: relationshipData.short_note,
        remarks: relationshipData.remarks,
      });

      setClientDetails({
        name: relationshipData.client.name,
        mobileNumber: relationshipData.client.mobile_number,
        whatsappNumber: relationshipData.client.whatsapp_number,
        email: relationshipData.client.email,
        country: relationshipData.client.country,
        city: relationshipData.client.city,
      });
    } catch (error) {
      console.error("Error fetching relationship:", error);
      toast({
        title: "Error",
        description: "Failed to fetch relationship details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClientChange = async (clientId) => {
    if (!clientId) {
      console.error("Invalid client ID");
      return;
    }

    try {
      const clientResponse = await clientService.get(clientId);
      const clientData = clientResponse.data;
      setRelationship((prev) => ({ ...prev, client_id: clientId }));
      setClientDetails({
        name: clientData.name,
        mobileNumber: clientData.mobile_number,
        whatsappNumber: clientData.whatsapp_number,
        email: clientData.email,
        country: clientData.country,
        city: clientData.city,
      });
    } catch (error) {
      console.error("Error fetching client details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch client details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!relationship.client_id) {
      return;
    }

    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...relationship,
        client: clientDetails.id,
        reminder_date: formatDateForBackend(relationship.reminder_date),
        meeting_date: formatDateForBackend(relationship.meeting_date),
      };

      if (id) {
        await clientRelationshipService.update(id, dataToSubmit);
        toast({
          title: "Success",
          description: "Relationship updated successfully.",
        });
      } else {
        await clientRelationshipService.create(dataToSubmit);
        toast({
          title: "Success",
          description: "New relationship created successfully.",
        });
      }
      navigate("/admin/client-relationship");
    } catch (error) {
      console.error("Error saving relationship:", error);
      toast({
        title: "Error",
        description: "Failed to save relationship. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await clientRelationshipService.delete(id);
      toast({
        title: "Success",
        description: "Relationship deleted successfully.",
      });
      navigate("/admin/client-relationship");
    } catch (error) {
      console.error("Error deleting relationship:", error);
      toast({
        title: "Error",
        description: "Failed to delete relationship. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/client-relationship");
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {id ? "Edit Client Relationship" : "Create New Client Relationship"}
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <ClientComboBox
              clients={clients}
              id={id}
              relationship={relationship}
              handleClientChange={handleClientChange}
              setIsCreateClientDialogOpen={setIsCreateClientDialogOpen}
            />
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                value={clientDetails.mobileNumber}
                readOnly
                placeholder="Mobile Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={clientDetails.whatsappNumber}
                readOnly
                placeholder="WhatsApp Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={clientDetails.email}
                readOnly
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={clientDetails.country}
                readOnly
                placeholder="Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={clientDetails.city}
                readOnly
                placeholder="City"
              />
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
                      checked={relationship._products.includes(product.value)}
                      onChange={() => {
                        const updatedProducts = relationship._products.includes(
                          product.value
                        )
                          ? relationship._products.filter(
                              (p) => p !== product.value
                            )
                          : [...relationship._products, product.value];
                        setRelationship({
                          ...relationship,
                          _products: updatedProducts,
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
                      !relationship.reminder_date && "text-muted-foreground"
                    )}
                  >
                    {relationship.reminder_date ? (
                      format(new Date(relationship.reminder_date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      relationship.reminder_date
                        ? new Date(relationship.reminder_date)
                        : null
                    }
                    onSelect={(date) =>
                      setRelationship({ ...relationship, reminder_date: date })
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
                      !relationship.meeting_date && "text-muted-foreground"
                    )}
                  >
                    {relationship.meeting_date ? (
                      format(new Date(relationship.meeting_date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      relationship.meeting_date
                        ? new Date(relationship.meeting_date)
                        : null
                    }
                    onSelect={(date) =>
                      setRelationship({ ...relationship, meeting_date: date })
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={relationship.status}
                onValueChange={(value) =>
                  setRelationship({ ...relationship, status: value })
                }
              >
                <SelectTrigger id="status">
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
              <Label htmlFor="care_of">In Care of</Label>
              <Select
                value={relationship.care_of}
                onValueChange={(value) =>
                  setRelationship({ ...relationship, care_of: value })
                }
              >
                <SelectTrigger id="care_of">
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
              <Label htmlFor="short_note">Short Note</Label>
              <Input
                id="short_note"
                value={relationship.short_note}
                onChange={(e) =>
                  setRelationship({
                    ...relationship,
                    short_note: e.target.value,
                  })
                }
                placeholder="Short note"
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={relationship.remarks}
                onChange={(e) =>
                  setRelationship({ ...relationship, remarks: e.target.value })
                }
                placeholder="Remarks"
                rows={4}
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
            {id && (
              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isLoading}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the client relationship.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="default" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {id ? "Update" : "Create"}
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
      <CreateClientDialog
        isOpen={isCreateClientDialogOpen}
        onClose={() => setIsCreateClientDialogOpen(false)}
        onClientCreated={handleCreateClient}
      />
    </form>
  );
}
