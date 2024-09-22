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

export const clientRequirementService = {
  getAll: () => api.get("/client-requirements/"),
  get: (id) => api.get(`/client-requirements/${id}/`),
  create: (data) => api.post("/client-requirements/",data),
  update: (id, data) => {
    return api.put(`/client-requirements/${id}/`, data);
  },  delete: (id) => api.delete(`/client-requirements/${id}/`),
}

export const clientQuotation = {
  getAll: () => api.get("/quotations/"),
  get: (id) => api.get(`/quotations/${id}/`),
  create: (data) => api.post("/quotations/", data),
  update: (id, data) => api.put(`/quotations/${id}/`, data),
  delete: (id) => api.delete(`/quotations/${id}/`),
};


