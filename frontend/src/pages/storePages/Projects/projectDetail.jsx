import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import { projectApi } from "@/services/project";
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const [selectLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    setLoading(true);
    projectApi
      .get(id)
      .then(({ data }) => {
        setLoading(false);
        setData(data);
      })
      .catch((er) => {
        setLoading(false);
        toast.error(er.message);
      });
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
  const detailTabs = [
    "Project detail",
    "Client Details",
    "Client requirements",
    "Dealings and agreements",
  ];
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
          {data?.requirements && (
            <>
              <>
                <span
                  onClick={() => setTab("Client requirements")}
                  className={cn("cursor-pointer", {
                    "text-[#6f42c1]": tabs == "Client requirements",
                  })}
                >
                  Client requirements
                </span>
                <ChevronRight className="w-4 mt-1" />
              </>
            </>
          )}
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
      {loading ? (
        <div className="w-full h-full bg-white p-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl">Data is Loading ... </h1>
            <Loader2 className="animate-spin w-8" />
          </div>
        </div>
      ) : (
        <>
          {tabs == "Project detail" ? (
            <>
              <>
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 overflow-y-auto">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm font-semibold">
                      Project name
                    </label>
                    <Input
                      className="pointer-events-none shadow-md"
                      value={data?.project_name}
                      // onChange={(e) => setProjectname(e.target.value)}
                      //   placeholder="Enter Project name"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm font-semibold">
                      Project id
                    </label>
                    <Input
                      value={data?.project_id}
                      // value={projectId}

                      //   placeholder="Enter Project name"
                      className="pointer-events-none shadow-md"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm font-semibold">
                      Project Status
                    </label>
                    <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                      {data?.status}
                    </div>
                  </div>
                </div>
                <div className="mt-5 w-full">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm font-semibold">
                      Project Description
                    </label>
                    <Textarea
                      className="w-full pointer-events-none shadow-md"
                      placeholder="enter project description "
                      value={data?.project_description}
                    />
                  </div>
                </div>
                <div className="mt-5 w-full grid md:grid-cols-2 grid-cols-1 gap-5">
                  <div className="flex flex-col gap-1 ">
                    <label htmlFor="" className="text-sm font-semibold">
                      Client
                    </label>
                    <div className="w-full shadow-md h-10 rounded-md border bg-white px-4 flex items-center">
                      {data?.client?.name}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm font-semibold">
                      Select Priority
                    </label>
                    <div className="w-full shadow-md h-10 rounded-md border bg-white px-4 flex items-center">
                      {data?.priority_level}
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
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.client?.id}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Client name
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.client?.name}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Mobile Number
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.client?.mobile_number}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Whatsapp Number
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.client?.whatsapp_number}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Email address
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.client?.email}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Country and City
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.client?.country} , {data?.client?.city}
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
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.requirements?.file_number}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Color Theme
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.requirements?.color_theme}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid gap-5 grid-cols-1 md:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Layout
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.requirements?.layout}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    additional requirements
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.requirements?.additional_requirements}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Status
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.requirements?.status}
                  </div>
                </div>
              </div>
              <div className="w-full mt-5 flex flex-col p-2 border rounded-md ">
                <label htmlFor="" className="text-sm font-semibold">
                  Features
                </label>
                <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-2 shadow-md">
                  {data?.requirements?.predefined_features?.map((feature) => (
                    <div
                      key={feature?.id}
                      className="h-8 px-2 rounded-lg bg-gray-200 flex justify-center items-center text-sm"
                    >
                      {feature?.name}
                    </div>
                  ))}
                  {data?.requirements?.custom_features?.map((feature) => (
                    <div
                      key={feature?.id}
                      className="h-8 px-2 rounded-lg bg-gray-200 flex justify-center items-center text-sm"
                    >
                      {feature?.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full mt-5 flex flex-col p-2 border rounded-md hidden">
                <label htmlFor="" className="text-sm font-semibold">
                  Custome Features
                </label>
                <div className="flex flex-wrap gap-2 mt-2 border shadow-md rounded-md p-2">
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
                <div className="flex flex-wrap gap-2 mt-2 border rounded-md p-2 ">
                  {data?.requirements?.images?.map((img) => (
                    <Dialog key={img?.id}>
                      <DialogTrigger>
                        <div className="h-48 w-48 border rounded-md overflow-hidden cursor-pointer shadow-md">
                          <img
                            src={img?.image}
                            className="w-full h-full object-contain"
                            alt=""
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogDescription className="h-[500px] overflow-y-auto">
                            <img
                              src={img?.image}
                              className="w-full h-full object-contain"
                              alt=""
                            />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ))}
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
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.id}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Quotation Id
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.quotation}
                  </div>
                </div>
              </div>
              <div className="w-full mt-5 flex flex-col p-3 border rounded-md">
                <div className="w-full">
                  <h1>Payment Terms</h1>
                </div>
                {data?.agreement?.payment_terms?.map((pt) => (
                  <div
                    key={pt?.id}
                    className="w-full mt-2 flex gap-2 border p-2 rounded-md  shadow-md"
                  >
                    <div className="size-10 text-sm flex justify-center items-center bg-gray-200 rounded-md">
                      1
                    </div>
                    <div className="h-10 text-sm px-2 flex justify-center items-center bg-gray-200 rounded-md gap-2">
                      <Calendar className="w-4" />
                      {pt?.date}
                    </div>
                    <div className="h-10 text-sm px-2 flex justify-center items-center bg-gray-200 rounded-md">
                      {pt?.amount} QAR
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Quotation Number
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.quotation_number}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Client Name
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.clientName}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Company Name
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.company_name}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Company Address
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.company_address}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Cr Number
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.cr_number}
                    232
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Baladiya
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.baladiya}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Project Name
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.project_name}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Total Amount
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.total_amount} QAR
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Project Start Date
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.project_start_date}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Project End date
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.project_end_date}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm font-semibold">
                    Payment Date
                  </label>
                  <div className="w-full h-10 rounded-md border bg-white px-4 flex items-center shadow-md">
                    {data?.agreement?.payment_date}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="shadow-md px-3 border rounded-md">
                      Tc File
                    </AccordionTrigger>
                    <AccordionContent>
                      <embed
                        src={data?.agreement?.tc_file}
                        className="w-full min-h-[500px]"
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="shadow-md px-3 border rounded-md">
                      Signed Agreement
                    </AccordionTrigger>
                    <AccordionContent className="">
                      <embed
                        src={data?.agreement?.signed_agreement}
                        className="w-full border min-h-[500px]"
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>
          )}
        </>
      )}
      <div className="w-full mt-5  justify-between flex items-center">
        <Button
          className={`items-center h-8 p-2 gap-1 ${
            detailTabs.indexOf(tabs) == 0 ? "pointer-events-none" : ""
          }`}
          variant={`${detailTabs.indexOf(tabs) == 0 ? "secondary" : ""}`}
          onClick={() => {
            setTab(detailTabs[detailTabs.indexOf(tabs) - 1]);
          }}
        >
          {" "}
          <ChevronLeft className="w-5 mt-[0px]" />{" "}
          <span className="text-sm">Previous</span>
        </Button>
        <Button
          className={`items-center h-8 p-2 gap-1 ${
            detailTabs.indexOf(tabs) == detailTabs.length - 1
              ? "pointer-events-none"
              : ""
          }`}
          variant={`${
            detailTabs.indexOf(tabs) == detailTabs.length - 1 ? "secondary" : ""
          }`}
          onClick={() => {
            setTab(detailTabs[detailTabs.indexOf(tabs) + 1]);
          }}
        >
          {" "}
          <span className="text-sm">Next</span>
          <ChevronRight className="w-4 mt-[0px]" />
        </Button>
      </div>
    </main>
  );
}
