import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetTaskDetail } from "@/hooks/useGetTaskDetail";

import { cn } from "@/lib/utils";

import { format } from "date-fns";

import { CalendarClock, Loader2, PackageCheck, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";
import StaffRequestDialog from "./requestDialog";
import { adminTaskManage } from "@/services/tasklist";
import { useQueryClient } from "@tanstack/react-query";

export default function StaffTaskDetail() {
  const { id } = useParams();
  const { data, isError } = useGetTaskDetail(id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      return toast.error("Something went wrong");
    }
  }, [isError]);
  const [selectLoading, setSelectLoading] = useState(false);
  setSelectLoading;
  navigate;
  return (
    <main className="w-full h-full bg-white rounded-xl border shadow-sm p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <div className="w-full h-10  flex items-center gap-2">
              <PackageCheck className="w-5" />
              <span className="font-  font-semibold text-lg">
                {data?.staff_assignment?.project_name}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="custom-scrollbar mt-5 w-full border rounded-md p-5 bg-slate-100/50 shadow-sm  pt-0 overflow-y-auto">
        <div className="w-full border-b pb-3  top-0 left-0 pt-5 z-30 flex justify-between ">
          <h1 className="font- text-[19px]">Tasks</h1>
        </div>

        {data?.tasks?.map((task, I) => (
          <div
            key={task?.id + I}
            className="mt-4 w-full flex flex-col border p-3 rounded-md bg-gray-100 shadow-sm gap-2"
          >
            <div className="w-full flex justify-between ">
              <h1 className="text-[17px] font- line-clamp-1">{task?.title}</h1>
              <div className="flex gap-2 items-center">
                <Select
                  onValueChange={async (value) => {
                    try {
                      setSelectLoading(true);
                      await adminTaskManage.update(task?.id, {
                        status: value,
                        project_staff: task.project_staff,
                        deadline: task?.deadline,
                      });
                      queryClient.invalidateQueries(["taskDetail", id]);
                      setSelectLoading(false);
                      return toast.success("Status updated");
                    } catch (error) {
                      setSelectLoading(false);
                      return toast.error(error.message);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`w-[140px] rounded-xl ${
                      selectLoading ? "pointer-events-none" : ""
                    }`}
                  >
                    {/* pending, in progress, completed, on hold */}
                    <SelectValue
                      placeholder={
                        selectLoading ? (
                          <div className="flex gap-2 items-center">
                            <span>Loading...</span>{" "}
                            <Loader2 className="w-5 animate-spin" />
                          </div>
                        ) : (
                          <>
                            <div
                              className={cn(
                                "capitalize h-6 px-3 rounded-lg bg-yellow-400 flex items-center text-white",
                                {
                                  "bg-yellow-500": task.status == "pending",
                                  "bg-green-500": task.status == "completed",
                                  // "bg-orange-500": task.status == "on_hold",
                                  "bg-lime-500": task.status == "in progress",
                                }
                              )}
                            >
                              {task?.status}
                            </div>
                          </>
                        )
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in progress">In progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    {/* <SelectItem value="on_hold">On hold</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="break-words ">
              <p className="text-sm">{task?.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-h-10 max-h-20 px-4 flex items-center border rounded-md bg-gray-200 gap-2 flex-wrap justify-between">
                <div className="flex gap-2">
                  <CalendarClock className="w-5" />
                  {format(new Date(task?.deadline), "dd-MM-yyyy hh:mm a")}
                </div>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="h-10 gap-2  px-4 flex items-center  relative rounded-md bg-gray-200 border pl-9">
                    <span className="">Attached Document</span>
                    <Paperclip className="w-4 absolute left-3" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <embed
                      className="max-h-[500px]"
                      src={task?.attachment_url}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="flex justify-end mt-1">
              {/* staff_id,staff_name,project_name,staff_email,prev_deadline,project_reference_id */}
              <StaffRequestDialog
                data={{
                  staff_id: data?.staff_assignment.id,
                  staff_name: data?.staff_assignment.staff_name,
                  project_name: data?.staff_assignment.project_name,
                  staff_email: data?.staff_assignment.staff_email,
                  prev_deadline: task?.deadline,
                  project_reference_id: new URLSearchParams(
                    window.location.search
                  ).get("project_reference_id"),
                }}
              />
            </div>
            {task?.subtasks && task?.subtasks?.length > 0 && (
              <>
                <div className="w-full border rounded-md p-2 shadow-sm bg-slate-50">
                  <h1 className="font-semibold">Sub Tasks</h1>
                  <div className="mt-3 w-full">
                    {task?.subtasks?.map((subTsk, Id) => (
                      <div
                        key={Id}
                        className="w-full border rounded-lg p-2 flex flex-col gap-2 break-words"
                      >
                        <h2>{subTsk?.title}</h2>
                        <p className="text-sm break-words">
                          {subTsk?.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
