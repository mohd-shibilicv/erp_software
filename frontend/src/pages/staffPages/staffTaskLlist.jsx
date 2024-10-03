import { useNavigate } from "react-router-dom";

import StaffTaskTable from "./staffTaskTable";
import { useGetAllTasksForAdmin } from "@/hooks/useGetAllTaskforAdmin";

export default function StaffTaskLists() {
  const navigate = useNavigate();
  navigate;
  const { data, isLoading: loading } = useGetAllTasksForAdmin();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto py-10 bg-background rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tasks </h1>
      </div>
      <div className="flex items-center py-4"></div>

      <StaffTaskTable data={[]} />
    </div>
  );
}
