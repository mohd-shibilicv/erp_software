import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Plus, ArrowUpDown, ChevronDown } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";


export default function QuotationList() {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const navigate = useNavigate();
  

    useEffect(() => {
      const fetchQuotations = async () => {
        try {
          const response = await api.get('/quotations/'); 
          setQuotations(response.data.results);
          console.log(response,"thisis response")
          setLoading(false);
        } catch (error) {
          console.error("Error fetching quotations", error);
          setLoading(false);
        }
      };
  
      fetchQuotations();
    }, []);
  
    const columns = useMemo(
      () => [
        {
          accessorKey: "id",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("id")}</div>,
        },
        {
          accessorKey: "quotation_number",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Quotation Number
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("quotation_number")}</div>,
        },
        {
          accessorKey: "customer",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Customer
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("customer")}</div>,
        },
        {
          accessorKey: "customer_reference",
          header: "Customer Reference",
          cell: ({ row }) => <div>{row.getValue("customer_reference")}</div>,
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ row }) => (
            <div className="capitalize flex justify-center gap-2 items-center">
              <span
                className={`p-1 h-1 rounded-full ${
                  row.getValue("status") === "DRAFT"
                    ? "bg-gray-400"
                    : row.getValue("status") === "PENDING_APPROVAL"
                    ? "bg-yellow-500"
                    : row.getValue("status") === "APPROVED"
                    ? "bg-green-500"
                    : row.getValue("status") === "SENT"
                    ? "bg-blue-500"
                    : row.getValue("status") === "ACCEPTED"
                    ? "bg-green-600"
                    : row.getValue("status") === "REJECTED"
                    ? "bg-red-500"
                    : row.getValue("status") === "EXPIRED"
                    ? "bg-red-400"
                    : ""
                }`}
              />
              {row.getValue("status")}
            </div>
          ),
        },
        {
          id: "actions",
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/admin/quotation/${row.original.id}`)
                  }
                >
                  View details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ],
      [navigate]
    );
  
  
    const table = useReactTable({
        data: quotations,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
          sorting,
          columnFilters,
          columnVisibility,
          rowSelection,
        },
      });
    
      return (
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Quotations</h1>
            <Button onClick={() => navigate("/admin/quotation/new")}>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter quotations..."
              value={table.getColumn("quotation_number")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("quotation_number")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-200">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-center text-black">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      );
    }