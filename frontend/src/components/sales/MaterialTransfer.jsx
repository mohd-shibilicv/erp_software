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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "../layout/Layout";
import { Textarea } from "../ui/textarea";

const dummyProducts = [
  { id: 1, code: "P001", barcode: "123456", name: "Widget", price: 10 },
  { id: 2, code: "P002", barcode: "234567", name: "Gadget B", price: 20 },
  { id: 3, code: "P003", barcode: "345678", name: "Thingamajig C", price: 30 },
];

const MaterialTransfer = () => {
  const [sourceItems, setSourceItems] = useState([
    {
      id: 1,
      product: null,
      quantity: 0,
      price: 0,
      amount: 0,
    },
  ]);

  const [destinationItems, setDestinationItems] = useState([
    {
      id: 1,
      product: null,
      quantity: 0,
      price: 0,
      amount: 0,
    },
  ]);

  const addSourceItem = () => {
    const newItem = {
      id: sourceItems.length + 1,
      product: null,
      quantity: 0,
      price: 0,
      amount: 0,
    };
    setSourceItems([...sourceItems, newItem]);
  };

  const addDestincationItem = () => {
    const newItem = {
      id: destinationItems.length + 1,
      product: null,
      quantity: 0,
      price: 0,
      amount: 0,
    };
    setDestinationItems([...destinationItems, newItem]);
  };

  const removeSourceItem = (id) => {
    setSourceItems(sourceItems.filter((item) => item.id !== id));
  };

  const removeDestinationItem = (id) => {
    setDestinationItems(destinationItems.filter((item) => item.id !== id));
  };

  const updateSourceItem = (id, field, value) => {
    setSourceItems(
      sourceItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          return updatedItem;
        }
        return item;
      })
    );
  };

  const updateDestinationItem = (id, field, value) => {
    setDestinationItems(
      destinationItems.map((item) => {
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
        <h1 className="text-3xl font-bold mb-6">
          Transfer of Material/Production
        </h1>
        <div className="flex flex-row justify-between items-center mb-2">
          <Input placeholder="V.NO." className="w-40" />
          <Input type="date" className="w-40" defaultValue="2024-08-27" />
        </div>
        <div className="flex flex-col lg:flex-row gap-1 w-full">
          <Card className="mb-6">
            <p className="w-full flex justify-center font-bold border-b py-2">
              Source (Consumption)
            </p>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sourceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select
                          value={item.product?.id.toString()}
                          onValueChange={(value) =>
                            updateSourceItem(
                              item.id,
                              "product",
                              dummyProducts.find(
                                (p) => p.id.toString() === value
                              )
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
                          onChange={(value) =>
                            updateSourceItem(item.id, "quantity", value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(value) =>
                            updateDestinationItem(item.id, "price", value)
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(value) =>
                            updateSourceItem(item.id, "amount", value)
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSourceItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="w-full flex justify-end">
                <Button onClick={addSourceItem} className="mt-4">
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <p className="w-full flex justify-center font-bold border-b py-2">
              Destination (Production)
            </p>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinationItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select
                          value={item.product?.id.toString()}
                          onValueChange={(value) =>
                            updateDestinationItem(
                              item.id,
                              "product",
                              dummyProducts.find(
                                (p) => p.id.toString() === value
                              )
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
                          onChange={(value) =>
                            updateDestinationItem(item.id, "quantity", value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(value) =>
                            updateDestinationItem(item.id, "price", value)
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(value) =>
                            updateDestinationItem(item.id, "amount", value)
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDestinationItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="w-full flex justify-end">
                <Button onClick={addDestincationItem} className="mt-4">
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="-mt-4">
            <CardHeader>Narration</CardHeader>
            <CardContent>
              <Textarea rows={12} />
            </CardContent>
          </Card>
          <Card className="-mt-4">
            <CardContent className="mt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Labour Charge</span>
                  <Input
                    type="number"
                    defaultValue={0}
                    className="w-32"
                    readOnly
                  />
                </div>
                <div className="flex justify-between">
                  <span>Electricity</span>
                  <Input type="number" defaultValue={0} className="w-32" />
                </div>
                <div className="flex justify-between">
                  <span>Other Charges</span>
                  <Input type="number" defaultValue={0} className="w-32" />
                </div>
                <hr />
                <div className="flex justify-between">
                  <span>Total Additional Cost</span>
                  <Input type="number" defaultValue={0} className="w-32" />
                </div>
                <div className="flex justify-between">
                  <span>Effective Cost</span>
                  <Input type="number" defaultValue={0} className="w-32" />
                </div>
                <div className="flex justify-between">
                  <span>Allocation to primary item</span>
                  <Input type="number" defaultValue={0} className="w-32" />
                </div>
                <div className="flex justify-between">
                  <span>Effective rate of primary item</span>
                  <Input type="number" defaultValue={0} className="w-32" />
                </div>
                <div className="flex justify-between font-bold">
                  <span>Grand Total</span>
                  <Input
                    type="number"
                    defaultValue={0}
                    className="w-32"
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

export default MaterialTransfer;
