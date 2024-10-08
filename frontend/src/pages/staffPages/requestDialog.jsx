/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { staffTaskList } from "@/services/tasklist";

import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StaffRequestDialog({ data }) {
  // console.log("🚀 ~ StaffRequestDialog ~ data:", data);

  // {
  //   staff_id: data?.id,
  //   staff_name: data?.staff_name,
  //   project_name: data?.project_name,
  //   staff_email: data?.staff_email,
  //   prev_deadline: task?.deadline,
  // }

  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(null);
  const handleDeadlineRequest = async () => {
    try {
      if (!deadline) {
        return toast.error("Please Select updated deadline");
      }
      if (!description) {
        return toast.error("Please enter description");
      }
      setLoading(true);

      await staffTaskList.requestDeadline({
        staff_id: data?.staff_id,
        staff_name: data?.staff_name,
        project_name: data?.project_name,
        staff_email: data?.staff_email,
        prev_deadline: String(data?.prev_deadline),
        deadline: String(deadline),
        project_reference_id: data?.project_reference_id,
        description: description,
      });

      toast.success("Deadline Request sended");
      setLoading(false);
      setDeadline(undefined);
      setDescription("");
      setDialogOpen(false);
    } catch (error) {
      setLoading(false);
      return toast.error(error.message);
    }
  };
  const [openDialog, setDialogOpen] = useState(false);
  return (
    <Dialog onOpenChange={setDialogOpen} open={openDialog}>
      <DialogTrigger>
        {" "}
        <button className="h-8 px-3 bg-blue-500 rounded-md text-white text-sm">
          Request Deadline change
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request deadline change </DialogTitle>
          <DialogDescription className="w-full py-2 space-y-4">
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="" className="text-sm text-black">
                Choose updated deadline
              </label>
              <Input
                value={deadline && deadline?.toISOString().slice(0, 16)}
                onChange={(e) => setDeadline(new Date(e.target.value))}
                type="datetime-local"
                className="bg-slate-100 text-black"
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="" className="text-sm text-black">
                Enter description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none bg-slate-100 text-black"
                placeholder="Enter remark or description"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleDeadlineRequest}
                className={`h-8 text-sm px-3 flex gap-2 ${
                  loading ? "pointer-events-none bg-purple-800 px-4" : ""
                }`}
              >
                <span>Submit</span>
                {loading && (
                  <>
                    <LoaderCircleIcon className="w-4 animate-spin" />
                  </>
                )}
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
