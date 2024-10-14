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
    accessorKey: "vehicle_name",
    header: () => <div className="font-semibold">Vehicle name</div>,
  },
  {
    accessorKey: "vehicle_no",
    header: () => <div className="font-semibold">Vehicle number</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("vehicle_no") && "Pending"}
        {row.getValue("vehicle_no")}
      </div>
    ),
  },
  {
    accessorKey: "owner_id",
    header: () => <div className="font-semibold">Owner Id.</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("owner_id") && "Pending"}
        {row.getValue("owner_id")}
      </div>
    ),
  },

  {
    accessorKey: "vehicle_model",
    header: () => <div className="font-semibold">Vehicle Model</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("vehicle_model") && "Pending"}
        {row.getValue("vehicle_model")}
      </div>
    ),
  },
  {
    accessorKey: "expiry_date",
    header: () => <div className="font-semibold">Vehicle expiry</div>,
    cell: ({ row }) => {
      return (
        <div
          className={
            //   row.getValue("expiry_date")
            //     ? checkExpiryStatus(String(row.getValue("expiry_date")))
            //     : ""
            ""
          }
        >
          {!row.getValue("expiry_date") && "Pending"}
          {row.getValue("expiry_date") &&
            format(String(row.getValue("expiry_date")), "PPP")}
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
