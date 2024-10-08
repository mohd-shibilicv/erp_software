import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const vehicleColumn = [
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
  {
    accessorKey: "status",
    header: () => <div className="font-semibold">Update status</div>,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      //   const dispatch = useDispatch();
      return (
        <div>
          <Select
            onValueChange={(value) => {
              console.log(value);

              //   axios
              //     .patch("/vehicle/vehicle", {
              //       id: row.original?._id,
              //       status: value,
              //     })
              //     .then(() => {
              //       dispatch(
              //         updateVehicleStatus({
              //           status: value,
              //           id: row.original?._id,
              //         })
              //       );
              //       toast.success("Vehicle status updated");
              //     })
              //     .catch((er) => {
              //       toast.error(er.message);
              //     });
            }}
          >
            <SelectTrigger className="w-[100px] h-8 px-2 border-gray-300">
              <SelectValue placeholder={row.getValue("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cancel">Cancel</SelectItem>
              <SelectItem value="Active">Activate</SelectItem>
            </SelectContent>
          </Select>
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
      navigate;
      row;
      return (
        // update-employee/:id
        <div className="flex">
          <button
            // onClick={() => navigate(`/company/vehicle/${row.original?._id}`)}
            className="size-8 border rounded-md flex justify-center items-center bg-gray-900 text-white"
          >
            <Edit className="w-4" />
          </button>
        </div>
      );
    },
  },
];
