import React, { useState } from "react";
import { Component, Search } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DrawerTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const exampleInvoices = [
  {
    id: 1,
    invNo: "INV001",
    supInvNo: "SUP001",
    invDate: "2024-08-01",
    invAmt: 1000,
    paidAmt: 500,
    balance: 500,
  },
  {
    id: 2,
    invNo: "INV002",
    supInvNo: "SUP002",
    invDate: "2024-08-05",
    invAmt: 1500,
    paidAmt: 750,
    balance: 750,
  },
  {
    id: 3,
    invNo: "INV003",
    supInvNo: "SUP003",
    invDate: "2024-08-10",
    invAmt: 2000,
    paidAmt: 1000,
    balance: 1000,
  },
  {
    id: 4,
    invNo: "INV004",
    supInvNo: "SUP004",
    invDate: "2024-08-10",
    invAmt: 2000,
    paidAmt: 1000,
    balance: 1000,
  },
  {
    id: 5,
    invNo: "INV005",
    supInvNo: "SUP005",
    invDate: "2024-08-10",
    invAmt: 2000,
    paidAmt: 1000,
    balance: 1000,
  },
  {
    id: 6,
    invNo: "INV006",
    supInvNo: "SUP006",
    invDate: "2024-08-10",
    invAmt: 2000,
    paidAmt: 1000,
    balance: 1000,
  },
  {
    id: 7,
    invNo: "INV007",
    supInvNo: "SUP007",
    invDate: "2024-08-10",
    invAmt: 2000,
    paidAmt: 1000,
    balance: 1000,
  },
  {
    id: 8,
    invNo: "INV008",
    supInvNo: "SUP008",
    invDate: "2024-08-10",
    invAmt: 2000,
    paidAmt: 1000,
    balance: 1000,
  },
  {
    id: 9,
    invNo: "INV009",
    supInvNo: "SUP009",
    invDate: "2024-08-10",
    invAmt: 2000,
    paidAmt: 1000,
    balance: 1000,
  },
];

export function AllocatedAmountDrawer({ isOpen, onClose, onSave }) {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState(0);
  const [filteredInvoices, setFilteredInvoices] = useState(exampleInvoices);

  const handleInvoiceNoChange = (e) => {
    const value = e.target.value;
    setInvoiceNo(value);
    filterInvoices(value);
  };

  const filterInvoices = (value) => {
    const filtered = exampleInvoices.filter((invoice) =>
      invoice.invNo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  const handleSave = () => {
    onSave({ invoiceNo, supplierInvoiceNo, allocatedAmount });
    onClose();
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Allocate Amount</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="invoiceNo" className="text-sm font-medium">
                  Invoice No.
                </label>
                <div className="flex">
                  <Input
                    id="invoiceNo"
                    value={invoiceNo}
                    onChange={handleInvoiceNoChange}
                    className="rounded"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="supInvoiceNo" className="text-sm font-medium">
                  Supplier Invoice No.
                </label>
                <Input
                  id="supInvoiceNo"
                  value={supplierInvoiceNo}
                  onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="allocatedAmount"
                  className="text-sm font-medium"
                >
                  Allocated Amount
                </label>
                <Input
                  id="allocatedAmount"
                  type="number"
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(e.target.value)}
                />
              </div>
            </div>

            <DrawerTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Inv Date</TableHead>
                  <TableHead>Inv.No.</TableHead>
                  <TableHead>Sup.Inv.No.</TableHead>
                  <TableHead>Inv Amt</TableHead>
                  <TableHead>Paid Amt</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invDate}</TableCell>
                    <TableCell>{invoice.invNo}</TableCell>
                    <TableCell>{invoice.supInvNo}</TableCell>
                    <TableCell>{invoice.invAmt}</TableCell>
                    <TableCell>{invoice.paidAmt}</TableCell>
                    <TableCell>{invoice.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DrawerTable>
          </div>
          <DrawerFooter>
            <Button onClick={handleSave}>Save</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={() => onClose()}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
