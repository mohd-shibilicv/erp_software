import { format } from "date-fns";
import { EmployeeCompanyCommonTable } from "./Components/EmployeListTable";

export default function LeaveAndVacation() {
  const leaveColumns = [
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
      accessorKey: "leaveVecationlist",
      header: () => <div className="font-semibold">Leave Vacation Date</div>,
      cell: ({ row }) => {
        return (
          <div>{row.original.from && format(row.original.from, "PPP")}</div>
        );
      },
    },
    {
      accessorKey: "leaveDays",
      header: () => <div className="font-semibold">Leave days</div>,
      cell: ({ row }) => {
        row;
        return (
          <div>
            {/* {row.original.from &&
              row.original.to &&
              calculateDay(row.original.from, row.original.to)}{" "} */}
            4 Days
          </div>
        );
      },
    },
    {
      accessorKey: "_id",
      header: () => <div className="font-semibold">Actions</div>,
      cell: ({ row }) => (
        <div className="flex">{/* <LeaveEdit id={row.original._id} /> */}</div>
      ),
    },
  ];
  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <EmployeeCompanyCommonTable
        columns={leaveColumns}
        data={[]}
        from="leave"
      />
    </main>
  );
}
