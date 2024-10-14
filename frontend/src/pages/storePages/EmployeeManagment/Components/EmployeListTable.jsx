import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye } from "lucide-react";
import { EditCompany } from "@/pages/storePages/CompanyManagement/EditCompany"; // Make sure this import path is correct

export function EmployeeCompanyCommonTable({ data, from = "other", heading = "", onCompanyUpdated }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [searchParam, setSearchParam] = useSearchParams();
  const [selectedOption, setSelectedOption] = useState("");
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
      cell: ({ row }) => (
        <div>{row.getValue("cr_no") || "Pending"}</div>
      ),
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
      cell: ({ row }) => (
        <div>{row.getValue("ruksa_number") || "Pending"}</div>
      ),
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
      cell: ({ row }) => (
        <div>{row.getValue("computer_card") || "Pending"}</div>
      ),
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
      columnVisibility,
    },
  });

  const handleSearchOptionParamChange = (option) => {
    const param = new URLSearchParams(window.location.search);
    setSelectedOption(option);
    setSearchVal("");
    param.delete("employeeSearchOptions");
    param.set(option, "");
    setSearchParam(param);
  };

  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    for (let key of param.keys()) {
      if (key === "employeeSearchOptions") {
        setSelectedOption(key);
        setSearchVal(param.get(key));
        break;
      }
    }
  }, [searchParam]);

  useEffect(() => {
    if (from === "employee") {
      const delayDebounceFn = setTimeout(() => {
        // API call logic here (commented out for now)
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [dispatch, from, searchParam, selectedOption]);

  const handleSearchInputChange = ({ target }) => {
    const { value } = target;
    setSearchVal(value);
    const param = new URLSearchParams(window.location.search);
    if (!selectedOption) {
      setSelectedOption("employeeSearchOptions");
    }
    param.set(selectedOption, value);
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
            {from === "employee" && (
              <div className="w-full flex lg:flex-row flex-col justify-between">
                <Button
                  className="bg-gray-900 hover:bg-gray-700"
                  onClick={() => navigate("add-employee/")}
                >
                  Add New Employee
                </Button>
                <div className="flex gap-2 w-full lg:w-[400px]">
                  <Input
                    value={searchVal}
                    type="search"
                    onChange={handleSearchInputChange}
                    className="bg-white shadow-md"
                    placeholder={`Search Employee with ${selectedOption}`}
                  />
                  <Select onValueChange={handleSearchOptionParamChange}>
                    <SelectTrigger className="w-[180px] bg-white shadow-md">
                      <SelectValue placeholder={selectedOption || "Filter by"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employeeSearchOptions" className="capitalize">
                        Employee Search Options
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {from === "vehicle" && (
              <div className="w-full flex flex-col sm:flex-row justify-between">
                <Button
                  className="bg-gray-900 hover:bg-gray-700"
                  onClick={() => navigate("/admin/add-vehicle")}
                >
                  Add New Vehicle
                </Button>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {from === "leave" && (
                  <Button variant="outline" className="ml-auto p-2">
                    <Eye className="w-4" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table.getAllColumns()
                  .filter(column => column.getCanHide())
                  .map(column => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {from === "employeeRpt" && (
            <div className="w-full mb-3">
              <Input
                placeholder="Search employee name"
                value={table.getColumn("name")?.getFilterValue() ?? ""}
                onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="max-w-sm shadow-md bg-white"
              />
            </div>
          )}
          <div className="rounded-md border border-gray-300">
            {from === "nested" && (
              <div className="w-full h-10 rounded-tl-md rounded-tr-md bg-gray-500/10 flex items-center px-4 font-semibold">
                {heading}
              </div>
            )}
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
}
