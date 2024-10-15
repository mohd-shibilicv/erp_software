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
import { EditAMC } from "./EditAMC";

export function AMCTable({ data, onAMCUpdated }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [editingAMC, setEditingAMC] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    {
      accessorKey: "fire_certification_image",
      header: () => <div className="font-semibold">Fire Certification</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("fire_certification_image") ? (
            <img
              src={row.getValue("fire_certification_image")}
              alt="Fire Certification"
              className="w-20 h-20 object-cover"
            />
          ) : (
            "No Image"
          )}
        </div>
      ),
    },
    {
      accessorKey: "amc_contract_image",
      header: () => <div className="font-semibold">AMC Contract</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("amc_contract_image") ? (
            <img
              src={row.getValue("amc_contract_image")}
              alt="AMC Contract"
              className="w-20 h-20 object-cover"
            />
          ) : (
            "No Image"
          )}
        </div>
      ),
    },
    {
      accessorKey: "fire_contract_remark",
      header: () => <div className="font-semibold">Fire Contract Remark</div>,
      cell: ({ row }) => <div>{row.getValue("fire_contract_remark") || "No Remark"}</div>,
    },
    {
      accessorKey: "amc_start_date",
      header: () => <div className="font-semibold">AMC Start Date</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("amc_start_date")
            ? format(new Date(row.getValue("amc_start_date")), "PPP")
            : "Not Set"}
        </div>
      ),
    },
    {
      accessorKey: "amc_end_date",
      header: () => <div className="font-semibold">AMC End Date</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("amc_end_date")
            ? format(new Date(row.getValue("amc_end_date")), "PPP")
            : "Not Set"}
        </div>
      ),
    },
    {
      accessorKey: "amc_contract_remark",
      header: () => <div className="font-semibold">AMC Remark</div>,
      cell: ({ row }) => <div>{row.getValue("amc_contract_remark") || "No Remark"}</div>,
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
    setEditingAMC(rowData);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (typeof onAMCUpdated === 'function') {
      onAMCUpdated();
    }
    setIsEditModalOpen(false);
    setEditingAMC(null);
  };

  return (
    <div>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[50vw] w-full">
          <DialogHeader>
            <DialogTitle>Edit AMC</DialogTitle>
            <DialogDescription>Update Annual Maintenance Cost details</DialogDescription>
          </DialogHeader>
          {editingAMC && (
            <EditAMC
              amcData={editingAMC}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingAMC(null);
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
    </div>
  );    
}
