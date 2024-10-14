import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
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
import { Edit } from "lucide-react";
import { EditCompany } from "@/pages/storePages/CompanyManagement/EditCompany"; // Ensure this import path is correct

const CompanyTable = ({ data, onCompanyUpdated }) => { // Corrected here
  const navigate = useNavigate();
  const [columnFilters, setColumnFilters] = useState([]);
  const [searchParam, setSearchParam] = useSearchParams();
  const [searchVal, setSearchVal] = useState("");
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns = [
    {
      accessorKey: "company_name",
      header: () => <div className="font-semibold">Company Name</div>,
    },
    {
      accessorKey: "cr_no",
      header: () => <div className="font-semibold">Company CR No.</div>,
      cell: ({ row }) => <div>{row.getValue("cr_no") || "Pending"}</div>,
    },
    {
      accessorKey: "cr_expiry",
      header: () => <div className="font-semibold">Company CR Expiry</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("cr_expiry") ? format(row.getValue("cr_expiry"), "PPP") : "Pending"}
        </div>
      ),
    },
    {
      accessorKey: "ruksa_number",
      header: () => <div className="font-semibold">Ruksa No.</div>,
      cell: ({ row }) => <div>{row.getValue("ruksa_number") || "Pending"}</div>,
    },
    {
      accessorKey: "ruksa_expiry",
      header: () => <div className="font-semibold">Ruksa Expiry</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("ruksa_expiry") ? format(row.getValue("ruksa_expiry"), "PPP") : "Pending"}
        </div>
      ),
    },
    {
      accessorKey: "computer_card",
      header: () => <div className="font-semibold">Computer Card</div>,
      cell: ({ row }) => <div>{row.getValue("computer_card") || "Pending"}</div>,
    },
    {
      accessorKey: "computer_card_expiry",
      header: () => <div className="font-semibold">Computer Card Expiry</div>,
      cell: ({ row }) => (
        <div>
          {row.getValue("computer_card_expiry") ? format(row.getValue("computer_card_expiry"), "PPP") : "Pending"}
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
              setEditingCompanyId(row.original?.id);
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

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const key = "companySearchOptions"; // Assuming this is for company search
    setSearchVal(param.get(key) || "");
  }, [searchParam]);

  const handleSearchInputChange = ({ target }) => {
    const { value } = target;
    setSearchVal(value);
    const param = new URLSearchParams(window.location.search);
    param.set("companySearchOptions", value);
    setSearchParam(param);
  };

  return (
    <div>
      {editingCompanyId ? (
        <EditCompany
          companyId={editingCompanyId}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCompanyId(null);
            onCompanyUpdated(); // Call this function after closing the modal
          }}
          onCompanyUpdated={onCompanyUpdated} // Pass the function to EditCompany
        />
      ) : (
        <>
          <div className="flex items-center py-4">
            <Button
              className="bg-gray-900 hover:bg-gray-700"
              onClick={() => navigate("add-company/")}
            >
              Add New Company
            </Button>
            <div className="flex gap-2 w-full lg:w-[400px]">
              <Input
                value={searchVal}
                type="search"
                onChange={handleSearchInputChange}
                className="bg-white shadow-md"
                placeholder="Search Company"
              />
            </div>
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
        </>
      )}
    </div>
  );
};

export default CompanyTable;
