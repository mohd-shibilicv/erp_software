import { useState, useMemo } from "react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { MoreHorizontal, Plus, ArrowUpDown } from "lucide-react";
ArrowUpDown;
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { projectApi } from "@/services/project";

import { useGetAllProject } from "@/hooks/useGetProjects";
import { QueryClient } from "@tanstack/react-query";

export default function ProjectsPage() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  const [showState,setShowState]=useState("all")
  const { data: projects=[], isLoading: loading } = useGetAllProject(showState);


  const columns = useMemo(
    () => [
      {
        accessorKey: "project_id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
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
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
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
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
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
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
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
            {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("client")?.name}</div>,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const queryClient = new QueryClient();
          const handleDeleteProject = async () => {
            await projectApi.delete(row.original.id);
            queryClient.invalidateQueries(["projects"])
          };
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
                  onClick={() =>
                    navigate(`/admin/project/${row.original.id}`)
                  }
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
                <DropdownMenuItem onClick={handleDeleteProject}>
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [navigate]
  );
  //   id, status, priority, client;
  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Project list</h1>
        <Button onClick={() => navigate("/admin/project/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>
      <div className="flex items-center py-4"></div>
      <Tabs defaultValue={showState} className="">
        <TabsList>
          <TabsTrigger type="button" className="mr-1" onClick={()=>setShowState("all")} value="all">All</TabsTrigger>
          <TabsTrigger type="button" className="mr-1" onClick={()=>setShowState("active")} value="active">active</TabsTrigger>
          <TabsTrigger type="button" className="mr-1"  onClick={()=>setShowState("inactive")} value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="active"></TabsContent>
        <TabsContent value="inactive"></TabsContent>
      </Tabs>
      <>
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
        <div className="flex items-center justify-end space-x-2 py-4 hidden">
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
              //   onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </>
    </div>
  );
}
