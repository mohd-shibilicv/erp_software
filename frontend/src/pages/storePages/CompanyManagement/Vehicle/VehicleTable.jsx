import React, { useEffect, useState } from "react";
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
import { EditVehicle } from "@/pages/storePages/CompanyManagement/Vehicle/EditVehicle";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function VehicleTable({ data, onVehicleUpdated, from = "vehicle" }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    {
      accessorKey: "vehicle_name",
      header: () => <div className="font-semibold">Vehicle Name</div>,
    },
    {
      accessorKey: "vehicle_no",
      header: () => <div className="font-semibold">Vehicle Number</div>,
      cell: ({ row }) => <div>{row.getValue("vehicle_no") || "Pending"}</div>,
    },
    {
      accessorKey: "owner_id",
      header: () => <div className="font-semibold">Owner ID</div>,
      cell: ({ row }) => <div>{row.getValue("owner_id") || "Pending"}</div>,
    },
    {
      accessorKey: "vehicle_model",
      header: () => <div className="font-semibold">Vehicle Model</div>,
      cell: ({ row }) => <div>{row.getValue("vehicle_model") || "Pending"}</div>,
    },
    {
      accessorKey: "expiry_date",
      header: () => <div className="font-semibold">Vehicle Expiry</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("expiry_date")
            ? format(new Date(row.getValue("expiry_date")), "PPP")
            : "Pending"}
        </div>
      ),
    },
    {
      accessorKey: "_id",
      header: () => <div className="font-semibold">Actions</div>,
      cell: ({ row }) => (
        <div className="flex">
          <button
            onClick={() => {
              setEditingVehicleId(row.original?.id);
              setIsEditModalOpen(true);
            }}
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

  return (
    <div>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[50vw] w-full">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {editingVehicleId && (
            <EditVehicle
              vehicleId={editingVehicleId}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingVehicleId(null);
                onVehicleUpdated();
              }}
              onVehicleUpdated={onVehicleUpdated} 
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="flex items-center py-4 ">
      </div>
      <div className="rounded-md border border-gray-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="h-14">
                {headerGroup.headers.map(header => (
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
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="h-12" data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
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
