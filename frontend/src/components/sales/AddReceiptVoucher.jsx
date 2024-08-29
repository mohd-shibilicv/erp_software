import React, { useState } from "react";
import { Calendar, Plus, Minus, Component } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "../layout/Layout";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const AddReceiptVoucher = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, account: "", amount: 0, remarks: "", transactionType: "" },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);

  const addTransaction = () => {
    const newTransaction = {
      id: transactions.length + 1,
      account: "",
      amount: 0,
      remarks: "",
      transactionType: "",
    };
    setTransactions([...transactions, newTransaction]);
  };

  const removeTransaction = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  const updateTransaction = (id, field, value) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, [field]: value } : transaction
      )
    );
  };

  const openDrawer = (id) => {
    setCurrentTransactionId(id);
    setIsDrawerOpen(true);
  };

  const handleDrawerSave = (allocatedData) => {
    updateTransaction(
      currentTransactionId,
      "amount",
      parseFloat(allocatedData.allocatedAmount)
    );
    updateTransaction(
      currentTransactionId,
      "remarks",
      `Inv: ${allocatedData.invoiceNo}, Sup.Inv: ${allocatedData.supplierInvoiceNo}`
    );
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Card className="w-full mx-auto">
        <CardHeader className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold">Add Receipt</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <Input
                type="date"
                className="w-40"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <Input placeholder="Ref" className="w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
            <div className="flex-1">
                <label htmlFor="receiptFrom" className="text-sm font-medium">
                  Receipt From
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="purchases">Purchases</SelectItem>
                    <SelectItem value="credits">Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="receiptMode" className="text-sm font-medium">
                  Receipt Mode
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_receipt">Bank Receipt</SelectItem>
                    <SelectItem value="cash_receipt">Cash Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <Input id="amount" type="number" value={0} />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Doha Bank</SelectItem>
                  <SelectItem value="cash">Cash Account</SelectItem>
                  <SelectItem value="petty">Petty Cash</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <Label>Remarks</Label>
                <Textarea></Textarea>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default AddReceiptVoucher;
