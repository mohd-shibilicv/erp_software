import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const idExpiryReportColumn = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold">Name</div>,
  },
  // {
  //   accessorKey: "email",
  //   header: () => <div className="font-semibold">Email</div>,
  // },
  {
    accessorKey: "idNo",
    header: () => <div className="font-semibold">Id/Visa No</div>,
  },
  {
    accessorKey: "visExpiry",
    header: () => <div className="font-semibold">ID expired at</div>,
    cell: ({ row }) => {
      return (
        <div className="font-semibold text-red-500">
          {row.getValue("visExpiry") &&
            format(String(row.getValue("visExpiry")), "PPP")}
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
