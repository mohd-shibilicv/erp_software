import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Search, Plus, Filter, Check, Copy } from "lucide-react";
import { api } from "@/services/api";
import LPOModal from "./LPOModal";

const LPOTable = () => {
  const [lpos, setLPOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLPOId, setSelectedLPOId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteLPOId, setDeleteLPOId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchLPOs();
  }, []);

  const fetchLPOs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/local-purchase-orders/");
      setLPOs(response.data.results);
    } catch (error) {
      console.error("Error fetching LPOs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (id = null) => {
    setSelectedLPOId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLPOId(null);
    setIsModalOpen(false);
    fetchLPOs();
  };

  const handleCopyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/local-purchase-orders/${deleteLPOId}/`);
      fetchLPOs();
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Error deleting LPO:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "lpo_number",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              LPO Number
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "purchase_request_number",
        header: "PR Number",
        cell: ({ row }) => {
            const purchaseRequest = row.original;
            return (
              <div className="flex items-center">
                <span>{purchaseRequest.purchase_request_number}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyToClipboard(purchaseRequest.purchase_request_number, purchaseRequest.id)}
                >
                  {copiedId === purchaseRequest.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            );
        },
      },
      {
        accessorKey: "supplier_name",
        header: "Supplier",
      },
      {
        accessorKey: "date_issued",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date Issued
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => new Date(row.getValue("date_issued")).toLocaleDateString(),
      },
      {
        accessorKey: "delivery_date",
        header: "Delivery Date",
        cell: ({ row }) => new Date(row.getValue("delivery_date")).toLocaleDateString(),
      },
      {
        accessorKey: "total_amount",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Total Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => `QAR ${parseFloat(row.getValue("total_amount")).toFixed(2)}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              row.getValue("status") === "Pending"
                ? "bg-yellow-200 text-yellow-800"
                : row.getValue("status") === "Approved"
                ? "bg-green-200 text-green-800"
                : row.getValue("status") === "Completed"
                ? "bg-blue-200 text-blue-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {row.getValue("status")}
          </span>
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
              <DropdownMenuItem onClick={() => handleOpenModal(row.original.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteLPOId(row.original.id);
                  setIsAlertOpen(true);
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [copiedId]
  );

  const filteredData = useMemo(() => {
    return lpos.filter((lpo) => {
      const matchesStatus = statusFilter === "All" || lpo.status === statusFilter;
      const matchesGlobalFilter =
        lpo.lpo_number.toLowerCase().includes(globalFilter.toLowerCase()) ||
        lpo.supplier_name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        lpo.status.toLowerCase().includes(globalFilter.toLowerCase());
      return matchesStatus && matchesGlobalFilter;
    });
  }, [lpos, statusFilter, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Local Purchase Orders</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <Plus className="mr-2" size={16} /> New LPO
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Input
            placeholder="Search LPOs..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <div className="flex items-center">
          <Filter className="mr-2 text-gray-400" size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      layout
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="text-center py-4">
                      No LPOs found
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex items-center justify-end space-x-2 py-4">
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
      <LPOModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lpoId={selectedLPOId}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the LPO.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default LPOTable;