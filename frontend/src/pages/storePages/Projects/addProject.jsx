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

export default function AddnewProject() {
  const [projectId, setProjectid] = useState("");
  const [projectName, setProjectname] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPriority, setProjectPriority] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    setProjectid(uuid().slice(0, 8));
  }, []);
  const [selectLoading, setSelectLoading] = useState(false);
  const [clients, setClient] = useState([]);
  selectLoading;
  const fetchClientDetails = async () => {
    try {
      setSelectLoading(true);
      const { data } = await api.get('/clients/');
      const response = await clientAgreement.getAll();
      const req = await clientRequirementService.getAll();
      const staff = await api.get("/staff/")
      console.log(staff.data,"This is staff")
      console.log(req.data.results,"requirement")
      console.log(response.data.results,"Agreement")
      console.log(data.results,"Client")

      setClient(data.results);
      console.log(data.results,"jahlfdjk")
      setSelectLoading(false);
    } catch {
      setSelectLoading(false);
    }
  };
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
        return
      }
      setisLoading(true);
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("project_name", projectName);
      formData.append("status", projectStatus);
      formData.append("project_description", projectDescription);
      formData.append("priority_level", projectPriority);
      formData.append("client_id", selectedClient);
      await projectApi.create(formData);
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
            Project name
          </label>
          <Input
            value={projectName}
            onChange={(e) => setProjectname(e.target.value)}
            placeholder="Enter Project name"
          />
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
      <div className="mt-5 w-full grid grid-cols-2 gap-5">
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
                  {client?.clientName}
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
