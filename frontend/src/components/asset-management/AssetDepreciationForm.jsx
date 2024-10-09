import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function AssetDepreciationForm() {
  const { user } = useSelector((state) => state.auth);
  const [depreciationDate, setDepreciationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [voucherNo, setVoucherNo] = useState("");
  const [depreciationYear, setDepreciationYear] = useState(
    new Date().getFullYear().toString()
  );
  const [assets, setAssets] = useState([
    {
      serialNo: "1",
      itemName: "",
      itemCode: "",
      assetValue: "",
      depreciationPercentage: "",
      amountOfDepreciation: "",
      afterAssetTotalValue: "",
      specification: "",
    },
  ]);
  const [availableItems, setAvailableItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Simulated API call
        setAvailableItems([
          {
            itemName: "Laptop",
            itemCode: "LT001",
            assetValue: "1000",
            depreciationPercentage: "20",
          },
          {
            itemName: "Monitor",
            itemCode: "MN001",
            assetValue: "500",
            depreciationPercentage: "15",
          },
        ]);
        setFilteredItems([
          {
            itemName: "Laptop",
            itemCode: "LT001",
            assetValue: "1000",
            depreciationPercentage: "20",
          },
          {
            itemName: "Monitor",
            itemCode: "MN001",
            assetValue: "500",
            depreciationPercentage: "15",
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchItems();
  }, []);

  const calculateDepreciation = (assetValue, depreciationPercentage) => {
    return ((assetValue * depreciationPercentage) / 100).toFixed(2);
  };

  const calculateAfterDepreciationValue = (
    assetValue,
    depreciationPercentage
  ) => {
    return (assetValue - (assetValue * depreciationPercentage) / 100).toFixed(
      2
    );
  };

  const handleItemChange = (index, value) => {
    const selectedItem = availableItems.find((item) => item.itemName === value);
    if (selectedItem) {
      const newAssets = [...assets];
      newAssets[index] = {
        ...newAssets[index],
        ...selectedItem,
        amountOfDepreciation: calculateDepreciation(
          selectedItem.assetValue,
          selectedItem.depreciationPercentage
        ),
        afterAssetTotalValue: calculateAfterDepreciationValue(
          selectedItem.assetValue,
          selectedItem.depreciationPercentage
        ),
      };
      setAssets(newAssets);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = value;
    setAssets(newAssets);
  };

  const handleSearchQueryChange = (index, value) => {
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

  const handleAddRow = () => {
    setAssets([
      ...assets,
      {
        serialNo: (assets.length + 1).toString(),
        itemName: "",
        itemCode: "",
        assetValue: "",
        depreciationPercentage: "",
        amountOfDepreciation: "",
        afterAssetTotalValue: "",
        specification: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!depreciationDate || !voucherNo || !depreciationYear) {
      return toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
    }

    // Simulated API call
    try {
      // const response = await axios.post('/asset-depreciation/add', formData);
      toast({
        title: "Success",
        description: "Asset depreciation submitted successfully",
      });
      // Reset form fields here
    } catch (error) {
      console.error("Error submitting asset depreciation:", error);
      toast({
        title: "Error",
        description: "Failed to submit asset depreciation",
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
          <CardTitle>Asset Depreciation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="depreciationDate">Depreciation Date</Label>
              <Input
                id="depreciationDate"
                type="date"
                value={depreciationDate}
                onChange={(e) => setDepreciationDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voucherNo">Voucher Number</Label>
              <Input
                id="voucherNo"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                placeholder="Enter voucher number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depreciationYear">Depreciation Year</Label>
              <Input
                id="depreciationYear"
                value={depreciationYear}
                onChange={(e) => setDepreciationYear(e.target.value)}
                placeholder="Enter depreciation year"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Depreciation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial No.</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Asset Value</TableHead>
                <TableHead>% of Depreciation</TableHead>
                <TableHead>Amount of Depreciation</TableHead>
                <TableHead>After Asset Total Value</TableHead>
                <TableHead>Specification</TableHead>
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
                    <Input type="text" value={asset.itemCode} readOnly />
                  </TableCell>
                  <TableCell>
                    <Input type="text" value={asset.assetValue} readOnly />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={asset.depreciationPercentage}
                      readOnly
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={asset.amountOfDepreciation}
                      readOnly
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={asset.afterAssetTotalValue}
                      readOnly
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
            <Button onClick={handleSubmit}>Submit Depreciation</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
