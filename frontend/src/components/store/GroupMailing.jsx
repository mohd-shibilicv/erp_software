import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchStaff, fetchManagers, fetchSuppliers, fetchClients, api } from '@/services/api';
import axios from 'axios';

const groups = [
  { id: 'staff', name: "Staff" },
  { id: 'managers', name: "Branch Managers" },
  { id: 'suppliers', name: "Suppliers" },
  { id: 'clients', name: "Clients" },
];

const formSchema = z.object({
  group: z.string().min(1, { message: "Please select a group" }),
  subject: z.string().min(1, { message: "Please enter a subject" }),
  message: z.string().min(1, { message: "Please enter a message" }),
});

const GroupMailing = () => {
  const [recipients, setRecipients] = useState([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group: "",
      subject: "",
      message: "",
    },
  });

  const { data: staffData } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff,
  });

  const { data: managersData } = useQuery({
    queryKey: ['managers'],
    queryFn: fetchManagers,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  const sendEmailMutation = useMutation({
    mutationFn: (formData) => {
      return api.post('/group-mailing/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email sent successfully",
      });
      form.reset();
      setRecipients([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send email",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values) => {
    const selectedRecipients = recipients.filter((r) => r.selected);

    const formData = new FormData();
    formData.append("group", values.group);
    formData.append("subject", values.subject);
    formData.append("message", values.message);
    formData.append("recipients", JSON.stringify(selectedRecipients));

    sendEmailMutation.mutate(formData);
  };

  const handleGroupChange = useCallback((value) => {
    let selectedRecipients = [];
    switch (value) {
      case 'staff':
        selectedRecipients = staffData?.map(staff => ({
          id: staff.id,
          name: `${staff.username}`,
          email: staff.email,
          selected: true
        })) || [];
        break;
      case 'managers':
        selectedRecipients = managersData?.results?.map(manager => ({
          id: manager.id,
          name: `${manager.username}`,
          email: manager.email,
          selected: true
        })) || [];
        break;
      case 'suppliers':
        selectedRecipients = suppliersData?.results?.map(supplier => ({
          id: supplier.id,
          name: supplier.name,
          email: supplier.email,
          selected: true
        })) || [];
        break;
      case 'clients':
        selectedRecipients = clientsData?.results?.map(client => ({
          id: client.id,
          name: client.name,
          email: client.email,
          selected: true
        })) || [];
        break;
      default:
        selectedRecipients = [];
    }
    setRecipients(selectedRecipients);
  }, [staffData, managersData, suppliersData, clientsData]);

  const toggleRecipient = useCallback((id) => {
    setRecipients((prev) =>
      prev.map((recipient) =>
        recipient.id === id
          ? { ...recipient, selected: !recipient.selected }
          : recipient
      )
    );
  }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "group") {
        handleGroupChange(value.group);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, handleGroupChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group-mailing p-6 max-w-7xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-center mb-8"
      >
        Group Mailing
      </motion.h2>
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Compose Email</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem
                              key={group.id}
                              value={group.id}
                            >
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Controller
                          name="message"
                          control={form.control}
                          render={({ field }) => (
                            <ReactQuill
                              theme="snow"
                              value={field.value}
                              onChange={field.onChange}
                              className="bg-white"
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={sendEmailMutation.isLoading}>
                  {sendEmailMutation.isLoading ? "Sending..." : "Send Email"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell>
                        <Checkbox
                          checked={recipient.selected}
                          onCheckedChange={() => toggleRecipient(recipient.id)}
                        />
                      </TableCell>
                      <TableCell>{recipient.name}</TableCell>
                      <TableCell>{recipient.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GroupMailing;