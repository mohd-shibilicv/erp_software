import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const ppExpiryReportColumn = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold">Name</div>,
  },
  // {
  //   accessorKey: "email",
  //   header: () => <div className="font-semibold">Email</div>,
  // },
  // {
  //   accessorKey: "designation",
  //   header: () => <div className="font-semibold">Designation</div>,
  // },
  {
    accessorKey: "ppNo",
    header: () => <div className="font-semibold">Passport Number</div>,
  },
  {
    accessorKey: "ppExpiry",
    header: () => <div className="font-semibold">Passport expired at</div>,
    cell: ({ row }) => {
      return (
        <div className="font-semibold text-red-500">
          {row.getValue("ppExpiry") &&
            format(String(row.getValue("ppExpiry")), "PPP")}
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
