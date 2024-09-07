import React, { useState } from "react";
import { Calendar, Search, Plus, Minus, X } from "lucide-react";
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
import { Combobox } from "../ui/Combobox";
import Layout from "../layout/Layout";
import { Textarea } from "../ui/textarea";

const customerAccounts = [
  { label: "Cash Account - 0003", value: "cash-0003" },
  { label: "John Doe - 0004", value: "john-0004" },
  { label: "Jane Smith - 0005", value: "jane-0005" },
];

const invoices = [
  { label: "Invoice 1", value: "invoice_1" },
  { label: "Invoice 2", value: "invoice_2" },
  { label: "Invoice 3", value: "invoice_3" },
];

const salesmen = [
  { label: "Alice Johnson", value: "alice" },
  { label: "Bob Williams", value: "bob" },
  { label: "Charlie Brown", value: "charlie" },
];

const dummyProducts = [
  { id: 1, code: "P001", barcode: "123456", name: "Widget A", price: 10 },
  { id: 2, code: "P002", barcode: "234567", name: "Gadget B", price: 20 },
  { id: 3, code: "P003", barcode: "345678", name: "Thingamajig C", price: 30 },
];

const barcodeOptions = dummyProducts.map((product) => ({
  value: product.barcode,
  label: `${product.barcode}`,
}));

const DeliveryNote = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      product: null,
      barcode: "",
      quantity: 1,
    },
  ]);
  const [customerAccount, setCustomerAccount] = useState(
    customerAccounts[0].value
  );
  const [salesman, setSalesman] = useState("");
  const [invoice, setInvoice] = useState("");

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      product: null,
      barcode: "",
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "product") {
            updatedItem.barcode = value.barcode;
          }
          if (field === "barcode") {
            const product = dummyProducts.find((p) => p.barcode === value);
            if (product) {
              updatedItem.product = product;
            }
          }
          updatedItem.total = calculateItemTotal(updatedItem);
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateItemTotal = (item) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    return subtotal - discountAmount;
  };

  const calculateSubTotal = () =>
    items.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Delivery Note</h1>

        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <Input
                type="date"
                className="w-40"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
              <Input
                placeholder="Voucher Number"
                defaultValue="SL#00034"
                className="w-40"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" /> Item Lookup
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex gap-2 items-center">
                <Combobox
                  options={customerAccounts}
                  value={customerAccount}
                  onChange={setCustomerAccount}
                  placeholder="Select Cash Account"
                  className="w-full"
                />
                <div className="p-2 border rounded cursor-pointer">
                  <Plus />
                </div>
              </div>
              <div>
                <Combobox
                  options={invoices}
                  value={invoice}
                  onChange={setInvoice}
                  placeholder="Select Invoice"
                  className="w-full"
                />
              </div>
              <Select value={salesman} onValueChange={setSalesman}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Salesman" />
                </SelectTrigger>
                <SelectContent>
                  {salesmen.map((sm) => (
                    <SelectItem key={sm.value} value={sm.value}>
                      {sm.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input value={item.id} readOnly className="w-12" />
                    </TableCell>
                    <TableCell>
                      <Combobox
                        options={barcodeOptions}
                        value={item.barcode}
                        onChange={(value) =>
                          updateItem(item.id, "barcode", value)
                        }
                        placeholder="Select"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.product?.code || ""}
                        readOnly
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.product?.id.toString()}
                        onValueChange={(value) =>
                          updateItem(
                            item.id,
                            "product",
                            dummyProducts.find((p) => p.id.toString() === value)
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyProducts.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="w-full flex justify-end">
              <Button onClick={addItem} className="mt-4">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <div className="space-x-2">
            <Button>Apply</Button>
            <Button variant="outline">Save & Print</Button>
            <Button variant="outline">Clear All</Button>
            <Button variant="outline">Find</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryNote;
