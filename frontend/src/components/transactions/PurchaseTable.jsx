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
import {
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Plus,
  Filter,
  Check,
  Copy,
  AlertTriangle,
} from "lucide-react";
import PurchaseModal from "./PurchaseModal";
import { purchaseService } from "@/services/purchaseService";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const PurchaseTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletePurchaseId, setDeletePurchaseId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const response = await purchaseService.getAllPurchases();
      setPurchases(response.data.results);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (id = null) => {
    setSelectedPurchaseId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPurchaseId(null);
    setIsModalOpen(false);
    fetchPurchases();
  };

  const handleSoftDelete = async () => {
    try {
      await purchaseService.softDeletePurchase(deletePurchaseId);
      fetchPurchases();
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Error soft deleting purchase:", error);
    }
  };

  const handleCopyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "is_deleted",
        header: "",
        cell: ({ row }) => (
          <div className={`w-1 h-full ${row.original.is_deleted ? 'bg-red-500' : ''}`}></div>
        ),
      },
      {
        accessorKey: "purchase_number",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Purchase Number
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => row.original.purchase_number || "-",
      },
      {
        accessorKey: "lpo_number",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              LPO
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const purchase = row.original;
          return (
            <div className="flex items-center">
              <span>{purchase.lpo_number}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopyToClipboard(purchase.lpo_number, purchase.id)
                }
              >
                {copiedId === purchase.id ? (
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
        accessorKey: "date",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
      },
      {
        accessorKey: "total_amount",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Total Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) =>
          `QAR ${parseFloat(row.getValue("total_amount")).toFixed(2)}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              row.original.is_deleted
                ? "bg-red-200 text-red-800"
                : row.original.status === "Pending"
                ? "bg-yellow-200 text-yellow-800"
                : row.original.status === "Approved"
                ? "bg-green-200 text-green-800"
                : row.original.status === "Completed"
                ? "bg-blue-200 text-blue-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {row.original.is_deleted ? "Deleted" : row.original.status}
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
              <DropdownMenuItem
                onClick={() => handleOpenModal(row.original.id)}
                disabled={row.original.is_deleted}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeletePurchaseId(row.original.id);
                  setIsAlertOpen(true);
                }}
                className="text-red-600"
                disabled={row.original.is_deleted}
              >
                {row.original.is_deleted ? "Deleted" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [copiedId]
  );

  const filteredData = useMemo(() => {
    return purchases.filter((purchase) => {
      const matchesStatus =
        statusFilter === "All" || purchase.status === statusFilter;
      const matchesGlobalFilter =
        purchase.purchase_number
          .toLowerCase()
          .includes(globalFilter.toLowerCase()) ||
        purchase.supplier_name
          .toLowerCase()
          .includes(globalFilter.toLowerCase()) ||
        purchase.status.toLowerCase().includes(globalFilter.toLowerCase());
      return matchesStatus && matchesGlobalFilter;
    });
  }, [purchases, statusFilter, globalFilter]);

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
        <h1 className="text-3xl font-bold">Purchases</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <Plus className="mr-2" size={16} /> New Purchase
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Input
            placeholder="Search purchases..."
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
                    <TableHead key={header.id} className="text-center">
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
              <AnimatePresence>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <Popover key={row.id}>
                      <PopoverTrigger asChild>
                        <motion.tr
                          key={row.id}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                          className={row.original.is_deleted ? "bg-red-50 border-l-4 border-red-500 cursor-help" : ""}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="text-center">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </motion.tr>
                      </PopoverTrigger>
                      {row.original.is_deleted && (
                        <PopoverContent className="w-80">
                          <div className="text-center">
                            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                            <p className="font-semibold text-red-500">This purchase has been deleted</p>
                            <p className="text-sm text-gray-500 mt-1">The purchase is marked as deleted but can be restored if needed.</p>
                          </div>
                        </PopoverContent>
                      )}
                    </Popover>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="text-center py-4"
                    >
                      No purchases found
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
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        purchaseId={selectedPurchaseId}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the purchase as deleted. It can be restored
              later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSoftDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default PurchaseTable;
