import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PlusCircle, Trash2, Printer, Save, Image, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Layout from "../layout/Layout";

const InvoiceGenerator = () => {
  const [invoiceType, setInvoiceType] = useState("sales");
  const [headerImage, setHeaderImage] = useState(null);
  const [footerImage, setFooterImage] = useState(null);
  const [columns, setColumns] = useState([
    "Item",
    "Quantity",
    "Price",
    "Total",
  ]);
  const [items, setItems] = useState([]);
  const [newColumn, setNewColumn] = useState("");
  const [newItem, setNewItem] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [issuedTo, setIssuedTo] = useState({
    name: "",
    company: "",
    email: "",
  });
  const [discount, setDiscount] = useState(0);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "header") {
          setHeaderImage(reader.result);
        } else {
          setFooterImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image file");
    }
  };

  const addColumn = () => {
    if (newColumn && !columns.includes(newColumn)) {
      setColumns([...columns, newColumn]);
      setNewColumn("");
    }
  };

  const removeColumn = (column) => {
    setColumns(columns.filter((c) => c !== column));
    setItems(
      items.map((item) => {
        const newItem = { ...item };
        delete newItem[column];
        return newItem;
      })
    );
  };

  const addItem = () => {
    setItems([...items, newItem]);
    setNewItem({});
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === "Quantity" || field === "Price") {
      const quantity = parseFloat(updatedItems[index]["Quantity"]) || 0;
      const price = parseFloat(updatedItems[index]["Price"]) || 0;
      updatedItems[index]["Total"] = (quantity * price).toFixed(2);
    }

    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce(
      (total, item) => total + (parseFloat(item.Total) || 0),
      0
    );
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.05; // Assuming 5% tax rate
  };

  const calculateTotal = (subtotal, tax, discount) => {
    return subtotal - discount + tax;
  };

  return (
    <Layout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Invoice Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Invoice</SelectItem>
                  <SelectItem value="purchase">Purchase Invoice</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Invoice Number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-40"
              />
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("headerImage").click()
                      }
                    >
                      <Image className="h-4 w-4 mr-2" /> Header
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload header image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("footerImage").click()
                      }
                    >
                      <Image className="h-4 w-4 mr-2" /> Footer
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload footer image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <input
                id="headerImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "header")}
                className="hidden"
              />
              <input
                id="footerImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "footer")}
                className="hidden"
              />
            </div>
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <Input
              type="text"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              placeholder="New column name"
              className="w-40"
            />
            <Button onClick={addColumn} variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Column
            </Button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {columns.map((column) => (
              <div
                key={column}
                className="bg-gray-100 px-3 py-1 rounded-lg flex items-center border"
              >
                <span>{column}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeColumn(column)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      <Input
                        type="text"
                        value={item[column] || ""}
                        onChange={(e) =>
                          updateItem(index, column, e.target.value)
                        }
                        className="w-full"
                        readOnly={column === "Total"}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-end">
            <Button onClick={addItem} variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </CardContent>
        <div className="w-full flex justify-between mb-4">
          <Card className="flex flex-col p-5 mr-6">
            <h3 className="text-lg font-semibold mb-2">Issued To:</h3>
            <Input
              type="text"
              placeholder="Name"
              value={issuedTo.name}
              onChange={(e) =>
                setIssuedTo({ ...issuedTo, name: e.target.value })
              }
              className="mb-2"
            />
            <Input
              type="text"
              placeholder="Company"
              value={issuedTo.company}
              onChange={(e) =>
                setIssuedTo({ ...issuedTo, company: e.target.value })
              }
              className="mb-2"
            />
            <Input
              type="email"
              placeholder="Email"
              value={issuedTo.email}
              onChange={(e) =>
                setIssuedTo({ ...issuedTo, email: e.target.value })
              }
            />
          </Card>
          <Card className="flex flex-col p-5 mr-6">
            <div className="flex justify-between border-gray-200 pt-2">
              <span className="font-semibold">Subtotal</span>
              <span>QAR {calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 py-2">
              <span className="font-semibold">Discount</span>
              <Input
                type="number"
                defaultValue={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-20 text-right"
              />
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold">Tax</span>
              <span>5%</span>
            </div>
            <div className="flex justify-between border-t border-b border-gray-200 py-2">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold">
                QAR{" "}
                {calculateTotal(
                  calculateSubtotal(),
                  calculateTax(calculateSubtotal()),
                  discount
                ).toFixed(2)}
              </span>
            </div>
          </Card>
        </div>
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={handlePrint} variant="default">
            <Printer className="h-4 w-4 mr-2" /> Print Invoice
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" /> Save Invoice
          </Button>
        </CardFooter>
      </Card>

      <div className="hidden">
        <div ref={componentRef}>
          {headerImage && (
            <img
              src={headerImage}
              alt="Header"
              className="w-full mb-8 max-h-32"
            />
          )}
          <div className="max-w-4xl mx-auto p-8 bg-white">
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 uppercase">
                  {invoiceType} Invoice
                </h2>
                <p className="font-semibold">INVOICE NO: #{invoiceNumber}</p>
                <p>{invoiceDate}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold mb-2">ISSUED TO</h3>
                <p>Name: {issuedTo.name}</p>
                <p>Company: {issuedTo.company}</p>
                <p>Email: {issuedTo.email}</p>
              </div>
            </div>

            <Table className="w-full mb-8">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-bold py-2 px-4 text-left">
                    PARTICULARS
                  </TableHead>
                  <TableHead className="font-bold py-2 px-4 text-right">
                    QTY
                  </TableHead>
                  <TableHead className="font-bold py-2 px-4 text-right">
                    UNIT PRICE
                  </TableHead>
                  <TableHead className="font-bold py-2 px-4 text-right">
                    TOTAL
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-2 px-4">{item.Item}</TableCell>
                    <TableCell className="py-2 px-4 text-right">
                      {item.Quantity}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-right">
                      QAR {item.Price}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-right">
                      QAR {item.Total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mb-8">
              <div className="w-1/3">
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-semibold">Subtotal</span>
                  <span>QAR {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-semibold">Discount</span>
                  <span>QAR {discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-semibold">Tax (5%)</span>
                  <span>
                    QAR {calculateTax(calculateSubtotal()).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-b border-gray-200 py-2">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-bold">
                    QAR{" "}
                    {calculateTotal(
                      calculateSubtotal(),
                      calculateTax(calculateSubtotal()),
                      discount
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {footerImage && (
            <img
              src={footerImage}
              alt="Footer"
              className="absolute bottom-0 w-full mt-8 max-h-32"
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceGenerator;
