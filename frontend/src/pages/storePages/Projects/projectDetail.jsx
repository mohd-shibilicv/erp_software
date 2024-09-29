import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { clientAgreement } from "@/services/crmServiceApi";
import { projectApi } from "@/services/project";
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const [selectLoading, setSelectLoading] = useState(false);

  const { id } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    projectApi.get(id).then(({ data }) => {});
  }, [id]);
  selectLoading;
  //   const fetchClientDetails = async () => {
  //     try {
  //       setSelectLoading(true);
  //       const { data } = await clientAgreement.getAll();
  //       setClient(data.results);
  //       setSelectLoading(false);
  //     } catch {
  //       setSelectLoading(false);
  //     }
  //   };
  //   useEffect(() => {
  //     fetchClientDetails();
  //   }, []);
  //   const { toast } = useToast();
  const [tabs, setTab] = useState("Project detail");
  return (
    <main className="w-full h-full bg-white rounded-xl border shadow-sm p-5">
      <div className="w-full">
        <div className="flex items-center gap-2 flex-wrap ">
          <span
            onClick={() => setTab("Project detail")}
            className={cn("cursor-pointer", {
              "text-[#6f42c1]": tabs == "Project detail",
            })}
          >
            Project detail
          </span>
          <ChevronRight className="w-4 mt-1" />
          <span
            onClick={() => setTab("Client Details")}
            className={cn("cursor-pointer", {
              "text-[#6f42c1]": tabs == "Client Details",
            })}
          >
            Client Details
          </span>
          <ChevronRight className="w-4 mt-1" />
          <span
            onClick={() => setTab("Client requirements")}
            className={cn("cursor-pointer", {
              "text-[#6f42c1]": tabs == "Client requirements",
            })}
          >
            Project requirements
          </span>
          <ChevronRight className="w-4 mt-1" />
          <span
            onClick={() => setTab("Dealings and agreements")}
            className={cn("cursor-pointer", {
              "text-[#6f42c1]": tabs == "Dealings and agreements",
            })}
          >
            Dealings and agreements
          </span>
        </div>
      </div>
      {tabs == "Project detail" ? (
        <>
          <>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm font-semibold">
                  Project name
                </label>
                <Input
                  className="pointer-events-none"
                  // onChange={(e) => setProjectname(e.target.value)}
                  placeholder="Enter Project name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm font-semibold">
                  Project id
                </label>
                <Input
                  // value={projectId}

                  placeholder="Enter Project name"
                  className="pointer-events-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm font-semibold">
                  Project Status
                </label>
                <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                  Completed
                </div>
              </div>
            </div>
            <div className="mt-5 w-full">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm font-semibold">
                  Project Description
                </label>
                <Textarea
                  className="w-full pointer-events-none"
                  placeholder="enter project description "
                />
              </div>
            </div>
            <div className="mt-5 w-full grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm font-semibold">
                  Client
                </label>
                <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                  Client1
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-sm font-semibold">
                  Select Priority
                </label>
                <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                  Medium
                </div>
              </div>
            </div>
          </>
        </>
      ) : tabs == "Client Details" ? (
        <section className="mt-5">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Client id
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                2
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Client name
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                tester
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Mobile Number
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                2390340
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Whatsapp Number
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                2390340
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Email address
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                2390340
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Country and City
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                India, Delhi
              </div>
            </div>
          </div>
        </section>
      ) : tabs == "Client requirements" ? (
        <section className="w-full mt-5">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                File Number
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                23490
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Color Theme
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                Dark
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-5 grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Layout
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                Sidebar
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                additional requirements
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                Sample
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Status
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                Confirmed
              </div>
            </div>
          </div>
          <div className="w-full mt-5 flex flex-col p-2 border rounded-md">
            <label htmlFor="" className="text-sm font-semibold">
              Predefined Features
            </label>
            <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-2">
              <div className="h-8 px-2 rounded-lg bg-gray-200 flex justify-center items-center text-sm">
                Dashboard
              </div>
              <div className="h-8 px-2 rounded-lg bg-gray-200 flex justify-center items-center text-sm">
                Reports
              </div>
            </div>
          </div>
          <div className="w-full mt-5 flex flex-col p-2 border rounded-md">
            <label htmlFor="" className="text-sm font-semibold">
              Custome Features
            </label>
            <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-2">
              <div className="h-8 px-2 rounded-lg bg-gray-200 flex justify-center items-center text-sm">
                Dashboard
              </div>
              <div className="h-8 px-2 rounded-lg bg-gray-200 flex justify-center items-center text-sm">
                Reports
              </div>
            </div>
          </div>
          <div className="w-full mt-5 flex flex-col p-2 border rounded-md">
            <label htmlFor="" className="text-sm font-semibold">
              Images
            </label>
            <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-2">
              <div className="h-48 w-48 border rounded-md overflow-hidden cursor-pointer">
                <img
                  src={
                    "https://img.freepik.com/free-vector/user-panel-business-dashboard_23-2148358960.jpg?t=st=1727530081~exp=1727533681~hmac=b1ee56a1b2333842cdc82c4007681d1018b2961538f112c1e36afae7f309073d&w=1060"
                  }
                  className="w-full h-full object-contain"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Agreement Id
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                23
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Quotation Id
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                21
              </div>
            </div>
          </div>
          <div className="w-full mt-5 flex flex-col p-3 border rounded-md">
            <div className="w-full">
              <h1>Payment Terms</h1>
            </div>
            <div className="w-full mt-2 flex gap-2 border p-2 rounded-md ">
              <div className="size-10 text-sm flex justify-center items-center bg-gray-200 rounded-md">
                1
              </div>
              <div className="h-10 text-sm px-2 flex justify-center items-center bg-gray-200 rounded-md gap-2">
                <Calendar className="w-4" />
                2024-09-26
              </div>
              <div className="h-10 text-sm px-2 flex justify-center items-center bg-gray-200 rounded-md">
                40 QAR
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Quotation Number
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                1223
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Client Name
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                newrelation software
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Company Name
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                abd solutions
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Company Address
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                newrelation software, Qatar
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Cr Number
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                232
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Baladiya
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                234
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Project Name
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                232
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Total Amount
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                234
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Project Start Date
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                232
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Project End date
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                234
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm font-semibold">
                Payment Date
              </label>
              <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center">
                234
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>tc_file</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Signed Agreement</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      )}
      <div className="w-full mt-5  justify-between hidden">
        <Button className="items-center">
          {" "}
          <ChevronLeft className="w-5 mt-[3px]" /> Previous
        </Button>
        <Button className="items-center">
          Next <ChevronRight className="w-5 mt-[3px]" />
        </Button>
      </div>
    </main>
  );
}
