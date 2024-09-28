import { api } from "./api";

export const projectApi = {
    getAll: () => api.get("/projects/"),
    get: (id) => api.get(`/projects/${id}/`),
    create: (data) => api.post("/projects/", data),
    update: (id, data) => api.put(`/projects/${id}/`, data),
    delete: (id) => api.delete(`/projects/${id}/`),
  };