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
import { AllocatedAmountDrawer } from "../modals/AllocatedAmountDrawer";

const AddPaymentTransaction = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, account: "", amount: 0, remarks: "", transactionType: ""},
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
    updateTransaction(currentTransactionId, "amount", parseFloat(allocatedData.allocatedAmount));
    updateTransaction(currentTransactionId, "remarks", `Inv: ${allocatedData.invoiceNo}, Sup.Inv: ${allocatedData.supplierInvoiceNo}`);
    setIsDrawerOpen(false);
  };

  return (
    <Layout>
      <Card className="w-full mx-auto">
        <CardHeader className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold">Add Payment</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <Input
                type="date"
                className="w-40"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <Input placeholder="No." className="w-32" />
            <Input placeholder="Ref" className="w-32" />
            <Button variant="ghost">Cancel</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
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
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Balance:</span>
                <Input value="0.00" readOnly className="w-32" />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="max-w-[150px]">
                      <Select
                        value={transaction.account}
                        onValueChange={(value) =>
                          updateTransaction(transaction.id, "account", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aries">
                            Aries - Customer
                          </SelectItem>
                          <SelectItem value="purchase_account">
                            Purchase Account
                          </SelectItem>
                          <SelectItem value="hisaan_international">
                            Hisaan International
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="flex gap-1">
                      <Input
                        type="number"
                        value={transaction.amount}
                        onChange={(e) =>
                          updateTransaction(
                            transaction.id,
                            "amount",
                            e.target.value
                          )
                        }
                        className="w-32"
                      />
                      <Button variant="outline" onClick={() => openDrawer(transaction.id)}>
                        <Component size={18} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={transaction.remarks}
                        onChange={(e) =>
                          updateTransaction(
                            transaction.id,
                            "remarks",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="flex gap-1">
                      <Select
                        value={transaction.transactionType}
                        onValueChange={(value) =>
                          updateTransaction(
                            transaction.id,
                            "transactionType",
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transfer">Transfer</SelectItem>
                          <SelectItem value="cdc">CDC</SelectItem>
                          <SelectItem value="pdc">PDC</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Component size={18} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="hover:text-red-500"
                        size="icon"
                        onClick={() => removeTransaction(transaction.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center">
              <Button onClick={addTransaction}>
                <Plus className="h-4 w-4" />Add
              </Button>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Total:</span>
                <Input
                  value={transactions
                    .reduce(
                      (sum, transaction) =>
                        sum + Number(transaction.amount || 0),
                      0
                    )
                    .toFixed(2)}
                  readOnly
                  className="w-32"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button>Save</Button>
        </CardFooter>
      </Card>
      <AllocatedAmountDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleDrawerSave}
      />
    </Layout>
  );
};

export default AddPaymentTransaction;
