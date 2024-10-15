import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Plus, Search, Filter, Trash2, AlertTriangle, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import SalesModal from './SalesModal';
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
import { saleService } from '@/services/purchaseService';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Switch } from "@/components/ui/switch";

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteSaleId, setDeleteSaleId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await saleService.getAllSales();
      setSales(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (saleId = null) => {
    setSelectedSaleId(saleId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSaleId(null);
    fetchSales();
  };

  const handleSoftDelete = async () => {
    if (deleteSaleId) {
      try {
        await saleService.softDeleteSale(deleteSaleId);
        fetchSales();
      } catch (error) {
        console.error('Error soft deleting sale:', error);
      }
    }
    setIsAlertOpen(false);
    setDeleteSaleId(null);
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "sale_number",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sale Number
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center">
            <span>{row.getValue("sale_number")}</span>
            <Button
              variant="ghost"
              className="ml-2 h-6 w-6 p-0"
              onClick={() => handleCopyId(row.original.id)}
            >
              {copiedId === row.original.id ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        ),
      },
      {
        accessorKey: "sales_order_number",
        header: "Sales Order",
        cell: ({ row }) => (
          <div className="flex items-center">
            <span>{row.getValue("sales_order_number") || "N/A"}</span>
            {row.getValue("sales_order_number") && (
              <Button
                variant="ghost"
                className="ml-2 h-6 w-6 p-0"
                onClick={() => handleCopyId(row.getValue("sales_order_number"))}
              >
                {copiedId === row.getValue("sales_order_number") ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        ),
      },
      {
        accessorKey: "client_name",
        header: "Client",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => format(new Date(row.getValue("date")), 'dd/MM/yyyy'),
      },
      {
        accessorKey: "total_amount",
        header: "Total Amount",
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
                : row.original.status === "Completed"
                ? "bg-green-200 text-green-800"
                : row.original.status === "Cancelled"
                ? "bg-red-200 text-red-800"
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleOpenModal(row.original.id)}
                disabled={row.original.is_deleted}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteSaleId(row.original.id);
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
    return sales.filter((sale) => {
      const matchesStatus =
        statusFilter === "All" || (sale.status && sale.status === statusFilter);
      const matchesGlobalFilter =
        (sale.sale_number && sale.sale_number.toLowerCase().includes(globalFilter.toLowerCase())) ||
        (sale.sales_order_number && sale.sales_order_number.toLowerCase().includes(globalFilter.toLowerCase())) ||
        (sale.client_name && sale.client_name.toLowerCase().includes(globalFilter.toLowerCase())) ||
        (sale.status && sale.status.toLowerCase().includes(globalFilter.toLowerCase()));
      const matchesDeletedFilter = showDeleted || !sale.is_deleted;
      return matchesStatus && matchesGlobalFilter && matchesDeletedFilter;
    });
  }, [sales, statusFilter, globalFilter, showDeleted]);

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
        <h1 className="text-3xl font-bold">Sales</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <Plus className="mr-2" size={16} /> New Sale
        </Button>
      </div>
      <div className="flex space-x-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" /> {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Cancelled")}>
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center space-x-2">
          <Switch
            checked={showDeleted}
            onCheckedChange={setShowDeleted}
            id="show-deleted"
          />
          <label htmlFor="show-deleted" className="text-sm font-medium">
            Show Deleted
          </label>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                          className={row.original.is_deleted ? "bg-red-100 border-l-4 border-red-500 cursor-help" : ""}
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
                            <p className="font-semibold text-red-500">This sale has been deleted</p>
                            <p className="text-sm text-gray-500 mt-1">The sale is marked as deleted but can be restored if needed.</p>
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
                      No sales found
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
      <SalesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        saleId={selectedSaleId}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the sale as deleted. It can be restored
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

export default SalesTable;