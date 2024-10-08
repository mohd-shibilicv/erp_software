import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const passportReportColumn = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold">Name</div>,
  },
  // {
  //   accessorKey: "email",
  //   header: () => <div className="font-semibold">Email</div>,
  //   cell: ({ row }) => (
  //     <div>
  //       {!row.getValue("email") && "Pending"}
  //       {row.getValue("email")}
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "designation",
  //   header: () => <div className="font-semibold">Designation</div>,
  //   cell: ({ row }) => (
  //     <div>
  //       {!row.getValue("designation") && "Pending"}
  //       {row.getValue("designation")}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "ppNo",
    header: () => <div className="font-semibold">Passport No.</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("workBranch") && "Pending"}
        {row.getValue("workBranch")}
      </div>
    ),
  },
  {
    accessorKey: "ppExpiry",
    header: () => <div className="font-semibold">Passport Expiry</div>,
    cell: ({ row }) => {
      return (
        <div>
          {!row.getValue("ppExpiry") && "Pending"}
          {row.getValue("ppExpiry") &&
            format(String(row.getValue("ppExpiry")), "PPP")}
        </div>
      );
    },
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
    accessorKey: "nation",
    header: () => <div className="font-semibold">Nation</div>,
    cell: ({ row }) => {
      return (
        <div>{row.getValue("nation") ? row.getValue("nation") : "Pending"}</div>
      );
    },
  },
];
