import { adminTaskManage } from "@/services/tasklist";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetTaskDetail = (id) => {
  return useQuery({
    queryKey: ["taskDetail", id],
    queryFn: async () => {
      const { data } = await adminTaskManage.get(id);
      return data;
    },
    onError: (error) => {
      return toast.error(error.message);
    },
  });
};
