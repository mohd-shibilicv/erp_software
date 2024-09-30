import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { clientAgreement } from "@/services/crmServiceApi";
import { projectApi } from "@/services/project";
import { Loader2, Loader2Icon, Save, X } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { api } from "@/services/api";
import { clientRequirementService } from "@/services/crmServiceApi";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddnewProject() {
  const [projectId, setProjectid] = useState("");
  const [projectName, setProjectname] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPriority, setProjectPriority] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    setProjectid(uuid().replace(/\D/g, "").slice(0, 8));
  }, []);
  const [selectLoading, setSelectLoading] = useState(false);
  const [clients, setClient] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const fetchClientDetails = async () => {
    try {
      setSelectLoading(true);
      const { data } = await api.get("/clients/");
      const response = await clientAgreement.getAll();
      const req = await clientRequirementService.getAll();
      const staff = await api.get("/staff/");
      console.log(staff.data, "This is staff");
      setStaffs(staff.data);
      console.log(req.data.results, "requirement");
      setRequirements(req.data.results);
      console.log(response.data.results, "Agreement");
      console.log(data.results, "Client");
      setAgreements(response.data.results);
      setClient(data.results);
      console.log(data.results, "jahlfdjk");
      setSelectLoading(false);
    } catch {
      setSelectLoading(false);
    }
  };
  useEffect(() => {}, [clients]);
  useEffect(() => {
    fetchClientDetails();
  }, []);
  const { toast } = useToast();
  const handleSubmit = async () => {
    try {
      if (!selectedClient) {
        toast({
          description: "Please Select client",
          variant: "destructive",
        });
        return;
      }
      setisLoading(true);
      // const formData = new FormData();
      // formData.append("project_id", projectId);
      // formData.append("project_name", projectName);
      // formData.append("status", projectStatus);
      // formData.append("project_description", projectDescription);
      // formData.append("priority_level", projectPriority);
      // formData.append("client_id", selectedClient);
      // formData.append("Requirements", selectedRequirement);
      // formData.append("Agreement", selectedAgreement);
      // formData.append("staffs", selectedStaffs);

      await projectApi.create({
        project_id: Number(projectId),
        project_name: projectName,
        status: projectStatus,
        project_description: projectDescription,
        priority_level: projectPriority,
        client_id: selectedClient,
        requirements: Number(selectedRequirement),
        agreement_project_name:
          agreements.find((ag) => ag.id == selectedAgreement)?.project_name ||
          selectedAgreement,
        staffs: selectedStaffs,
      });
      setisLoading(false);
      return toast({ description: "Project created" });
    } catch (error) {
      setisLoading(false);
      return toast({
        description: error?.message,
        variant: "destructive",
      });
    }
  };
  return (
    <main className="w-full h-full bg-white rounded-xl border shadow-sm p-5">
      <div className="w-full">
        <h1 className="font-bold text-[21px]">Add new Project</h1>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm font-semibold">
            Select Project name
          </label>
          <Select
            onValueChange={(project) => {
              setProjectname(project);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {agreements?.map((ag) => (
                <SelectItem value={ag?.project_name} key={ag?.project_name}>
                  {ag?.project_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm font-semibold">
            Project id
          </label>
          <Input
            value={projectId}
            placeholder="Enter Project name"
            className="pointer-events-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm font-semibold">
            Select Status
          </label>
          <Select
            onValueChange={(status) => {
              setProjectStatus(status);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Project status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-5 w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm font-semibold">
            Project Description
          </label>
          <Textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full"
            placeholder="enter project description"
          />
        </div>
      </div>
      <div className="mt-5 w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm font-semibold">
            Select Client
          </label>
          <Select
            onValueChange={(status) => {
              setSelectedClient(status);
            }}
          >
            <SelectTrigger
              className={`w-full ${selectLoading ? "pointer-events-none" : ""}`}
            >
              <SelectValue
                placeholder={
                  <div className="flex gap-2 items-center">
                    {selectLoading ? (
                      <>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Choose client</span>
                      </>
                    )}
                    {selectLoading && (
                      <>
                        <Loader2Icon className="w-4 animate-spin" />
                      </>
                    )}
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client) => (
                <SelectItem key={client?.id} value={client?.id}>
                  {client?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm font-semibold">
            Select Priority
          </label>
          <Select
            onValueChange={(status) => {
              setProjectPriority(status);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm font-semibold">
            Select agreement
          </label>
          <Select
            onValueChange={(agreement) => {
              setSelectedAgreement(agreement);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Agreement" />
            </SelectTrigger>
            <SelectContent>
              {agreements?.map((ag, i) => (
                <SelectItem value={ag?.id} key={ag?.baladiya + "" + i}>
                  {ag?.baladiya}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-sm font-semibold">
            Select requirement
          </label>
          <Select
            onValueChange={(agreement) => {
              setSelectedRequirement(agreement);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select requirement" />
            </SelectTrigger>
            <SelectContent>
              {requirements?.map((req, i) => (
                <SelectItem value={req?.id} key={req?.layout + "" + i}>
                  {req?.file_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* <div className="mt-5 p-2 border rounded-md flex flex-col gap-1">
        <label htmlFor="" className="text-sm">
          Assign staffs
        </label>
        <div className=" mt-1 border rounded-md p-2 flex flex-wrap gap-2">
          {selectedStaffs?.map((staffId) => (
            <div
              key={staffId}
              className="h-8 flex items-center text-sm px-2 gap-2 bg-gray-300 rounded-md"
            >
              <X
                className="w-4 cursor-pointer"
                onClick={() =>
                  setSelectedStaffs(
                    selectedStaffs.filter((id) => id !== staffId)
                  )
                }
              />
              <span>{staffs.find((staf) => staf.id == staffId)?.username}</span>
            </div>
          ))}
          <Select
            onValueChange={(staff) => {
              setSelectedStaffs((prev) => [...prev, staff]);
            }}
          >
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Select Staff and add" />
            </SelectTrigger>
            <SelectContent>
              {staffs?.map((staff) => (
                <SelectItem value={staff?.id} key={staff?.id}>
                  {staff?.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div> */}
      <div className="mt-5 p-2 border rounded-md flex flex-col gap-1">
        <label htmlFor="" className="text-sm">
          Select check box to assign staff
        </label>
        <div className=" mt-1 border rounded-md p-2 flex flex-wrap gap-2">
          {staffs?.map((staf, I) => (
            <div
              key={I}
              className="flex gap-2 h-8 items-center px-2 bg-gray-200 border rounded-md "
            >
              <Checkbox
                onCheckedChange={(value) => {
                  if (value) {
                    setSelectedStaffs((prev) => [...prev, staf.id]);
                  } else {
                    setSelectedStaffs((prev) =>
                      prev.filter((st) => st !== staf.id)
                    );
                  }
                }}
              />{" "}
              <span>{staf?.username}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 w-full flex justify-end">
        <Button
          variant="default"
          type="submit"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </main>
  );
}
