import { api } from "./api";

export const adminTasksList = {
  getAll: () => api.get("/project-assignments/"),
  get: (id) => api.get(`/project-assignments/${id}/`),
};

export const adminTaskManage = {
  getAll: () => api.get("/project-tasks/"),
  // http://127.0.0.1:8000/api/individual-projects-tasks/staff-tasks/3/
  get: (id) => api.get(`/individual-projects-tasks/staff-tasks/${id}/`),
  create: (data) => api.post("/project-tasks/", data),
  update: (id, data) => api.put(`/project-tasks/${id}/`, data),
  delete: (id) => api.delete(`/project-tasks/${id}/`),
};

export const staffTaskList = {
  getAll: () => api.get("/staff/my-projects/"),
};
