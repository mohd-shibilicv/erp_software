/* eslint-disable react-hooks/rules-of-hooks */
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { LoaderCircle, Trash } from "lucide-react";
import { useState } from "react";

export const fireandCertificationColumn = [
  {
    accessorKey: "fireCertificationImage",
    header: () => <div className="font-semibold">Fire certification Image</div>,
    cell: ({ row }) => {
      return (
        <div>
          {!row.getValue("fireCertificationImage") ? (
            "Nill"
          ) : (
            <>
              <img
                src={row.getValue("fireCertificationImage")}
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
    accessorKey: "remarks",
    header: () => (
      <div className="font-semibold">Fire certification remark</div>
    ),
    cell: ({ row }) => (
      <div className="line-clamp-1">
        {!row.getValue("remarks") ? "Nill" : <>{row.getValue("remarks")}</>}
      </div>
    ),
  },
  {
    accessorKey: "amcContractStart",
    header: () => <div className="font-semibold">Amc contract start</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("amcContractStart") ? (
          "Nill"
        ) : (
          <>{format(String(row.getValue("amcContractStart")), "PPP")}</>
        )}
      </div>
    ),
  },
  {
    accessorKey: "amcContractEnd",
    header: () => <div className="font-semibold">Amc contract end</div>,
    cell: ({ row }) => (
      <div>
        {!row.getValue("amcContractEnd") ? (
          "Nill"
        ) : (
          <>{format(String(row.getValue("amcContractEnd")), "PPP")}</>
        )}
      </div>
    ),
  },
  {
    accessorKey: "amcRemarks",
    header: () => <div className="font-semibold">Amc Remarks</div>,
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1">
          {!row.getValue("amcRemarks") && "Nill"}
          {row.getValue("amcRemarks") && row.getValue("amcRemarks")}
        </div>
      );
    },
  },
  {
    accessorKey: "_id",
    header: () => <div className="font-semibold">Actions</div>,

    cell: function ({ row }) {
      row;
      const queryClient = useQueryClient();
      queryClient;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [deleteLoading, setDeletLoading] = useState(false);
      const deleteHandle = () => {
        setDeletLoading(true);
        // axios
        //   .delete(
        //     `/firecertification/firecertification?id=${row.original?._id}`
        //   )
        //   .then(() => {
        //     setDeletLoading(false);
        //     toast.success("Deleted");
        //     queryClient.invalidateQueries(["fireandcertification"]);
        //   })
        //   .catch((er) => {
        //     toast.error(er.message);
        //     setDeletLoading(false);
        //   });
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
