import { adminTasksList } from "@/services/tasklist";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetAllTasksForAdmin = () => {
  return useQuery({
    queryKey: ["adminTasks"],
    queryFn: async () => {
      const { data } = await adminTasksList.getAll();
      return data;
    },
    onError: (error) => {
      return toast.error(error.message);
    },
  });
};
