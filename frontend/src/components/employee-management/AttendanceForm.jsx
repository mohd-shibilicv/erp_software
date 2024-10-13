"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/services/api";

const formSchema = z.object({
  employee: z.number(),
  status: z.enum([
    "present",
    "absent",
    "on_leave",
    "half_day",
    "late",
    "early_leave",
  ]),
  date: z.date({
    required_error: "Date is required",
  }),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  overtime_hours: z.number().min(0).max(24).optional(),
  is_remote: z.boolean().default(false),
});

export default function AttendanceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [openPopover, setOpenPopover] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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
    const fetchAttendanceData = async () => {
      if (id) {
        try {
          const response = await api.get(`/attendance/${id}/`);
          setAttendanceData(response.data);
        } catch (error) {
          console.error("Error fetching attendance data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch attendance data. Please try again.",
            variant: "destructive",
          });
          navigate("/admin/attendance");
        }
      }
    };

    fetchAttendanceData();
  }, [id, navigate]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: attendanceData
      ? {
          ...attendanceData,
          date: new Date(attendanceData.date),
          employee: attendanceData.employee.id,
        }
      : {
          employee: undefined,
          status: "present",
          date: new Date(),
          check_in: "",
          check_out: "",
          overtime_hours: 0,
          is_remote: false,
        },
  });

  useEffect(() => {
    if (attendanceData) {
      Object.keys(attendanceData).forEach((key) => {
        if (key === "employee") {
          form.setValue("employee", attendanceData.employee.id);
        } else {
          form.setValue(
            key,
            key === "date" ? new Date(attendanceData[key]) : attendanceData[key]
          );
        }
      });
    }
  }, [attendanceData, form]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formattedDate = format(data.date, "yyyy-MM-dd");
      const payload = {
        ...data,
        date: formattedDate,
        check_in: data.check_in
          ? `${formattedDate}T${data.check_in}:00Z`
          : null,
        check_out: data.check_out
          ? `${formattedDate}T${data.check_out}:00Z`
          : null,
      };

      let response;
      if (id) {
        response = await api.put(`/attendance/${id}/`, payload);
      } else {
        response = await api.post("/attendance/", payload);
      }

      toast({
        title: "Success",
        description: `Attendance ${id ? "updated" : "created"} successfully.`,
      });

      navigate("/admin/attendance");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Error",
        description: "Failed to save attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? "Edit Attendance" : "Create Attendance"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    Select the employee for this attendance record.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 items-center">
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
                          <SelectValue placeholder="Select attendance status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="early_leave">Early Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-3">
                    <FormLabel>Date</FormLabel>
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
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
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenCalendar(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="check_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="check_out"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="overtime_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overtime Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : 0
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the number of overtime hours (if any).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_remote"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remote Work</FormLabel>
                    <FormDescription>
                      Check if the employee worked remotely on this day.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/attendance")}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : id ? "Update" : "Create"} Attendance
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
