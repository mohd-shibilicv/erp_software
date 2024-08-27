import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";
import Layout from "@/components/layout/Layout";

const ReportTable = ({ data, columns }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index} className="font-semibold">
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {row[column.toLowerCase().replace(/ /g, "_")]}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

const ReportCard = ({ title, children }) => (
  <Card className="w-full shadow-md mt-10">
    <CardHeader className="bg-gray-50">
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-6">{children}</CardContent>
  </Card>
);

const useReport = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`${endpoint}`);
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

const ReportComponent = ({ title, endpoint, columns }) => {
  const { data, loading, error } = useReport(endpoint);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [data, searchTerm]);

  if (loading) {
    return (
      <ReportCard title={title}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ReportCard>
    );
  }

  if (error) {
    return (
      <ReportCard title={title}>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </ReportCard>
    );
  }

  return (
    <ReportCard title={title}>
      <div className="mb-4">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ReportTable data={filteredData} columns={columns} />
    </ReportCard>
  );
};

const reportConfigs = [
  {
    id: "inward",
    title: "Inward Quantity Report",
    endpoint: "/reports/inward-qty/",
    columns: ["Product  Name", "Supplier  Name", "Total Quantity", "Expiry Date"],
  },
  {
    id: "outward",
    title: "Outward Quantity Report",
    endpoint: "/reports/outward-qty/",
    columns: ["Product  Name", "Branch  Name", "Total Quantity", "Expiry Date"],
  },
  {
    id: "branch-wise",
    title: "Branch-Wise Quantity Report",
    endpoint: "/reports/branch-wise-qty/",
    columns: ["Branch  Name", "Product  Name", "Total Quantity"],
  },
  {
    id: "expired",
    title: "Expired Product Report",
    endpoint: "/reports/expired-products/",
    columns: ["Product  Name", "Expiry Date", "Quantity"],
  },
  {
    id: "supplier-wise",
    title: "Supplier-Wise Product Report",
    endpoint: "/reports/supplier-wise-products/",
    columns: ["Supplier  Name", "Product  Name", "Total Quantity"],
  },
  {
    id: "opened",
    title: "Opened Product Report",
    endpoint: "/reports/opened-products/",
    columns: ["Product  Name", "Branch  Name", "Quantity"],
  },
  {
    id: "closed",
    title: "Closed Product Report",
    endpoint: "/reports/closed-products/",
    columns: ["Product  Name", "Branch  Name", "Quantity"],
  },
  {
    id: "product-details",
    title: "Product Details Report",
    endpoint: "/reports/product-details/",
    columns: ["Name", "SKU", "Total Inflow", "Total Outflow", "Closing Stock"],
  },
];

const DailyReport = () => {
  const { data, loading, error } = useReport("/reports/daily/");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ReportCard title="Daily Report">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Inflows</h3>
          <ReportTable
            data={data.inflows}
            columns={["Product Name", "Quantity Received"]}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Outflows</h3>
          <ReportTable
            data={data.outflows}
            columns={["Product Name", "Quantity Sent"]}
          />
        </div>
      </div>
    </ReportCard>
  );
};

const StoreReports = () => {
  const [activeTab, setActiveTab] = useState("inward");

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Store Reports</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
            {reportConfigs.map((config) => (
              <TabsTrigger
                key={config.id}
                value={config.id}
                className="px-4 py-2"
              >
                {config.title.split(" ")[0]}
              </TabsTrigger>
            ))}
            <TabsTrigger value="daily" className="px-4 py-2">
              Daily
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            {reportConfigs.map((config) => (
              <TabsContent key={config.id} value={config.id}>
                <ReportComponent
                  title={config.title}
                  endpoint={config.endpoint}
                  columns={config.columns}
                />
              </TabsContent>
            ))}
            <TabsContent value="daily">
              <DailyReport />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StoreReports;
