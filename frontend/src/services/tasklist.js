import { api } from "./api";

export const adminTasksList = {
  getAll: () => api.get("/project-assignments/"),
  get: (id) => api.get(`/project-assignments/${id}/`),
};

export const adminTaskManage = {
  getAll: () => api.get("/project-tasks/"),
  get: (id) => api.get(`/individual-projects-tasks/staff-tasks/${id}/`),
  create: (data) => api.post("/project-tasks/", data),
  update: (taskId, data, subtaskId) => 
    subtaskId 
      ? api.put(`/project-tasks/${taskId}/subtask/${subtaskId}/`, data)
      : api.put(`/project-tasks/${taskId}/`, data), 
  delete: (id) => api.delete(`/project-tasks/${id}/`),
};

export const staffTaskList = {
  getAll: () => api.get("/induvidual-listing/"),
  requestDeadline: (data) => api.post("/send-project-email/",data),

};
