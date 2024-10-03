import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { adminTaskManage } from "@/services/tasklist";

import { CalendarClock, PackageCheck, Paperclip } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AdminTaskDetails() {
  const { id } = useParams();
  useEffect(()=>{
    adminTaskManage.get(id).then(({data})=>{
        console.log(data);
        
    })
  },[id])
  console.log("🚀 ~ AdminTaskDetails ~ id :", id )

  
  return (
    <main className="w-full h-full bg-white rounded-xl border shadow-sm p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-5">
        <div className="flex flex-col gap-1">
          <div className="w-full h-10  flex items-center">
            <span className="font-  font-semibold text-lg">Mohamed Aflah</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <div className="w-full h-10  flex items-center gap-2">
              <PackageCheck className="w-5" />
              <span className="font-  font-semibold text-lg">Ecommerce</span>
            </div>
          </div>
        </div>
      </div>
      <div className="custom-scrollbar mt-5 w-full border rounded-md p-5 bg-slate-100/50 shadow-sm max-h-[500px] pt-0 overflow-y-auto">
        <div className="w-full border-b pb-3  top-0 left-0 pt-5 z-30 ">
          <h1 className="font- text-[19px]">Tasks</h1>
        </div>

        <div className="mt-4 w-full flex flex-col border p-3 rounded-md bg-gray-100 shadow-sm gap-2">
          <div className="w-full flex justify-between ">
            <h1 className="text-[17px] font- line-clamp-1">Home page Design</h1>
            <div
              className={cn(
                "px-3 flex items-center h-7 rounded-2xl border text-[13px] ",
                {
                  "bg-yellow-400 text-white": false,
                  "bg-green-500 text-white": true,
                }
              )}
            >
              Completed
            </div>
          </div>
          <div className="break-words ">
            <p className="text-sm">
              aslkdfjalskdfj aslkdjf laskdj falksdfj alskdfj Lorem ipsum, dolor
              sit amet consectetur adipisicing elit. Unde voluptate assumenda
              inventore modi fugit sequi quod dolores suscipit, ratione
              quisquam. Lorem ipsum, dolor sit amet consectetur adipisicing
              elit. Sed voluptates odio neque aspernatur aliquid rem deleniti
              reprehenderit voluptas eligendi, repudiandae animi? Totam adipisci
              consequatur obcaecati veniam optio, unde voluptate repellat
              explicabo rem sed dignissimos voluptas officia aspernatur? Vero
              nulla ea exercitationem, blanditiis ut aspernatur dolorum.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 px-4 flex items-center border rounded-md bg-gray-200 gap-2">
              <CalendarClock className="w-5" />
              23/43/490
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="h-10 gap-2  px-4 flex items-center  relative rounded-md bg-gray-200 border pl-9">
                  <span className="">Attached Document</span>
                  <Paperclip className="w-4 absolute left-3" />
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </main>
  );
}
