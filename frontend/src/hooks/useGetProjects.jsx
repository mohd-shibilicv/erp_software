import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "@/services/project";
export const useGetAllProject = (state) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      state
      const { data } = await projectApi.getAll();
      return data.results;
    },
    onError: (error) => {
      // Display error toast when there's an error
      toast.error(error.message);
    },
  });
};
