
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const reportColumn = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold">Name</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="font-semibold">Email</div>,
  },
  {
    accessorKey: "designation",
    header: () => <div className="font-semibold">Designation</div>,
  },
  {
    accessorKey: "workBranch",
    header: () => <div className="font-semibold">Branch</div>,
  },
  {
    accessorKey: "joiningDate",
    header: () => <div className="font-semibold">Joined Date</div>,
    cell: ({ row }) => {
      return (
        <div>
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
      return <div>{row.getValue("nation")}</div>;
    },
  },
];
