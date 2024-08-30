import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { CalendarIcon, Upload, Printer } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  FullDialog,
  FullDialogContent,
  FullDialogDescription,
  FullDialogFooter,
  FullDialogHeader,
  FullDialogTitle,
} from "../ui/full-dialog";

const Agreement = () => {
  const { register, handleSubmit, control, watch } = useForm();
  const [tcFile, setTcFile] = useState(null);
  const [signedAgreement, setSignedAgreement] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);

  const onSubmit = (data) => {
    console.log(data);
  };

  const handlePrint = () => {
    window.print();
  };

  const openDialog = (file) => {
    setViewingFile(file);
    setDialogOpen(true);
  };

  const quotations = [
    { id: 1, name: "Quotation 1" },
    { id: 2, name: "Quotation 2" },
    { id: 3, name: "Quotation 3" },
  ];

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Agreement Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotation">Select Quotation</Label>
              <Select onValueChange={(value) => console.log(value)}>
                <SelectTrigger id="quotation">
                  <SelectValue placeholder="Select a quotation" />
                </SelectTrigger>
                <SelectContent>
                  {quotations.map((q) => (
                    <SelectItem key={q.id} value={q.id.toString()}>
                      {q.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tc-upload">Upload Terms & Conditions</Label>
              <Input
                id="tc-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setTcFile(e.target.files[0])}
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
              onChange={(e) => setSignedAgreement(e.target.files[0])}
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
              <Input
                id="client-name"
                {...register("clientName", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                {...register("companyName", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cr-number">CR Number</Label>
              <Input
                id="cr-number"
                {...register("crNumber", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baladiya">Baladiya</Label>
              <Input
                id="baladiya"
                {...register("baladiya", { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="our-company">Our Company</Label>
              <Input
                id="our-company"
                value="Nasscript Software Innovations"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="our-cr">Our CR Number</Label>
              <Input id="our-cr" value="8818818" readOnly />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                {...register("projectName", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Estimated Amount</Label>
              <Input
                id="total-amount"
                type="number"
                {...register("totalAmount", { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="paymentDate"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="payment-date">Payment Final Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
            <Controller
              name="projectStartDate"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="start-date">Project Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
            <Controller
              name="projectEndDate"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="end-date">Project End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
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
