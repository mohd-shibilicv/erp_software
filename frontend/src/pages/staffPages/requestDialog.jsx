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
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

export default function StaffRequestDialog({ data }) {
  data;
  // {
  //   staff_id: data?.id,
  //   staff_name: data?.staff_name,
  //   project_name: data?.project_name,
  //   staff_email: data?.staff_email,
  //   prev_deadline: task?.deadline,
  // }
  const [loading, setLoading] = useState(false);
  setLoading;
  const handleDeadlineRequest = () => {};
  return (
    <Dialog>
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
                type="datetime-local"
                className="bg-slate-100 text-black"
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="" className="text-sm text-black">
                Enter description
              </label>
              <Textarea
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
