import { useNavigate } from "react-router-dom";

import TaskTable from "./TaskTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetAllTasksForAdmin } from "@/hooks/useGetAllTaskforAdmin";

export default function ListStaffAndTask() {
  const navigate = useNavigate();
  navigate;

  const { data: tasks, isLoading: loading } = useGetAllTasksForAdmin();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto py-10 bg-background rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks for Staff </h1>
        <Button
          className="gap-2 items-center hidden"
          onClick={() => navigate("/admin/tasks/new")}
        >
          <PlusCircle className="w-5" /> <span>Add Task</span>
        </Button>
      </div>
      <div className="flex items-center py-4"></div>

      <TaskTable data={tasks ? tasks : []} />
    </div>
  );
}
