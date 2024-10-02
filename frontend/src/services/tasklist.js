import { api } from "./api";

export const adminTasksList = {
    getAll: () => api.get("/project-assignments/"),
    get: (id) => api.get(`/project-assignments/${id}/`),
  };