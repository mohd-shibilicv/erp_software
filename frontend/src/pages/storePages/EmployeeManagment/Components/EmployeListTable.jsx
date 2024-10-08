/* eslint-disable react/prop-types */
import {
  //   ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";

// import axios from "axios";
import { Button } from "@/components/ui/button";
// import { LeaveAddModal } from "./leave-add";
import { Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import UserAddModal from "./user-add-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { employeeSearchOptions } from "@/constants/employee";
import { useDispatch } from "react-redux";
// import { setEmployees } from "@/redux/Employee/employeeSlice";

export function EmployeeCompanyCommonTable({
  columns,
  data,
  from = "other",
  heading = "",
}) {
  const dispath = useDispatch();
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  const navigate = useNavigate();
  const [columnVisibility, setColumnVisibility] = React.useState({});
  columnVisibility;
  setColumnVisibility;
  const [searchParam, setSearchParam] = useSearchParams();
  const [selectedOption, setSelectedOption] = useState("");
  const handleSearchOptionParamChange = (option) => {
    const param = new URLSearchParams(window.location.search);
    setSelectedOption(option);
    setSearvhVal("");
    ["employeeSearchOptions"].forEach((option) => {
      if (param.has(option)) {
        param.delete(option);
      }
    });
    param.set(option, "");
    setSearchParam(param);
  };
  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    for (let key of param.keys()) {
      if (["employeeSearchOptions"].includes(key)) {
        setSelectedOption(key);
        setSearvhVal(searchParam.get(key));
        break;
      }
    }
  }, []);
  useEffect(() => {
    if (from == "employee") {
      const delayDebounceFn = setTimeout(() => {
        // axios
        //   .get(
        //     `/employee/employee?${selectedOption}=${searchParam.get(
        //       selectedOption
        //     )}`
        //   )
        //   .then(({ data }) => {
        //     dispath(setEmployees(data.employees));
        //   });
      }, 500);

      // Cleanup function to clear the timeout when searchParam or selectedOption changes
      return () => clearTimeout(delayDebounceFn);
    }
  }, [dispath, from, searchParam, selectedOption]);
  const handleSearchInputChange = ({ target }) => {
    let { value } = target;
    setSearvhVal(value);
    const param = new URLSearchParams(window.location.search);
    if (!selectedOption) {
      setSelectedOption(["employeeSearchOptions"][0]);
    }
    param.set(selectedOption, value);
    setSearchParam(param);
  };
  const [searchVal, setSearvhVal] = useState("");

  return (
    <div>
      <div className="flex items-center py-4">
        {/* {from == "leave" && (
          <>
            <LeaveAddModal />
          </>
        )} */}
        {from == "employee" && (
          <div className="w-full flex lg:flex-row flex-col justify-between">
            {" "}
            <Button
              className="bg-gray-900 hover:bg-gray-700"
              onClick={() => navigate("add-employee/")}
            >
              Add new Employee
            </Button>
            <div className="flex gap-2 w-full lg:w-[400px]  ">
              <Input
                value={searchVal}
                type="search"
                onChange={handleSearchInputChange}
                className="bg-white shadow-md"
                placeholder={`Search Employee with ${selectedOption}`}
              />
              <Select onValueChange={handleSearchOptionParamChange}>
                <SelectTrigger className="w-[180px] bg-white shadow-md">
                  <SelectValue
                    placeholder={selectedOption ? selectedOption : "Filter by"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {["employeeSearchOptions"].map((val) => (
                    <SelectItem key={val} value={val} className="capitalize">
                      {val == "workBranch" ? "Branch" : val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {from == "vehicle" && (
          <div className="w-full flex flex-col sm:flex-row justify-between">
            {" "}
            <Button
              className="bg-gray-900 hover:bg-gray-700"
              onClick={() => navigate("/company/add-vehicle")}
            >
              Add new Vehicle
            </Button>
            {/* <Input
                placeholder="Search Vehicle name"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="shadow-md sm:w-[300px] w-full"
              /> */}
          </div>
        )}
        {from == "company" && (
          <>
            {" "}
            <Button
              className="bg-gray-900 hover:bg-gray-700"
              onClick={() => navigate("/company/add-company")}
            >
              Add new company
            </Button>
          </>
        )}
        {/* {from == "users" && (
          <>
            <UserAddModal />
          </>
        )} */}
        <DropdownMenu>
          {from == "leave" && (
            <>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto p-2">
                  <Eye className="w-4" />
                </Button>
              </DropdownMenuTrigger>
            </>
          )}
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {from == "employeeRpt" && (
        <div className="w-full mb-3">
          <Input
            placeholder="Search employee name"
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm shadow-md bg-white"
          />
        </div>
      )}
      <div className="rounded-md border border-gray-300">
        {from == "nested" && (
          <div className="w-full h-10 rounded-tl-md rounded-tr-md bg-gray-500/10 flex items-center px-4 font-semibold">
            {heading}
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-14">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="h-12"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
    </div>
  );
}
