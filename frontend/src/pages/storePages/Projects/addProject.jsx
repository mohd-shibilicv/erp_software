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
import { Loader2, Loader2Icon, Save } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { api } from "@/services/api";
import { clientRequirementService } from "@/services/crmServiceApi";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from "react-router-dom";
import { toast as Hotoast } from "react-hot-toast";
export default function ProjectAddandUpdate() {
  const [projectId, setProjectid] = useState("");
  const [projectName, setProjectname] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPriority, setProjectPriority] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const { id } = useParams();
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

      setStaffs(staff.data);

      setRequirements(req.data.results);
      console.log("🚀 ~ fetchClientDetails ~ response:", response.data.results);

      setAgreements(response.data.results);
      setClient(data.results);

      setSelectLoading(false);
    } catch {
      setSelectLoading(false);
    }
  };
  useEffect(() => {}, [clients]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchClientDetails();
  }, []);

  const { toast } = useToast();
  const handleSubmit = async () => {
    try {
      
      // if (!projectName) {
      //   return toast({
      //     description: "Please Enter ProjectName",
      //     variant: "destructive",
      //   });
      // }
      // if (!selectedClient) {
      //   toast({
      //     description: "Please Select client",
      //     variant: "destructive",
      //   });
      //   return;
      // }
      if(!projectStatus){
        return toast({
          description: "Please Select Project Status",
          variant: "destructive",
        });
      }
      if(!projectPriority){
        return toast({
          description: "Please Select Project Priority",
          variant: "destructive",
        });
      }
      if(!selectedAgreement){
        return toast({
          description: "Please Select Agreement",
          variant: "destructive",
        });
      }
      if(!selectedRequirement){
        return toast({
          description: "Please Select Requirement",
          variant: "destructive",
        });
      }
      setisLoading(true);
      if (!id) {
        console.log(selectedRequirement,selectedAgreement,"aaaaaaa")
        await projectApi.create({
          project_id: Number(projectId),
          // project_name: projectName,
          status: projectStatus,
          project_description: projectDescription,
          priority_level: projectPriority,
          // client_id: selectedClient,
          requirements_id: Number(selectedRequirement),
          // agreement_project_name:
          //   agreements.find((ag) => ag.id == selectedAgreement)?.project_name ||
          //   selectedAgreement,
          assigned_staffs: selectedStaffs,
          agreement_id: selectedAgreement,
        });
        setisLoading(false);
        toast({ description: "Project created" });
        return navigate("/admin/projects");
      } else {
        await projectApi.update(id, {
          project_id: Number(projectId),
          // project_name: projectName,
          status: projectStatus,
          project_description: projectDescription,
          priority_level: projectPriority,
          // client_id: selectedClient,
          requirements_id: Number(selectedRequirement),
          // agreement_project_name:
          //   agreements.find((ag) => ag.id == selectedAgreement)?.project_name ||
          //   selectedAgreement,
          assigned_staffs: selectedStaffs,
          agreement_id: selectedAgreement,
        });
        setisLoading(false);
        toast({ description: "Project updated" });
        return navigate("/admin/projects");
      }
    } catch (error) {
      setisLoading(false);
      return toast({
        description: error?.message,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if (id) {
      projectApi
        .get(id)
        .then(({ data }) => {
          console.log("🚀 ~ .then ~ data:", data);
          setProjectname(data?.project_name);
          setProjectid(data?.project_id);
          setProjectStatus(data?.status);
          setProjectDescription(data?.project_description);
          setSelectedClient(data?.client.id);
          setProjectPriority(data?.priority_level);
          setSelectedAgreement(data?.agreement?.id);
          setSelectedRequirement(data?.requirements?.id);
          setSelectedStaffs(data?.assigned_staffs);
        })
        .catch((er) => {
          Hotoast.error(er.message);
        });
    }
  }, [id]);
  return (
    <main className="w-full h-full bg-white rounded-xl border shadow-sm p-5">
      <div className="w-full">
        <h1 className="font-bold text-[21px]">
          {id ? "Updated Project" : "Add new Project"}
        </h1>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div className="flex-col gap-1 hidden">
          <label htmlFor="" className="text-sm font-semibold">
            Select Project name
          </label>
          <Select
            onValueChange={(project) => {
              setProjectname(project);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={projectName ? projectName : "Select Project"}
              />
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
              <SelectValue
                placeholder={projectStatus ? projectStatus : "Project status"}
              />
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
      <div className="mt-5 w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="hidden flex-col gap-1">
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
                        <span>
                          {selectedClient
                            ? clients.find((cl) => cl.id == selectedClient)
                                ?.name
                            : "Choose client"}
                        </span>
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
              <SelectValue
                placeholder={projectPriority ? projectPriority : "Priority"}
              />
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
              <SelectValue
                placeholder={
                  selectedAgreement
                    ? agreements.find((ag) => ag.id == selectedAgreement)
                        ?.baladiya
                    : "Select Agreement"
                }
              />
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
            onValueChange={(requirement) => {
              setSelectedRequirement(requirement);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  selectedRequirement
                    ? requirements.find((re) => re.id == selectedRequirement)
                        ?.file_number
                    : "Select requirement"
                }
              />
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
      <div className="mt-5 p-2 border rounded-md flex flex-col gap-1">
        <label htmlFor="" className="text-sm">
          Select check-box to assign staff
        </label>
        <div className=" mt-1 border rounded-md p-2 flex flex-wrap gap-2">
          {staffs?.map((staf, I) => (
            <div
              key={I}
              className="flex gap-2 h-8 items-center px-2 bg-gray-200 border rounded-md "
            >
              <Checkbox
                checked={selectedStaffs.includes(staf.id)}
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
      <div className="mt-5 w-full flex justify-between">
        <Button variant="outline" onClick={() => navigate("/admin/projects")}>
          Back
        </Button>
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
