import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useGetTaskDetail } from "@/hooks/useGetTaskDetail";
import { formatDateForTaskSection } from "@/lib/formatTaskDate";
import { cn } from "@/lib/utils";
import { adminTaskManage } from "@/services/tasklist";
import { useQueryClient } from "@tanstack/react-query";

import { format } from "date-fns";

import {
  CalendarClock,
  PackageCheck,
  Paperclip,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";

export default function AdminTaskDetails() {
  const { id } = useParams();
  const { data } = useGetTaskDetail(id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dateTimeInputRefs = useRef([]);
  const handleDeleteTask = async (taskId) => {
    // ["taskDetail", id]
    await adminTaskManage.delete(taskId);
    queryClient.invalidateQueries(["taskDetail", id]);
  };
  return (
    <main className="w-full h-full bg-white rounded-xl border shadow-sm p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-5">
        <div className="flex flex-col gap-1">
          <div className="w-full h-10  flex items-center">
            <span className="font-  font-semibold text-lg">
              {data?.staff_assignment?.staff_name}
            </span>
          </div>
        </div>
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
          <Button
            className="flex gap-2 items-center h-8 text-sm px-2"
            onClick={() =>
              navigate(
                `/admin/tasks/new?project_name=${data?.staff_assignment?.project_name}&id=${data?.staff_assignment?.id}&staff=${data?.staff_assignment?.staff_name}`
              )
            }
          >
            <PlusCircle className="w-4" /> Assign Task
          </Button>
        </div>

        {data?.tasks?.map((task, I) => (
          <div
            key={task?.id + I}
            className="mt-4 w-full flex flex-col border p-3 rounded-md bg-gray-100 shadow-sm gap-2"
          >
            <div className="w-full flex justify-between ">
              <h1 className="text-[17px] font- line-clamp-1">{task?.title}</h1>
              <div className="flex gap-2 items-center">
                <div
                  className={cn(
                    "px-3 flex items-center h-7 rounded-2xl border text-[13px] capitalize ",
                    {
                      "bg-yellow-400 text-white": task?.status == "pending",
                      "bg-green-500 text-white": false,
                    }
                  )}
                >
                  {task?.status}
                </div>
                <button
                  onClick={() => handleDeleteTask(task?.id)}
                  className="size-7 rounded-md flex justify-center items-center bg-red-500 text-white"
                >
                  <Trash2 className="w-4" />
                </button>
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
                <input
                  //   key={task?.id}
                  type="datetime-local"
                  className="hidden absolute top-3"
                  id={`${task?.id}${task?.title}${I}`}
                  name={`${task?.id}${task?.title}${I}`}
                  value={
                    task?.deadline &&
                    new Date(task?.deadline)?.toISOString().slice(0, 16)
                  }
                  ref={(el) => (dateTimeInputRefs.current[I] = el)}
                  onChange={async (e) => {
                    try {
                      await adminTaskManage.update(task?.id, {
                        project_staff: data?.staff_assignment?.id,
                        deadline: formatDateForTaskSection(
                          new Date(e.target.value)
                        ),
                      });
                      queryClient.invalidateQueries(["taskDetail", id]);
                      toast.success("Date and time updated");
                      dateTimeInputRefs.current[I]?.blur()
                    } catch (error) {
                      return toast.error(error.message);
                    }
                  }} // Optional: Log the value
                />
                <label
                  onClick={() => dateTimeInputRefs.current[I]?.showPicker()}
                  className="h-7 px-2 text-sm bg-blue-500 text-white rounded-md items-center flex gap-1 cursor-pointer"
                >
                  <CalendarClock className="w-4" />
                  Update time
                </label>
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
          </div>
        ))}
      </div>
    </main>
  );
}
