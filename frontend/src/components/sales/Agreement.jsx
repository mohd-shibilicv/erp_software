import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Printer,
  Save,
  ChevronsUpDown,
  Check,
  PlusCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  FullDialog,
  FullDialogContent,
  FullDialogDescription,
  FullDialogFooter,
  FullDialogHeader,
  FullDialogTitle,
} from "../ui/full-dialog";
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { clientService } from "@/services/crmServiceApi";

const Agreement = () => {
  const { toast } = useToast();
  const [tcFile, setTcFile] = useState(null);
  const [signedAgreement, setSignedAgreement] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    quotation_id: "",
    clientName: "",
    company_name: "",
    cr_number: "",
    baladiya: "",
    project_name: "",
    total_amount: 0,
    payment_date: null,
    project_start_date: null,
    project_end_date: null,
    payment_terms: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await api.get("/quotations/");
        setQuotations(response.data.results);
      } catch (error) {
        console.error("Error fetching quotations:", error);
        toast({
          title: "Error",
          description: "Failed to fetch quotations",
          variant: "destructive",
        });
      }
    };
    fetchClients();
    fetchQuotations();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handlePaymentTermChange = (index, field, value) => {
    const updatedTerms = [...formData.payment_terms];
    updatedTerms[index] = { ...updatedTerms[index], [field]: value };
    setFormData((prevData) => ({
      ...prevData,
      payment_terms: updatedTerms,
    }));
  };

  const addPaymentTerm = () => {
    setFormData((prevData) => ({
      ...prevData,
      payment_terms: [...prevData.payment_terms, { date: null, amount: 0 }],
    }));
  };

  const removePaymentTerm = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      payment_terms: prevData.payment_terms.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.quotation_id)
      newErrors.quotation_id = "Quotation is required";
    if (!formData.clientName) newErrors.clientName = "Client name is required";
    if (!formData.company_name)
      newErrors.company_name = "Company name is required";
    if (!formData.cr_number) newErrors.cr_number = "CR number is required";
    if (!formData.project_name)
      newErrors.project_name = "Project name is required";
    if (!formData.total_amount)
      newErrors.total_amount = "Total amount is required";
    if (!formData.payment_date)
      newErrors.payment_date = "Payment date is required";
    if (!formData.project_start_date)
      newErrors.project_start_date = "Project start date is required";
    if (!formData.project_end_date)
      newErrors.project_end_date = "Project end date is required";
    if (formData.payment_terms.length === 0)
      newErrors.payment_terms = "At least one payment term is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    validateForm();
    e.preventDefault();
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === "tc_file") {
      setTcFile(file);
    } else if (fileType === "signed_agreement") {
      setSignedAgreement(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openDialog = (file) => {
    setViewingFile(file);
    setDialogOpen(true);
  };

  const totalPaidAmount = formData.payment_terms.reduce(
    (sum, term) => sum + parseFloat(term.amount || 0),
    0
  );
  const remainingAmount = formData.total_amount - totalPaidAmount;

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Agreement Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotation">Select Quotation</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded="false"
                    className={cn(
                      "w-full justify-between",
                      errors.quotation_id && "border-red-500"
                    )}
                  >
                    {quotations.find(
                      (q) => q.id.toString() === formData.quotation_id
                    )?.quotation_number || "Select a quotation"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search quotation..." />
                    <CommandList>
                      <CommandEmpty>No quotations found.</CommandEmpty>
                      <CommandGroup>
                        {quotations.map((q) => (
                          <CommandItem
                            key={q.id}
                            onSelect={() =>
                              handleInputChange({
                                target: {
                                  name: "quotation_id",
                                  value: q.id.toString(),
                                },
                              })
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.quotation_id === q.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            Quotation {q.quotation_number}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.quotation_id && (
                <p className="text-sm text-red-500">{errors.quotation_id}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tc-upload">Upload Terms & Conditions</Label>
              <Input
                id="tc-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, "tc_file")}
              />
              {tcFile && (
                <p
                  className="text-sm text-blue-500 cursor-pointer"
                  onClick={() => openDialog(tcFile)}
                >
                  {tcFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signed-agreement">Upload Signed Agreement</Label>
            <Input
              id="signed-agreement"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "signed_agreement")}
            />
            {signedAgreement && (
              <p
                className="text-sm text-blue-500 cursor-pointer"
                onClick={() => openDialog(signedAgreement)}
              >
                {signedAgreement.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded="false"
                    className={cn(
                      "w-full justify-between",
                      errors.clientName && "border-red-500"
                    )}
                  >
                    {clients.find(
                      (client) => client.id.toString() === formData.clientName
                    )?.name || "Select a client"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search client..." />
                    <CommandList>
                      <CommandEmpty>No clients found.</CommandEmpty>
                      <CommandGroup>
                        {clients.map((client) => (
                          <CommandItem
                            key={client.id}
                            onSelect={() =>
                              handleInputChange({
                                target: {
                                  name: "clientName",
                                  value: client.id.toString(),
                                },
                              })
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.clientName === client.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {client.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.clientName && (
                <p className="text-sm text-red-500">{errors.clientName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className={cn(errors.company_name && "border-red-500")}
              />
              {errors.company_name && (
                <p className="text-sm text-red-500">{errors.company_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cr_number">CR Number</Label>
              <Input
                id="cr_number"
                name="cr_number"
                value={formData.cr_number}
                onChange={handleInputChange}
                className={cn(errors.cr_number && "border-red-500")}
              />
              {errors.cr_number && (
                <p className="text-sm text-red-500">{errors.cr_number}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="baladiya">Baladiya</Label>
              <Input
                id="baladiya"
                name="baladiya"
                value={formData.baladiya}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_name">Project Name</Label>
              <Input
                id="project_name"
                name="project_name"
                value={formData.project_name}
                onChange={handleInputChange}
                className={cn(errors.project_name && "border-red-500")}
              />
              {errors.project_name && (
                <p className="text-sm text-red-500">{errors.project_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_amount">Total Estimated Amount</Label>
              <Input
                id="total_amount"
                name="total_amount"
                type="number"
                value={formData.total_amount}
                onChange={handleInputChange}
                className={cn(errors.total_amount && "border-red-500")}
              />
              {errors.total_amount && (
                <p className="text-sm text-red-500">{errors.total_amount}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Final Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.payment_date && "text-muted-foreground",
                      errors.payment_date && "border-red-500"
                    )}
                  >
                    {formData.payment_date ? (
                      format(formData.payment_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.payment_date}
                    onSelect={(date) => handleDateChange(date, "payment_date")}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.payment_date && (
                <p className="text-sm text-red-500">{errors.payment_date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_start_date">Project Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.project_start_date && "text-muted-foreground",
                      errors.project_start_date && "border-red-500"
                    )}
                  >
                    {formData.project_start_date ? (
                      format(formData.project_start_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.project_start_date}
                    onSelect={(date) =>
                      handleDateChange(date, "project_start_date")
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.project_start_date && (
                <p className="text-sm text-red-500">
                  {errors.project_start_date}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_end_date">Project End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.project_end_date && "text-muted-foreground",
                      errors.project_end_date && "border-red-500"
                    )}
                  >
                    {formData.project_end_date ? (
                      format(formData.project_end_date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.project_end_date}
                    onSelect={(date) =>
                      handleDateChange(date, "project_end_date")
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.project_end_date && (
                <p className="text-sm text-red-500">
                  {errors.project_end_date}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Payment Terms</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.payment_terms.map((term, index) => (
                  <TableRow key={index}>
                    <TableCell>{`Term ${index + 1}`}</TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !term.date && "text-muted-foreground"
                            )}
                          >
                            {term.date ? (
                              format(new Date(term.date), "PPP")
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
                              term.date ? new Date(term.date) : undefined
                            }
                            onSelect={(date) =>
                              handlePaymentTermChange(index, "date", date)
                            }
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={term.amount}
                        onChange={(e) =>
                          handlePaymentTermChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                        placeholder="Amount"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        onClick={() => removePaymentTerm(index)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="w-full flex justify-center">
              <Button type="button" variant="outline" onClick={addPaymentTerm}>
                <PlusCircle />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Label>Current Amount</Label>
            <Input
              className="w-[200px]"
              type="number"
              value={totalPaidAmount}
              readOnly
            />
          </div>

          <div className="flex justify-between items-center">
            <Label>Remaining Amount</Label>
            <Input
              className="w-[200px]"
              type="number"
              value={isNaN(remainingAmount) ? 0 : remainingAmount}
              readOnly
            />
          </div>

          {formData.total_amount > 0 && (
            <div
              className={cn(
                "p-4 rounded-md",
                remainingAmount === 0
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              )}
            >
              {remainingAmount === 0
                ? "Total paid amount matches the estimated amount."
                : `Warning: There is still ${
                    isNaN(remainingAmount) ? 0 : remainingAmount
                  } remaining to be allocated.`}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="submit" onClick={handleSubmit}>
          Save Agreement
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print Agreement
        </Button>
      </CardFooter>

      {/* Dialog for viewing PDF */}
      {viewingFile && (
        <FullDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <FullDialogContent className="max-w-5xl max-h-[90vh]">
            <FullDialogHeader>
              <FullDialogTitle>{viewingFile.name}</FullDialogTitle>
              <FullDialogDescription></FullDialogDescription>
            </FullDialogHeader>
            <embed
              src={URL.createObjectURL(viewingFile)}
              type="application/pdf"
              className="w-full h-[80vh]"
            />
            <FullDialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </FullDialogFooter>
          </FullDialogContent>
        </FullDialog>
      )}
    </Card>
  );
};

export default Agreement;
