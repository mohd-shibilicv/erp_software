import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { File, Printer, Upload } from "lucide-react";
import InvoicePrint from "./templates/InvoicePrint";
import { Calendar, Search, Plus, X } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CustomerAccountModal from "../modals/CustomerAccountModal";
import ModalOptions from "./templates/ModalOptions";

const customerAccounts = [
  { label: "Cash Account - 0003", value: "cash-0003" },
  { label: "John Doe - 0004", value: "john-0004" },
  { label: "Jane Smith - 0005", value: "jane-0005" },
];

const salesAccounts = [
  { label: "0001 - General Sales", value: "0001" },
  { label: "0002 - Online Sales", value: "0002" },
  { label: "0003 - Retail Sales", value: "0003" },
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

const LocalPurchaseOrder = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      product: null,
      barcode: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);

  const [customerAccount, setCustomerAccount] = useState(
    customerAccounts[0].value
  );
  const [isCustomerAccountModalOpen, setIsCustomerAccountModalOpen] =
    useState();

  const [invoiceNumber, setInvoiceNumber] = useState("SL#00034");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const invoicePrintRef = useRef();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrintContent = useReactToPrint({
    content: () => invoicePrintRef.current,
  });

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      product: null,
      barcode: "",
      quantity: 1,
      discount: 0,
      unitPrice: 0,
      taxRate: 0,
      total: 0,
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
            updatedItem.unitPrice = value.price;
            updatedItem.barcode = value.barcode;
          }
          if (field === "barcode") {
            const product = dummyProducts.find((p) => p.barcode === value);
            if (product) {
              updatedItem.product = product;
              updatedItem.unitPrice = product.price;
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
    return subtotal;
  };

  const calculateSubTotal = () =>
    items.reduce((sum, item) => sum + item.total, 0);

  const handleSaveCustomerAccount = async (formData) => {
    console.log("Customer Account Created:", formData);
    setIsCustomerAccountModalOpen(false);
  };

  const calculateTotalDiscount = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice;
      return sum + subtotal;
    }, 0);
  };

  const calculateTotalTax = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice;
      return sum + subtotal;
    }, 0);
  };
  return (
    <>
      <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Local Purchase Order</h1>

        <Card className="mb-6">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <Input
                type="date"
                className="w-40"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
              <Input
                placeholder="LPO Number"
                defaultValue="LPO#00034"
                className="w-40"
              />
              <Input placeholder="Reference" className="w-40" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" /> Item Lookup
              </Button>
              <Button>Get Purchase Request</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex gap-2 items-center">
                <Combobox
                  options={customerAccounts}
                  value={customerAccount}
                  onChange={setCustomerAccount}
                  placeholder="Select Master Data"
                  className="w-full"
                />
              </div>
              <div></div>
              <div className="flex items-center justify-end">
                <Input
                  type="file"
                  id="quotation"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    // Handle file upload logic here
                    console.log(e.target.files[0]);
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("quotation").click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Quotation
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
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
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "unitPrice",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.total.toFixed(2)}
                        readOnly
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

            <div className="w-full flex justify-end mb-4">
              <Button onClick={addItem} className="mt-4">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div></div>
              <div></div>

              <Card>
                <CardContent className="mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>Grand Total</span>
                      <Input
                        type="number"
                        value={calculateSubTotal().toFixed(2)}
                        className="w-32"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <div className="space-x-2">
            {/* <Button>Apply</Button> */}
            <Button onClick={() => setIsModalOpen(true)}>
              <Printer className="h-3 w-4 mr-2" /> Print Invoice
            </Button>
            <Button variant="outline">Save & Print</Button>
            <Button variant="outline">Clear All</Button>
            <Button variant="outline">Find</Button>
          </div>
        </div>
      </div>
      <CustomerAccountModal
        isOpen={isCustomerAccountModalOpen}
        onClose={() => setIsCustomerAccountModalOpen(false)}
        onSave={handleSaveCustomerAccount}
      />
      {isModalOpen && (
        <ModalOptions
          onClose={() => setIsModalOpen(false)}
          items={items}
          customerAccount={customerAccount}
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          calculateSubTotal={calculateSubTotal}
          calculateTotalDiscount={calculateTotalDiscount}
          calculateTotalTax={calculateTotalTax}
        />
      )}
    </>
  );
};

export default LocalPurchaseOrder;
