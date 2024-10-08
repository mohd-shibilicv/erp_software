import { format } from "date-fns";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const companyColumn = [
  {
    accessorKey: "companyName",
    header: () => <div className="font-semibold">Company name</div>,
  },
  {
    accessorKey: "crNo",
    header: () => <div className="font-semibold">Company crNo</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("crNo") && "Pending"}
        {row.getValue("crNo")}
      </div>
    ),
  },
  {
    accessorKey: "crExpiry",
    header: () => <div className="font-semibold">Company cr expiry</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("crExpiry") && "Pending"}
        {row.getValue("crExpiry") &&
          format(String(row.getValue("crExpiry")), "PPP")}
      </div>
    ),
  },
  {
    accessorKey: "RuksaNo",
    header: () => <div className="font-semibold">Ruksa No.</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("RuksaNo") && "Pending"}
        {row.getValue("RuksaNo")}
      </div>
    ),
  },
  {
    accessorKey: "RuksaExpiry",
    header: () => <div className="font-semibold">Ruksa expiry</div>,
    cell: ({ row }) => {
      return (
        <div>
          {!row.getValue("RuksaExpiry") && "Pending"}
          {row.getValue("RuksaExpiry") &&
            format(String(row.getValue("RuksaExpiry")), "PPP")}
        </div>
      );
    },
  },
  {
    accessorKey: "computerCard",
    header: () => <div className="font-semibold">Computer Card</div>,
    cell: ({ row }) => {
      return (
        <div>
          {!row.getValue("computerCard") && "Pending"}
          {row.getValue("computerCard")}
        </div>
      );
    },
  },
  {
    accessorKey: "cardexpireDate",
    header: () => <div className="font-semibold">Computer card expiry</div>,
    cell: ({ row }) => {
      return (
        <div>
          {!row.getValue("cardexpireDate") && "Pending"}
          {row.getValue("cardexpireDate") &&
            format(String(row.getValue("cardexpireDate")), "PPP")}
        </div>
      );
    },
  },
  {
    accessorKey: "_id",
    header: () => <div className="font-semibold">Actions</div>,

    cell: function ({ row }) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const navigate = useNavigate();
      row;
      navigate;
      return (
        // update-employee/:id
        <div className="flex">
          <button
            // onClick={() => navigate(`/company/company/${row.original?._id}`)}
            className="size-8 border rounded-md flex justify-center items-center bg-gray-900 text-white"
          >
            <Edit className="w-4" />
          </button>
        </div>
      );
    },
  },
];
