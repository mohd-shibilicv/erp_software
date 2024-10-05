import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { formatDateForTaskSection } from "@/lib/formatTaskDate";
import { adminTaskManage } from "@/services/tasklist";
import { LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function TaskAddEdit() {
  const [searchParam, setSearchParam] = useSearchParams();
  setSearchParam;
  const [taskTitle, setTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDoc, setTaskDoc] = useState(null);
  const [subTaskTitle, setSubTaskTitle] = useState("");
  const [subtTaskDescription, setSubTaskDescription] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  useEffect(() => {
    console.log(searchParam.get("project_name"), "Nmae");
    console.log(searchParam.get("id"), " KD");
  }, [searchParam]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  navigate;
  const handleSubmitTask = async () => {
    try {
      if (!taskTitle) {
        return toast.error("Please Enter title");
      }
      if (!taskDescription) {
        return toast.error("Please enter task description");
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("project_staff", Number(searchParam.get("id")));
      formData.append("title", taskTitle);
      formData.append("description", taskDescription);
      formData.append(
        "deadline",
        String(formatDateForTaskSection(taskDeadline))
      );
      formData.append("attachment", taskDoc);
      formData.append("priority", "high");
      formData.append("status", "pending");
      formData.append("subtasks", subTasks);
      await adminTaskManage.create(formData);
      toast.success("Task added");
      setTaskDeadline(null);
      setTaskDescription("");
      setTaskDoc(null);
      setTitle(null);
      setLoading(false);
      setSubTasks([]);
    } catch (error) {
      setLoading(false);
      return toast.error(error.message);
    }
  };
  return (
    <main className="w-full h-full bg-secondaryBg rounded-xl border shadow-sm p-5">
      <div className="w-full">
        <h1 className="text-[21px] font-semibold">Add new Task</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-5">
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">{searchParam.get("staff")}</h1>
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">
            {searchParam.get("project_name")}
          </h1>
        </div>
      </div>
      <div className="mt-5 w-full border rounded-md p-5 bg-slate-100/50 dark:bg-slate-900 shadow-sm">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="sm">
                  Task title
                </label>
                <Input
                  placeholder="Task Title"
                  value={taskTitle}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="sm">
                  Task deadline
                </label>
                <Input
                  placeholder="Task deadline"
                  value={
                    taskDeadline && taskDeadline?.toISOString().slice(0, 16)
                  }
                  onChange={(e) => setTaskDeadline(new Date(e.target.value))}
                  type="datetime-local"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-4 overflow-y-auto">
            <div className="md:col-span-5 h-full ">
              <div className="flex flex-col gap-1 h-full ">
                <label htmlFor="" className="sm">
                  Task Description
                </label>
                <Textarea
                  placeholder="enter description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full h-full"
                />
              </div>
            </div>
            <input
              type="file"
              onChange={(e) => {
                setTaskDoc(e.target.files[0]);
              }}
              name="taskDoc"
              className="hidden"
              id="taskDoc"
            />
            <label
              htmlFor="taskDoc"
              className="md:col-span-1 border rounded-md max-h-[140px] flex justify-center items-center text-sm shadow-sm bg-gray-100 dark:bg-slate-900 cursor-pointer"
            >
              {taskDoc ? (
                <>
                  <img
                    src={
                      typeof taskDoc == "string"
                        ? taskDoc
                        : URL.createObjectURL(taskDoc)
                    }
                    className="w-full h-full object-contain"
                    alt=""
                  />
                </>
              ) : (
                <>
                  <span className="text-center mx-4">
                    Click and upload document
                  </span>
                </>
              )}
            </label>
          </div>
          <div className="mt-4 border p-4 rounded-md bg-slate-100">
            <div className=" grid md:grid-cols-9 grid-cols-1 gap-3  rounded-md shadow-sm ">
              <div className="md:col-span-3">
                <Input
                  placeholder="Task Title"
                  value={subTaskTitle}
                  onChange={(e) => setSubTaskTitle(e.target.value)}
                />
              </div>
              <div className="md:col-span-5">
                <Input
                  placeholder="Task Description"
                  value={subtTaskDescription}
                  onChange={(e) => setSubTaskDescription(e.target.value)}
                />
              </div>
              <div className="md:col-span-1">
                <Button
                  type="button"
                  className="px-2 w-full text-sm"
                  onClick={() => {
                    if (!subTaskTitle) {
                      return toast.error("Please enter subtask title");
                    }
                    if (!subtTaskDescription)
                      return toast.error("Please enter subtask description");
                    setSubTasks((prev) => [
                      ...prev,
                      { title: subTaskTitle, description: subtTaskDescription },
                    ]);
                    setSubTaskTitle("");
                    setSubTaskDescription("");
                  }}
                >
                  Add Sub task
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-2 ">
              {subTasks?.map((tsk, I) => (
                <div
                  key={I}
                  className="w-full relative p-3 border rounded-md bg-slate-50 flex flex-col gap-2"
                >
                  <button
                    type="button"
                    className="absolute right-2 top-2"
                    onClick={() => {
                      setSubTasks(subTasks.filter((_, idx) => I !== idx));
                    }}
                  >
                    <X className="w-5" />
                  </button>
                  <div>
                    <h1 className="font-semibold">{tsk?.title}</h1>
                  </div>
                  <div>
                    <p className="text-sm">{tsk?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            onClick={handleSubmitTask}
            className={`${
              loading ? "pointer-events-none bg-violet-600" : ""
            } flex items-center gap-2 `}
          >
            {loading ? "Loading" : "Submit All"}
            {loading && (
              <>
                <LoaderCircle className="w-5 animate-spin" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
