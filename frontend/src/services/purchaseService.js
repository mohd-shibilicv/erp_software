import { api } from './api';

export const purchaseService = {
  getAllPurchases: () => api.get('/purchases/'),
  getPurchase: (id) => api.get(`/purchases/${id}/`),
  createPurchase: (data) => api.post('/purchases/', data),
  updatePurchase: (id, data) => api.put(`/purchases/${id}/`, data),
  deletePurchase: (id) => api.delete(`/purchases/${id}/`),
};

export const salesOrderService = {
  getAllSalesOrders: () => api.get('/sales-orders/'),
  getSalesOrder: (id) => api.get(`/sales-orders/${id}/`),
  createSalesOrder: (data) => api.post('/sales-orders/', data),
  updateSalesOrder: (id, data) => api.put(`/sales-orders/${id}/`, data),
  deleteSalesOrder: (id) => api.delete(`/sales-orders/${id}/`),
};

export const salesOrderItemService = {
  getAllSalesOrderItems: () => api.get('/sales-order-items/'),
  getSalesOrderItem: (id) => api.get(`/sales-order-items/${id}/`),
  createSalesOrderItem: (data) => api.post('/sales-order-items/', data),
  updateSalesOrderItem: (id, data) => api.put(`/sales-order-items/${id}/`, data),
  deleteSalesOrderItem: (id) => api.delete(`/sales-order-items/${id}/`),
};

export const salesReturnService = {
  getAllSalesReturns: () => api.get('/sales-returns/'),
  getSalesReturn: (id) => api.get(`/sales-returns/${id}/`),
  createSalesReturn: (data) => api.post('/sales-returns/', data),
  updateSalesReturn: (id, data) => api.put(`/sales-returns/${id}/`, data),
  deleteSalesReturn: (id) => api.delete(`/sales-returns/${id}/`),
};

export const salesReturnItemService = {
  getAllSalesReturnItems: () => api.get('/sales-return-items/'),
  getSalesReturnItem: (id) => api.get(`/sales-return-items/${id}/`),
  createSalesReturnItem: (data) => api.post('/sales-return-items/', data),
  updateSalesReturnItem: (id, data) => api.put(`/sales-return-items/${id}/`, data),
  deleteSalesReturnItem: (id) => api.delete(`/sales-return-items/${id}/`),
};

export const saleService = {
  getAllSales: () => api.get('/sales/'),
  getSale: (id) => api.get(`/sales/${id}/`),
  createSale: (data) => api.post('/sales/', data),
  updateSale: (id, data) => api.put(`/sales/${id}/`, data),
  deleteSale: (id) => api.delete(`/sales/${id}/`),
};

export const saleItemService = {
  getAllSaleItems: () => api.get('/sale-items/'),
  getSaleItem: (id) => api.get(`/sale-items/${id}/`),
  createSaleItem: (data) => api.post('/sale-items/', data),
  updateSaleItem: (id, data) => api.put(`/sale-items/${id}/`, data),
  deleteSaleItem: (id) => api.delete(`/sale-items/${id}/`),
};
