import React, { useState } from "react";
import { Calendar, Search, Plus, Minus, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
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

const dummyProducts = [
  { id: 1, code: "P001", barcode: "123456", name: "Widget", price: 10 },
  { id: 2, code: "P002", barcode: "234567", name: "Gadget B", price: 20 },
  { id: 3, code: "P003", barcode: "345678", name: "Thingamajig C", price: 30 },
];

const PhysicalStock = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      product: null,
      batch_no: 1,
      manufacturing_date: new Date(),
      expiry_date: new Date(),
      quantity: 0,
      amount: 0,
    },
  ]);

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      product: null,
      batch_no: 1,
      manufacturing_date: new Date(),
      expiry_date: new Date(),
      quantity: 0,
      amount: 0,
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
          return updatedItem;
        }
        return item;
      })
    );
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Physical Stock Verification</h1>

        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <Input type="date" className="w-40" defaultValue={new Date().toISOString().split("T")[0]} />
              <Input
                placeholder="Physical Stock No."
                className="w-40"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch/Lot No.</TableHead>
                  <TableHead>Manufacturing Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
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
                        value={item.batch_no}
                        onChange={(value) =>
                          updateItem(item.id, "batch_no", value)
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        className="w-40"
                        defaultValue={item.manufacturing_date}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        className="w-40"
                        defaultValue={item.expiry_date}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(value) =>
                          updateItem(item.id, "quantity", value)
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(value) =>
                          updateItem(item.id, "amount", value)
                        }
                        className="w-24"
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
    </Layout>
  );
};

export default PhysicalStock;
