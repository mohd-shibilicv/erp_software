import { staffTaskList } from "@/services/tasklist";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetAllTasksForAdmin = () => {
  return useQuery({
    queryKey: ["staffTasks"],
    queryFn: async () => {
      const { data } = await staffTaskList.getAll();
      return data;
    },
    onError: (error) => {
      return toast.error(error.message);
    },
  });
};
