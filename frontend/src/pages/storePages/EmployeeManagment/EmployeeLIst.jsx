import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeCompanyCommonTable } from "./Components/EmployeListTable";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/services/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees/");
      setEmployees(response.data.results);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employees/${id}/`);
        fetchEmployees(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

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
        return (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/update-employee/${row.original._id}`)}
              className="size-8 border rounded-md flex justify-center items-center bg-gray-900 text-white"
            >
              <Edit2 className="w-4" />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="size-8 border rounded-md flex justify-center items-center bg-red-600 text-white"
            >
              <Trash2 className="w-4" />
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
        data={employees}
        from="employee"
      />
    </main>
  );
}
