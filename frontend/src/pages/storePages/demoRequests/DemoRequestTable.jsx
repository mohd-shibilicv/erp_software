import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ClientDetails from "./ClientDetails";
import { api } from "@/services/api";
import { format } from "date-fns";

export default function DemoRequestTable() {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDemoRequests();
  }, [currentPage, filterValue, startDate, endDate]);

  const fetchDemoRequests = async () => {
    try {
      const response = await api.get("/client-requests/", {
        params: {
          page: currentPage,
          filter: filterValue,
          start_date: startDate,
          end_date: endDate,
        },
      });
      setData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      console.error("Error fetching demo requests:", error);
    }
  };

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const columns = [
    { id: "clientName", header: "Client Name", accessorKey: "client_name" },
    { id: "email", header: "Email", accessorKey: "client_email" },
    { id: "number", header: "Number", accessorKey: "client_number" },
    { id: "companyName", header: "Company Name", accessorKey: "company_name" },
    {
      id: "scheduled_date",
      header: "Scheduled Date",
      cell: ({ row }) => {
        const scheduledDate = format(row.original.scheduled_date, "PPPp");
        return <p>{scheduledDate}</p>;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <p className="p-2 bg-gray-100 font-semibold rounded text-center capitalize">
            {status}
          </p>
        );
      },
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button variant="ghost" onClick={() => handleView(row.original.id)}>
          View
        </Button>
      ),
    },
  ];

  const handleView = (id) => {
    const client = data.find((c) => c.id === id);
    setSelectedClient(client);
  };

  const handleBack = () => {
    setSelectedClient(null);
    fetchDemoRequests(); // Refresh the list after returning
  };

  if (selectedClient) {
    return <ClientDetails client={selectedClient} onBack={handleBack} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="Filter clients..."
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="startDate">From Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endDate">To Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
          {(startDate || endDate) && (
            <Button variant="secondary" onClick={handleClearDates}>
              Clear Dates
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((client) => (
              <TableRow key={client.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.cell
                      ? column.cell({ row: { original: client } })
                      : client[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
