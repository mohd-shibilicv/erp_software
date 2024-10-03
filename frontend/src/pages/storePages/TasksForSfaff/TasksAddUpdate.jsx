import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { formatDateForTaskSection } from "@/lib/formatTaskDate";
import { adminTaskManage } from "@/services/tasklist";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function TaskAddEdit() {
  const [searchParam, setSearchParam] = useSearchParams();

  const [taskTitle, setTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDoc, setTaskDoc] = useState(null);

  useEffect(() => {
    console.log(searchParam.get("project_name"), "Nmae");
    console.log(searchParam.get("id"), " KD");
  }, [searchParam]);
  const [loading, setLoading] = useState(false);
  const handleSubmitTask = async () => {
    try {
      if (!taskTitle) {
        return toast.error("Please Enter title");
      }
      if (!taskDescription) {
        return toast.error("Please enter task description");
      }
      setLoading(true);
      await adminTaskManage.create({
          project_staff: Number(searchParam.get("id")),
          title: taskTitle,
          description: taskDescription,
          deadline: formatDateForTaskSection(taskDeadline),
        });
        toast.success("Task added")
        setLoading(false);
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
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            onClick={handleSubmitTask}
            className={`${
              loading ? "pointer-events-none bg-violet-600" : ""
            } flex items-center gap-2 `}
          >
            {loading ? "Loading" : "Add Task"}
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
