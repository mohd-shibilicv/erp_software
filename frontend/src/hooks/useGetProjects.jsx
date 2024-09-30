import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "@/services/project";

export const useGetAllProject = (state) => {
  return useQuery({
    queryKey: ["projects", state], // Add state to the queryKey
    queryFn: async () => {
      const { data } = await projectApi.getAll();
      if (state === "all") {
        return data.results;
      } else if (state === "active") {
        return data?.results?.filter((project) => project.active);
      } else {
        return data?.results?.filter((project) => !project.active);
      }
    },
    onError: (error) => {
      // Display error toast when there's an error
      toast.error(error.message);
    },
  });
};
