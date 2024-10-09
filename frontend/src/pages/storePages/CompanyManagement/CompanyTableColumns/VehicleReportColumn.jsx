import { format } from "date-fns";

export const vehicleReportColumn = [
  {
    accessorKey: "vehicleName",
    header: () => <div className="font-semibold">Vehicle name</div>,
  },
  {
    accessorKey: "vehicleNo",
    header: () => <div className="font-semibold">Vehicle number</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("vehicleNo") && "Pending"}
        {row.getValue("vehicleNo")}
      </div>
    ),
  },
  {
    accessorKey: "ownerId",
    header: () => <div className="font-semibold">Owner Id.</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("ownerId") && "Pending"}
        {row.getValue("ownerId")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="font-semibold">Vehicle status</div>,
    cell: ({ row }) => (
      <div>
        <div
          className={`h-7 text-sm w-20 rounded-xl ${
            row.getValue("status") == "Active"
              ? "bg-green-500"
              : "bg-yellow-500"
          }  text-white font-semibold px-2 border flex-center`}
        >
          {row.getValue("status")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "shopName",
    header: () => <div className="font-semibold">Shope name</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("shopName") && "Pending"}
        {row.getValue("shopName")}
      </div>
    ),
  },
  {
    accessorKey: "expiryDate",
    header: () => <div className="font-semibold">Vehicle expiry</div>,
    cell: ({ row }) => {
      return (
        <div
          className={
            //   row.getValue("expiryDate")
            //     ? checkExpiryStatus(String(row.getValue("expiryDate")))
            //     : ""
            ""
          }
        >
          {!row.getValue("expiryDate") && "Pending"}
          {row.getValue("expiryDate") &&
            format(String(row.getValue("expiryDate")), "PPP")}
        </div>
      );
    },
  },
];
