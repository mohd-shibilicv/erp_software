"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { useParams, useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const leaveFormSchema = z.object({
  employee: z.number(),
  leave_type: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }),
  status: z.string(),
  attachment: z.instanceof(File).optional(),
});

export default function LeaveForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [openPopover, setOpenPopover] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState(null);

  const form = useForm({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      employee: undefined,
      leave_type: "",
      start_date: new Date(),
      end_date: new Date(),
      reason: "",
      status: "P",
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees/");
        setEmployees(response.data.results);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          title: "Error",
          description: "Failed to fetch employees. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      api
        .get(`/leaves/${id}/`)
        .then((response) => {
          const leaveData = response.data;
          form.reset({
            employee: leaveData.employee.id,
            leave_type: leaveData.leave_type,
            start_date: new Date(leaveData.start_date),
            end_date: new Date(leaveData.end_date),
            reason: leaveData.reason,
            status: leaveData.status,
          });
          if (leaveData.attachment) {
            setAttachment(leaveData.attachment);
          }
        })
        .catch((error) => {
          console.error("Error fetching leave data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch leave data. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, form]);

  function onSubmit(values) {
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "start_date" || key === "end_date") {
        formData.append(key, format(values[key], "yyyy-MM-dd"));
      } else if (key === "attachment" && values[key]) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    // If editing and no new attachment is provided, don't send the attachment field
    if (id && !values.attachment) {
      formData.delete("attachment");
    }

    const url = id ? `/leaves/${id}/` : "/leaves/";
    const method = id ? "put" : "post";

    api({
      method: method,
      url: url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        toast({
          title: "Success",
          description: id
            ? "Leave updated successfully"
            : "Leave request submitted successfully",
        });
        navigate("/admin/leaves");
      })
      .catch((error) => {
        console.error("Error submitting leave request:", error);
        toast({
          title: "Error",
          description: "Failed to submit leave request. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Update Leave Request" : "Submit Leave Request"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Employee selection field */}
            <FormField
              control={form.control}
              name="employee"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Employee</FormLabel>
                  <Popover open={openPopover} onOpenChange={setOpenPopover}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPopover}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? employees.find((e) => e.id === field.value)?.name
                            : "Select employee"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search employee..." />
                        <CommandList>
                          <CommandEmpty>No employee found.</CommandEmpty>
                          <CommandGroup>
                            {employees.map((employee) => (
                              <CommandItem
                                key={employee.id}
                                onSelect={() => {
                                  form.setValue("employee", employee.id);
                                  setOpenPopover(false);
                                }}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    employee.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {employee.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the employee for this leave request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Leave type field */}
            <FormField
              control={form.control}
              name="leave_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AL">Annual Leave</SelectItem>
                      <SelectItem value="SL">Sick Leave</SelectItem>
                      <SelectItem value="UL">Unpaid Leave</SelectItem>
                      <SelectItem value="ML">Maternity Leave</SelectItem>
                      <SelectItem value="PL">Paternity Leave</SelectItem>
                      <SelectItem value="BL">Bereavement Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date range fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
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
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues().start_date ||
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reason field */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a reason for your leave request"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide a detailed reason for your leave request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="P">Pending</SelectItem>
                      <SelectItem value="A">Approved</SelectItem>
                      <SelectItem value="R">Rejected</SelectItem>
                      <SelectItem value="C">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attachment field */}
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          setAttachment(null);
                        }}
                      />
                      {attachment && (
                        <a
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload any relevant documents (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/leaves")}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-1/2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {id ? "Updating..." : "Submitting..."}
                  </>
                ) : id ? (
                  "Update Leave Request"
                ) : (
                  "Submit Leave Request"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}