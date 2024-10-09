import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeCompanyCommonTable } from "../EmployeeManagment/Components/EmployeListTable";
import { format } from "date-fns";

export function VehicleExpense() {
  const navigate = useNavigate();
  navigate;
  const [searchVal, setSearchVal] = useState("");
  const [vehicles, setVehicles] = useState([]);
  setVehicles;
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <div className="w-full">
        <div className="w-full flex justify-between flex-col md:flex-row gap-2">
          <Button>Add Vehicle expense</Button>
          <div className="flex gap-2 md:w-[300px] w-full">
            <Input
              className="shadow-md"
              placeholder="Search Vehicle"
              onChange={(e) => setSearchVal(e.target.value)}
              value={searchVal}
            />
            <Button className="shadow-md">Search</Button>
          </div>
        </div>
        {vehicles && (
          <>
            {vehicles?.map((vehicle) => (
              <>
                {vehicle?.maintenances &&
                  vehicle?.maintenances?.length >= 1 && (
                    <>
                      <EmployeeCompanyCommonTable
                        key={vehicle?._id}
                        columns={[
                          {
                            accessorKey: "maintenance",
                            header: () => (
                              <div className="font-semibold">Expense title</div>
                            ),
                          },
                          {
                            accessorKey: "cost",
                            header: () => (
                              <div className="font-semibold">Cost</div>
                            ),
                          },
                          {
                            accessorKey: "date",
                            header: () => (
                              <div className="font-semibold ">Date</div>
                            ),
                            cell: ({ row }) => {
                              return (
                                <div>
                                  {row.getValue("date") &&
                                    format(row.getValue("date"), "PPP")}
                                </div>
                              );
                            },
                          },
                        ]}
                        data={
                          vehicle?.maintenances ? vehicle?.maintenances : []
                        }
                        from="nested"
                        heading={vehicle?.vehicleName}
                      />
                      <div className="w-full bg-white p-2 rounded-bl-md rounded-br-md font-semibold text-2xl flex gap-5">
                        Total Cost :{" "}
                        <span>
                          {vehicle?.maintenances?.reduce(
                            (ac, val) => ac + val?.cost,
                            0
                          )}
                        </span>
                      </div>
                    </>
                  )}
              </>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
