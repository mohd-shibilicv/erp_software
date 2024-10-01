/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { projectApi } from "@/services/project";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectTable({ data, showState, setShowState }) {
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "project_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("project_id")}</div>,
    },
    {
      accessorKey: "project_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        row;
        return <div>{row.getValue("project_name")}</div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row?.original?.status;
        return <div>{status}</div>;
      },
    },
    {
      accessorKey: "priority_level",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="w-full flex justify-center">
            <div
              className={cn(
                "h-7 gap-2 px-3 text-sm bg-white rounded-xl flex items-center justify-center min-w-20 ",
                {
                  "bg-red-400 text-white":
                    row.getValue("priority_level") == "low",
                  "bg-green-400 text-white":
                    row.getValue("priority_level") == "high",
                  "bg-yellow-400 text-white":
                    row.getValue("priority_level") == "medium",
                }
              )}
            >
              <div
                className={cn("size-[6px] rounded-full", {
                  "bg-red-600": row.getValue("priority_level") == "low",
                  "bg-green-600 text-white":
                    row.getValue("priority_level") == "high",
                  "bg-yellow-600 text-white":
                    row.getValue("priority_level") == "medium",
                })}
              />
              {row.getValue("priority_level")}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "client",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("client")?.name}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const queryClient = useQueryClient();
        const handleDeleteProject = async () => {
          await projectApi.delete(row.original.id);
          queryClient.invalidateQueries([
            "projects",
            document.getElementById("StateShowBox").textContent,
          ]);
        };
        const navigate = useNavigate();
        return (
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
                onClick={() => navigate(`/admin/project/${row.original.id}`)}
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/admin/project/edit/${row.original.id}`)
                }
              >
                Edit Project
              </DropdownMenuItem>
              <Button className="bg-transparent h-8 w-full flex justify-start p-0 text-black hover:bg-gray-200">
                <AlertDialog>
                  <AlertDialogTrigger className=" h-full pl-2 items-center flex justify-start w-full ">
                    Delete Project
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove project data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProject}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  
  const table = useReactTable({
    data,
    columns,
    // pageCount: Math.ceil(data.length / pagination.pageSize), // Calculate total pages
    // manualPagination: true, // This ensures pagination is handled manually
    // onPaginationChange: setPagination, // Handle pagination state change
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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
    <main>
      <>
        <div className="w-full flex justify-between mb-4">
          <Tabs defaultValue={showState} className="">
            <TabsList className="bg-gray-200">
              <TabsTrigger
                type="button"
                className="mr-1"
                onClick={() => setShowState("all")}
                value="all"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                type="button"
                className="mr-1"
                onClick={() => setShowState("active")}
                value="active"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                type="button"
                className="mr-1"
                onClick={() => setShowState("inactive")}
                value="inactive"
              >
                Inactive
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active"></TabsContent>
            <TabsContent value="inactive"></TabsContent>
          </Tabs>
          <Input
            placeholder="Filter Projects"
            value={table.getColumn("project_name")?.getFilterValue() ?? ""}
            className="w-full md:w-[300px]"
            onChange={(event) =>
              table
                .getColumn("project_name")
                ?.setFilterValue(event.target.value)
            }
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-center text-black"
                    >
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
        <div className="flex items-center justify-end space-x-2 py-4 ">
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
            <span className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
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
      </>
    </main>
  );
}
