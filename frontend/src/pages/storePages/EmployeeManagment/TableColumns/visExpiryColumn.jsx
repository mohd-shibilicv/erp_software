import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const vpExpiryReportColumn = [
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
    accessorKey: "vpNo",
    header: () => <div className="font-semibold">Vp Number</div>,
  },
  {
    accessorKey: "vpExpiry",
    header: () => <div className="font-semibold">VP expired at</div>,
    cell: ({ row }) => {
      return (
        <div className="font-semibold text-red-500">
          {row.getValue("vpExpiry") &&
            format(String(row.getValue("vpExpiry")), "PPP")}
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
