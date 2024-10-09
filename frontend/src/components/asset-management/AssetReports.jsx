"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Printer } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Mock data for demonstration purposes
const mockData = {
  depreciation: [
    {
      id: 1,
      assetName: "Laptop",
      purchaseDate: "2022-01-01",
      originalValue: 1000,
      currentValue: 800,
      depreciationRate: "20%",
    },
    {
      id: 2,
      assetName: "Office Desk",
      purchaseDate: "2021-06-15",
      originalValue: 500,
      currentValue: 400,
      depreciationRate: "10%",
    },
  ],
  transfer: [
    {
      id: 1,
      assetName: "Monitor",
      fromBranch: "Headquarters",
      toBranch: "Branch A",
      transferDate: "2023-03-15",
    },
    {
      id: 2,
      assetName: "Printer",
      fromBranch: "Branch B",
      toBranch: "Headquarters",
      transferDate: "2023-04-20",
    },
  ],
  assetDetails: [
    {
      id: 1,
      assetName: "Laptop",
      serialNumber: "LT001",
      purchaseDate: "2022-01-01",
      category: "Electronics",
      currentValue: 800,
    },
    {
      id: 2,
      assetName: "Office Chair",
      serialNumber: "OC001",
      purchaseDate: "2021-11-10",
      category: "Furniture",
      currentValue: 150,
    },
  ],
  serviceHistory: [
    {
      id: 1,
      assetName: "Printer",
      serviceDate: "2023-02-10",
      description: "Routine maintenance",
      cost: 50,
    },
    {
      id: 2,
      assetName: "Laptop",
      serviceDate: "2023-05-05",
      description: "Battery replacement",
      cost: 100,
    },
  ],
  warrantyExpiry: [
    {
      id: 1,
      assetName: "Laptop",
      purchaseDate: "2022-01-01",
      warrantyEnd: "2025-01-01",
    },
    {
      id: 2,
      assetName: "Monitor",
      purchaseDate: "2021-06-15",
      warrantyEnd: "2024-06-15",
    },
  ],
  branchWise: [
    { id: 1, branchName: "Headquarters", totalAssets: 50, totalValue: 25000 },
    { id: 2, branchName: "Branch A", totalAssets: 30, totalValue: 15000 },
  ],
};

const reportTypes = [
  { id: "depreciation", name: "Depreciation Report" },
  { id: "transfer", name: "Transfer Report" },
  { id: "assetDetails", name: "Asset Details" },
  { id: "serviceHistory", name: "Service History" },
  { id: "warrantyExpiry", name: "Warranty Expiry" },
  { id: "branchWise", name: "Branch Summary" },
];

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#bfbfbf",
    flex: 1,
  },
  headerCell: {
    fontWeight: "bold",
  },
});

const PDFReport = ({ title, data }) => {
  if (data[0] === undefined || null) {
    return <Document></Document>;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {Object.keys(data[0]).map((key) => (
              <Text key={key} style={[styles.tableCell, styles.headerCell]}>
                {key}
              </Text>
            ))}
          </View>
          {data.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              {Object.values(row).map((value, i) => (
                <Text key={i} style={styles.tableCell}>
                  {value}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default function AssetReports() {
  const [activeTab, setActiveTab] = useState("depreciation");
  const [filteredData, setFilteredData] = useState(mockData[activeTab]);
  const [filterDate, setFilterDate] = useState(null);
  const [filterText, setFilterText] = useState("");

  const handleTabChange = (value) => {
    setActiveTab(value);
    setFilteredData(mockData[value]);
    setFilterDate(null);
    setFilterText("");
  };

  const handleFilter = () => {
    let filtered = mockData[activeTab];
    if (filterDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(
          item.purchaseDate || item.transferDate || item.serviceDate
        );
        return itemDate >= filterDate;
      });
    }
    if (filterText) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
    setFilteredData(filtered);
  };

  const formatColumnName = (name) => {
    return name
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
          <CardTitle>Asset Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-16 md:mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {reportTypes.map((report) => (
                <TabsTrigger
                  key={report.id}
                  value={report.id}
                  className="text-xs sm:text-sm"
                >
                  {report.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {reportTypes.map((report) => (
              <TabsContent key={report.id} value={report.id}>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="filterText">Search</Label>
                      <Input
                        id="filterText"
                        placeholder="Enter search term"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Filter by date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filterDate ? (
                              format(filterDate, "MMMM d, yyyy")
                            ) : (
                              <span>Select a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filterDate}
                            onSelect={setFilterDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleFilter}>Apply Filters</Button>
                    </div>
                    <div className="flex items-end">
                      <PDFDownloadLink
                        document={
                          <PDFReport title={report.name} data={filteredData} />
                        }
                        fileName={`${report.id}_report.pdf`}
                      >
                        {({ blob, url, loading, error }) => (
                          <Button
                            variant="outline"
                            onClick={() =>
                              toast({
                                title: "Report Generated",
                                description:
                                  "Your PDF report has been generated and downloaded.",
                              })
                            }
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            {loading ? "Generating PDF..." : "Download PDF"}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </div>
                  {filteredData.length > 0 && filteredData[0] !== undefined ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(filteredData[0]).map((key) => (
                            <TableHead key={key}>
                              {formatColumnName(key)}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((item, index) => (
                          <TableRow key={index}>
                            {Object.values(item).map((value, i) => (
                              <TableCell key={i}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No matching records found.
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
