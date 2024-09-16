import { api } from "./api";

export const clientService = {
  getAll: () => api.get("/clients/"),
  get: (id) => api.get(`/clients/${id}/`),
  create: (data) => api.post("/clients/", data),
  update: (id, data) => api.put(`/clients/${id}/`, data),
  delete: (id) => api.delete(`/clients/${id}/`),
};

export const clientRelationshipService = {
  getAll: () => api.get("/client-relationships/"),
  get: (id) => api.get(`/client-relationships/${id}/`),
  create: (data) => api.post("/client-relationships/", data),
  update: (id, data) => api.put(`/client-relationships/${id}/`, data),
  delete: (id) => api.delete(`/client-relationships/${id}/`),
};
