import { api } from "./api";

export const adminTasksList = {
    getAll: () => api.get("/project-assignments/"),
    get: (id) => api.get(`/project-assignments/${id}/`),
  };

  export const adminTaskManage = {
    getAll: () => api.get("/project-tasks/"),
    get: (id) => api.get(`/project-tasks/${id}/`),
    create: (data) => api.post("/project-tasks/", data),
    update: (id, data) => api.put(`/project-tasks/${id}/`, data),
    delete: (id) => api.delete(`/project-tasks/${id}/`),
  };