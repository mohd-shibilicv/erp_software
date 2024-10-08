import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Plus, ArrowUpDown, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { clientRequirementService } from "@/services/crmServiceApi";

export default function ClientRequirementsList() {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const navigate = useNavigate();
  const [columnVisibility, setColumnVisibility] = useState({
    color_theme: false,
    layout: false,
  });

  useEffect(() => {
    fetchClientlist();
  }, []);

  const fetchClientlist = async () => {
    try {
      setLoading(true);
      const response = await clientRequirementService.getAll();
      console.log(response.data.results)
      setRelationships(response.data.results);
    } catch (error) {
      console.error("Error fetching client Requirements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalFilter = (value) => {
    setGlobalFilter(value);
    table.setGlobalFilter(value);
  };

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
        accessorKey: "file_number",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            File Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("file_number")}</div>,
      },
      {
        accessorKey: "client.name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Client Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.original.client.name}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="capitalize flex justify-center gap-2 items-center">
            <span
              className={`p-1 h-1 rounded-full ${row.getValue("status") === "pending"
                  ? "bg-yellow-500"
                  : row.getValue("status") === "confirmed"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
            />
            {row.getValue("status")}
          </div>
        )
      },
      {
        accessorKey: "color_theme",
        header: "Color Theme",
        cell: ({ row }) => <div>{row.getValue("color_theme")}</div>,
        enableColumnFilter: false, 
      },
      {
        accessorKey: "layout",
        header: "Layout",
        cell: ({ row }) => <div>{row.getValue("layout")}</div>,
        enableColumnFilter: false, 
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
                  navigate(`/admin/client-requirements/${row.original.id}`)
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
    data: relationships,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableFields = ['id', 'file_number', 'client.name', 'status'];
      return searchableFields.some(field => {
        const value = field === 'client.name' ? row.original.client.name : row.getValue(field);
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      });
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 bg-white border shadow-sm  rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Client Requirements List</h1>
        <Button onClick={() => navigate("/admin/client-requirements/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <div className="flex items-center py-4">
        <Input
  placeholder="Search by ID, file number, client name, or status..."
  value={globalFilter ?? ''}
  onChange={(event) => handleGlobalFilter(event.target.value)}
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
