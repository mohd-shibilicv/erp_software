"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { api } from "@/services/api"
import { useQuery } from "@tanstack/react-query"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  
const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").max(100, "First name must be less than 100 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(100, "Last name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  hire_date: z.string().min(1, "Hire date is required"),
  birth_date: z.string().min(1, "Birth date is required"),
  nationality: z.string().min(2, "Nationality must be at least 2 characters").max(100, "Nationality must be less than 100 characters"),
  work_location: z.string().min(2, "Work location must be at least 2 characters").max(100, "Work location must be less than 100 characters"),
  emergency_contact: z.string().max(100, "Emergency contact must be less than 100 characters").optional(),
  emergency_phone: z.string().max(20, "Emergency phone must be less than 20 characters").optional(),
  manager: z.string().nullable(),
  is_active: z.boolean(),
})

export function EmployeeForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])

  const { data: managerData, isLoading: isLoadingManagers } = useQuery({
    queryKey: ["managers"],
    queryFn: () => api.get("/employees/"),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      position: "",
      department: "",
      hire_date: "",
      birth_date: "",
      nationality: "",
      work_location: "",
      emergency_contact: "",
      emergency_phone: "",
      manager: null,
      is_active: true,
    },
  })

  useEffect(() => {
    fetchDepartments()
    fetchPositions()
    if (id) {
      fetchEmployee()
    }
  }, [id])

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments/")
      setDepartments(response.data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch departments. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchPositions = async () => {
    try {
      const response = await api.get("/positions/")
      setPositions(response.data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch positions. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/employees/${id}/`)
      const employeeData = response.data
      form.reset({
        ...employeeData,
        department: employeeData.department.toString(),
        position: employeeData.position.id.toString(),
        manager: employeeData.manager ? employeeData.manager.id.toString() : "none",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch employee data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (values) => {
    setIsLoading(true)
    try {
      const formData = {
        ...values,
        department: parseInt(values.department),
        position: parseInt(values.position),
        manager: values.manager === "none" ? null : parseInt(values.manager),
      }
      if (id) {
        await api.put(`/employees/${id}/`, formData)
      } else {
        await api.post("/employees/", formData)
      }
      toast({
        title: "Success",
        description: `Employee ${id ? "updated" : "added"} successfully.`,
      })
      navigate("/admin/employees")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: `Failed to ${id ? "update" : "add"} employee. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Employee" : "Add New Employee"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Department */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={department.id.toString()}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Position */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positions.map((position) => (
                            <SelectItem key={position.id} value={position.id.toString()}>
                              {position.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Hire Date */}
                <FormField
                  control={form.control}
                  name="hire_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hire Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Birth Date */}
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Nationality */}
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Nationality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Work Location */}
                <FormField
                  control={form.control}
                  name="work_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Work Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Emergency Contact */}
                <FormField
                  control={form.control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Emergency Contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Emergency Phone */}
                <FormField
                  control={form.control}
                  name="emergency_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Emergency Phone" {...field} />
                      </FormControl>
                      <FormDescription>Format: +1 (123) 456-7890</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Manager */}
                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "none"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Manager" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Manager</SelectItem>
                          {!isLoadingManagers && managerData?.data.results.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id.toString()}>
                              {`${manager.first_name} ${manager.last_name}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Is Active */}
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active Employee</FormLabel>
                        <FormDescription>
                          Is this employee currently active?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/employees")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {id ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{id ? "Update Employee" : "Add Employee"}</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}