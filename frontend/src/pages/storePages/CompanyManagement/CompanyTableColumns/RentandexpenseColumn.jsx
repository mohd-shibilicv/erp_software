/* eslint-disable react-hooks/rules-of-hooks */
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { LoaderCircle, Trash } from "lucide-react";
import { useState } from "react";

export const rentAndExpenseColumn = [
  {
    accessorKey: "image",
    header: () => <div className="font-semibold">Rent Doc</div>,
    cell: ({ row }) => {
      return (
        <div>
          {!row.getValue("image") ? (
            "Nill"
          ) : (
            <>
              <img
                src={row.getValue("image")}
                className="size-10 object-cover"
                alt=""
              />
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "rent",
    header: () => <div className="font-semibold">Rent</div>,
    cell: ({ row }) => (
      <div className="line-clamp-1">
        {!row.getValue("rent") ? "Nill" : <>{row.getValue("rent")}</>}
      </div>
    ),
  },
  {
    accessorKey: "rentExpense",
    header: () => <div className="font-semibold">Rent Amount</div>,
    cell: ({ row }) => (
      <div className="line-clamp-1">
        {!row.getValue("rentExpense") ? (
          "Nill"
        ) : (
          <>{row.getValue("rentExpense")}</>
        )}
      </div>
    ),
  },
  {
    accessorKey: "remarks",
    header: () => <div className="font-semibold">Rent Remark</div>,
    cell: ({ row }) => (
      <div className="line-clamp-1">
        {!row.getValue("remarks") ? "Nill" : <>{row.getValue("remarks")}</>}
      </div>
    ),
  },
  {
    accessorKey: "startingDate",
    header: () => <div className="font-semibold">Rent start</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("startingDate") ? (
          "Nill"
        ) : (
          <>{format(String(row.getValue("startingDate")), "PPP")}</>
        )}
      </div>
    ),
  },
  {
    accessorKey: "endingDate",
    header: () => <div className="font-semibold">Rent end date</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("endingDate") ? (
          "Nill"
        ) : (
          <>{format(String(row.getValue("endingDate")), "PPP")}</>
        )}
      </div>
    ),
  },
  {
    accessorKey: "_id",
    header: () => <div className="font-semibold">Actions</div>,

    cell: function ({ row }) {
      row;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [deleteLoading, setDeletLoading] = useState(false);
      const queryClient = useQueryClient();
      queryClient;
      setDeletLoading;
      const deleteHandle = () => {
        //   try {
        //     setDeletLoading(true);
        //     axios
        //       .delete(`/rentandexpense/rentandexpense?id=${row.original?._id}`)
        //       .then(() => {
        //         toast.success("Deleted");
        //         setDeletLoading(false);
        //         queryClient.invalidateQueries(["rentandexpense"]);
        //       });
        //   } catch (error) {
        //     toast.error(error.message)
        //     setDeletLoading(false);
        //   }
      };
      return (
        // update-employee/:id
        <div className="flex">
          {deleteLoading ? (
            <>
              <LoaderCircle className="w-5 animate-spin" />
            </>
          ) : (
            <>
              <button
                onClick={deleteHandle}
                className="size-8 border rounded-md flex justify-center items-center bg-gray-900 text-white"
              >
                <Trash className="w-4" />
              </button>
            </>
          )}
        </div>
      );
    },
  },
];
