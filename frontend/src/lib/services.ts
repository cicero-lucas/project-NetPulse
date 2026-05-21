import api from '@/lib/api';
import { Customer, Ticket, Incident, DashboardMetrics, PaginatedResponse, Notification } from '@/types';

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
};

export const dashboardApi = {
  getMetrics: () => api.get<DashboardMetrics>('/dashboard'),
  getCharts: () => api.get('/dashboard/charts'),
};

export const customersApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<Customer>>('/customers', { params }),
  getOne: (id: string) => api.get<Customer>(`/customers/${id}`),
  create: (data: any) => api.post<Customer>('/customers', data),
  update: (id: string, data: any) => api.patch<Customer>(`/customers/${id}`, data),
  getHistory: (id: string) => api.get(`/customers/${id}/history`),
  getPlans: () => api.get('/customers/plans'),
  createPlan: (data: any) => api.post('/customers/plans', data),
};

export const ticketsApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<Ticket>>('/tickets', { params }),
  getOne: (id: string) => api.get<Ticket>(`/tickets/${id}`),
  create: (data: any) => api.post<Ticket>('/tickets', data),
  update: (id: string, data: any) => api.patch<Ticket>(`/tickets/${id}`, data),
  addComment: (id: string, data: any) => api.post(`/tickets/${id}/comments`, data),
  getStats: () => api.get('/tickets/stats'),
};

export const incidentsApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<Incident>>('/incidents', { params }),
  getOne: (id: string) => api.get<Incident>(`/incidents/${id}`),
  create: (data: any) => api.post<Incident>('/incidents', data),
  resolve: (id: string) => api.patch(`/incidents/${id}/resolve`),
};

export const monitoringApi = {
  getOverview: () => api.get('/monitoring/overview'),
  getCustomerMetrics: (id: string, hours?: number) => api.get(`/monitoring/customers/${id}/metrics`, { params: { hours } }),
  simulate: () => api.post('/monitoring/simulate'),
};

export const notificationsApi = {
  getAll: () => api.get<Notification[]>('/notifications'),
  getUnreadCount: () => api.get<{ count: number }>('/notifications/unread-count'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};
