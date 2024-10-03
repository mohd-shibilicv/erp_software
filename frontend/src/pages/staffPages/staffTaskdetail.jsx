import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useGetTaskDetail } from "@/hooks/useGetTaskDetail";

import { cn } from "@/lib/utils";

import { format } from "date-fns";

import { CalendarClock, PackageCheck, Paperclip } from "lucide-react";
import { useEffect } from "react";

import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";

export default function StaffTaskDetail() {
  const { id } = useParams();
  const { data,isError } = useGetTaskDetail(id);
  const navigate = useNavigate();
  useEffect(()=>{
    if(isError){
      return toast.error("Something went wrong")
    }
  },[isError])
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
          </div>
        ))}
      </div>
    </main>
  );
}
