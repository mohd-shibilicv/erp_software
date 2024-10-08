import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const AssetTransfer = () => {
  const { user } = useSelector((state) => state.auth);
  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [transferFromBranch, setTransferFromBranch] = useState("");
  const [transferToBranch, setTransferToBranch] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchIncharge, setBranchIncharge] = useState("");
  const [availableBranches, setAvailableBranches] = useState([]);
  const [assets, setAssets] = useState([
    {
      serialNo: "1",
      itemName: "",
      itemCode: "",
      specification: "",
      reasonCode: "",
      qty: "",
      image: "",
    },
  ]);
  const [availableItems, setAvailableItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    // Fetch available items and branches on component mount
    const fetchItemsAndBranches = async () => {
      try {
        // Simulated API calls
        setAvailableItems([
          {
            itemName: "Laptop",
            itemCode: "LT001",
            specification: "Dell XPS 13",
            qty: 5,
          },
          {
            itemName: "Monitor",
            itemCode: "MN001",
            specification: '27" 4K Display',
            qty: 10,
          },
        ]);
        setFilteredItems([
          {
            itemName: "Laptop",
            itemCode: "LT001",
            specification: "Dell XPS 13",
            qty: 5,
          },
          {
            itemName: "Monitor",
            itemCode: "MN001",
            specification: '27" 4K Display',
            qty: 10,
          },
        ]);
        setAvailableBranches([
          {
            branchName: "New York",
            branchCode: "NY001",
            branchManager: "John Doe",
          },
          {
            branchName: "Los Angeles",
            branchCode: "LA001",
            branchManager: "Jane Smith",
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchItemsAndBranches();
  }, []);

  const handleItemChange = (index, value) => {
    const selectedItem = availableItems.find((item) => item.itemName === value);
    if (selectedItem) {
      const newAssets = [...assets];
      newAssets[index] = {
        ...newAssets[index],
        ...selectedItem,
      };
      setAssets(newAssets);
    }
  };

  const handleBranchChange = (value, type) => {
    const selectedBranch = availableBranches.find(
      (b) => b.branchName === value
    );
    if (selectedBranch) {
      if (type === "from") {
        setTransferFromBranch(value);
        setBranchCode(selectedBranch.branchCode);
        setBranchIncharge(selectedBranch.branchManager);
      } else {
        setTransferToBranch(value);
      }
    }
  };

  const handleAddRow = () => {
    setAssets([
      ...assets,
      {
        serialNo: (assets.length + 1).toString(),
        itemName: "",
        itemCode: "",
        specification: "",
        reasonCode: "",
        qty: "",
        image: "",
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = value;
    setAssets(newAssets);
  };

  const handleSearchQueryChange = (index, value) => {
    setSearchQuery(value);
    const matchedItems = availableItems.filter((item) =>
      item.itemName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(matchedItems);

    if (value) {
      const selectedItem = availableItems.find(
        (item) => item.itemName === value
      );
      if (selectedItem) {
        handleItemChange(index, selectedItem.itemName);
      }
    }
  };

  const handleRemoveRow = (index) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!transferFromBranch || !transferToBranch) {
      return toast({
        title: "Error",
        description: "Please fill from branch and to branch fields",
        variant: "destructive",
      });
    }

    // Simulated API call
    try {
      // const response = await axios.post('/asset-transfer/add', formData);
      toast({
        title: "Success",
        description: "Asset transfer submitted successfully",
      });
      // Reset form fields here
    } catch (error) {
      console.error("Error submitting asset transfer:", error);
      toast({
        title: "Error",
        description: "Failed to submit asset transfer",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Asset Transfer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="transferDate">Transfer Date</Label>
              <Input
                id="transferDate"
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromBranch">Transfer From Branch</Label>
              <Select
                onValueChange={(value) => handleBranchChange(value, "from")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBranches.map((branch, index) => (
                    <SelectItem key={index} value={branch.branchName}>
                      {branch.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toBranch">Transfer To Branch</Label>
              <Select
                onValueChange={(value) => handleBranchChange(value, "to")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBranches.map((branch, index) => (
                    <SelectItem key={index} value={branch.branchName}>
                      {branch.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchCode">Branch Code</Label>
              <Input id="branchCode" value={branchCode} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchIncharge">Branch Incharge Employee</Label>
              <Input id="branchIncharge" value={branchIncharge} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assets to be Transferred</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial No.</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Asset Code</TableHead>
                <TableHead>Specification</TableHead>
                <TableHead>Asset Quantity</TableHead>
                <TableHead>Reason Code</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset, index) => (
                <TableRow key={index}>
                  <TableCell>{asset.serialNo}</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={asset.itemName}
                      onChange={(e) =>
                        handleSearchQueryChange(index, e.target.value)
                      }
                      list={`item-list-${index}`}
                      placeholder="Click here to select"
                    />
                    <datalist id={`item-list-${index}`}>
                      {filteredItems.map((item, idx) => (
                        <option key={idx} value={item.itemName} />
                      ))}
                    </datalist>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={asset.itemCode}
                      onChange={(e) =>
                        handleInputChange(index, "itemCode", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={asset.specification}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "specification",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{asset.qty}</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={asset.reasonCode}
                      onChange={(e) =>
                        handleInputChange(index, "reasonCode", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveRow(index)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button onClick={handleAddRow} variant="outline">
              Add Asset
            </Button>
            <Button onClick={handleSubmit}>Submit Transfer</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssetTransfer;
