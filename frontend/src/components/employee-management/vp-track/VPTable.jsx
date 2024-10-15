import React, { useState } from "react";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VPEdit  } from "./VPEdit"; // You'll need to create this component

export function VPTable({ data, currentPage, totalPages, onPageChange }) {
    console.log("VPTable data:", data);
  const [columnFilters, setColumnFilters] = useState([]);
  const [editingVP, setEditingVP] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    {
      accessorKey: "vp_no",
      header: () => <div className="font-semibold">VP No</div>,
    },
    {
      accessorKey: "nation",
      header: () => <div className="font-semibold">Nationality</div>,
      cell: ({ row }) => (
        <div>
          {row.original.nation}
        </div>
      ),
    },
    {
      accessorKey: "vp_expiry",
      header: () => <div className="font-semibold">VP Expiry</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("vp_expiry")
            ? format(new Date(row.getValue("vp_expiry")), "PPP")
            : "Pending"}
        </div>
      ),
    },
    {
        accessorKey: "company_name",
        header: () => <div className="font-semibold">Company</div>,
        cell: ({ row }) => (
          <div>
            {row.original.company_name}
          </div>
        ),
      },
    {
      accessorKey: "employee_name",
      header: () => <div className="font-semibold">Employee</div>,
      cell: ({ row }) => (
        <div>
          {row.original.employee_name}
        </div>
      ),
    },
    {
      accessorKey: "employee_designation",
      header: () => <div className="font-semibold">Designation</div>,
    },
    {
      accessorKey: "visa_count",
      header: () => <div className="font-semibold">Visa Quantity</div>,
    },
    {
      accessorKey: "_id",
      header: () => <div className="font-semibold">Actions</div>,
      cell: ({ row }) => (
        <div className="flex">
          <button
            onClick={() => handleEditClick(row.original)}
            className="size-8 border rounded-md flex justify-center items-center bg-gray-900 text-white"
          >
            <Edit className="w-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  const handleEditClick = (rowData) => {
    setEditingVP(rowData);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (typeof onVPUpdated === 'function') {
      onVPUpdated();
    }
    setIsEditModalOpen(false);
    setEditingVP(null);
  };

  return (
    <div>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[50vw] w-full">
          <DialogHeader>
            <DialogTitle>Edit VP</DialogTitle>
            <DialogDescription>Update VP tracking details</DialogDescription>
          </DialogHeader>
          {editingVP && (
            <VPEdit 
              vpData={editingVP}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingVP(null);
              }}
              onUpdate={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border border-gray-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-14">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-12"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="capitalize">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
