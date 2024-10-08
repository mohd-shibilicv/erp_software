import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useState } from "react";
import { EmployeeCompanyCommonTable } from "./Components/EmployeListTable";

export default function UniformReport() {
  const [selectedDate, setSelectedDate] = useState(undefined);
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <div className="w-full">
        <div className="w-full flex justify-between md:flex-row flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            Uniform Giving report by Date ={" "}
            {selectedDate && format(new Date(String(selectedDate)), "PPP")}
          </h1>
          <Input
            value={
              selectedDate instanceof Date && !isNaN(selectedDate)
                ? selectedDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-full md:w-[280px]"
            placeholder="Select Date"
            type="date"
          />
        </div>
        <div className="w-full">
          <EmployeeCompanyCommonTable
            columns={[
              {
                accessorKey: "name",
                header: () => <div className="font-semibold">Name</div>,
              },
              {
                accessorKey: "email",
                header: () => <div className="font-semibold">Email</div>,
                cell: ({ row }) => (
                  <div>
                    {!row.getValue("email") && "Pending"}
                    {row.getValue("email")}
                  </div>
                ),
              },
              {
                accessorKey: "designation",
                header: () => <div className="font-semibold">Designation</div>,
                cell: ({ row }) => (
                  <div>
                    {!row.getValue("designation") && "Pending"}
                    {row.getValue("designation")}
                  </div>
                ),
              },
              {
                accessorKey: "workBranch",
                header: () => <div className="font-semibold">Branch</div>,
                cell: ({ row }) => (
                  <div>
                    {!row.getValue("workBranch") && "Pending"}
                    {row.getValue("workBranch")}
                  </div>
                ),
              },
              {
                accessorKey: "joiningDate",
                header: () => <div className="font-semibold">Joined Date</div>,
                cell: ({ row }) => {
                  return (
                    <div>
                      {!row.getValue("joiningDate") && "Pending"}
                      {row.getValue("joiningDate") &&
                        format(String(row.getValue("joiningDate")), "PPP")}
                    </div>
                  );
                },
              },
              {
                accessorKey: "arriveDate",
                header: () => <div className="font-semibold">Arrived Date</div>,
                cell: ({ row }) => {
                  return (
                    <div>
                      {!row.getValue("arriveDate") && "Pending"}
                      {row.getValue("arriveDate") &&
                        format(String(row.getValue("arriveDate")), "PPP")}
                    </div>
                  );
                },
              },
              {
                accessorKey: "nation",
                header: () => <div className="font-semibold">Nation</div>,
                cell: ({ row }) => {
                  return (
                    <div>
                      {row.getValue("nation")
                        ? row.getValue("nation")
                        : "Pending"}
                    </div>
                  );
                },
              },
              {
                accessorKey: "uniforms",
                header: () => (
                  <div className="font-semibold">Number Uniforms</div>
                ),
                cell: ({ row }) => {
                  return (
                    <div>
                      {row.getValue("uniforms")
                        ? row.getValue("uniforms")?.length
                        : "Pending"}
                    </div>
                  );
                },
              },
            ]}
            data={[]}
          />
        </div>
      </div>
    </main>
  );
}
