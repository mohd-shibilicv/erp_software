import { useNavigate } from "react-router-dom";
import { EmployeeCompanyCommonTable } from "./EmployeeComponents/EmployeListTable";
import { Edit2 } from "lucide-react";
import { format } from "date-fns";

export default function EmployeeList() {
  const employeeColumn = [
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
            {row.getValue("nation") ? row.getValue("nation") : "Pending"}
          </div>
        );
      },
    },
    {
      accessorKey: "_id",
      header: () => <div className="font-semibold">Actions</div>,

      cell: function ({ row }) {
        row;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const navigate = useNavigate();
        return (
          // update-employee/:id
          <div className="flex">
            <button
              onClick={() => navigate(``)}
              className="size-8 border rounded-md flex justify-center items-center bg-gray-900 text-white"
            >
              <Edit2 className="w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <main className="w-full h-full bg-white rounded-md p-2">
      <EmployeeCompanyCommonTable
        columns={employeeColumn}
        data={[]}
        from="employee"
      />
    </main>
  );
}
