import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi, customersApi, ticketsApi, incidentsApi, monitoringApi, notificationsApi } from '@/lib/services';
import toast from 'react-hot-toast';

export const useDashboard = () => useQuery({ queryKey: ['dashboard'], queryFn: () => dashboardApi.getMetrics().then(r => r.data), refetchInterval: 30000 });
export const useDashboardCharts = () => useQuery({ queryKey: ['dashboard-charts'], queryFn: () => dashboardApi.getCharts().then(r => r.data), refetchInterval: 60000 });

export const useCustomers = (params?: any) => useQuery({ queryKey: ['customers', params], queryFn: () => customersApi.getAll(params).then(r => r.data) });
export const useCustomer = (id: string) => useQuery({ queryKey: ['customer', id], queryFn: () => customersApi.getOne(id).then(r => r.data), enabled: !!id });
export const usePlans = () => useQuery({ queryKey: ['plans'], queryFn: () => customersApi.getPlans().then(r => r.data) });

export const useTickets = (params?: any) => useQuery({ queryKey: ['tickets', params], queryFn: () => ticketsApi.getAll(params).then(r => r.data) });
export const useTicket = (id: string) => useQuery({ queryKey: ['ticket', id], queryFn: () => ticketsApi.getOne(id).then(r => r.data), enabled: !!id });

export const useIncidents = (params?: any) => useQuery({ queryKey: ['incidents', params], queryFn: () => incidentsApi.getAll(params).then(r => r.data) });

export const useMonitoringOverview = () => useQuery({ queryKey: ['monitoring-overview'], queryFn: () => monitoringApi.getOverview().then(r => r.data), refetchInterval: 15000 });

export const useNotifications = () => useQuery({ queryKey: ['notifications'], queryFn: () => notificationsApi.getAll().then(r => r.data), refetchInterval: 30000 });
export const useUnreadCount = () => useQuery({ queryKey: ['unread-count'], queryFn: () => notificationsApi.getUnreadCount().then(r => r.data), refetchInterval: 30000 });

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ticketsApi.create(data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tickets'] }); toast.success('Chamado aberto com sucesso!'); },
    onError: () => toast.error('Erro ao abrir chamado'),
  });
}

export function useUpdateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => ticketsApi.update(id, data).then(r => r.data),
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ['tickets'] }); qc.invalidateQueries({ queryKey: ['ticket', id] }); toast.success('Chamado atualizado!'); },
    onError: () => toast.error('Erro ao atualizar chamado'),
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => incidentsApi.create(data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['incidents'] }); toast.success('Incidente registrado!'); },
    onError: () => toast.error('Erro ao registrar incidente'),
  });
}

export function useResolveIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incidentsApi.resolve(id).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['incidents'] }); toast.success('Incidente resolvido!'); },
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => customersApi.create(data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); toast.success('Cliente cadastrado!'); },
    onError: () => toast.error('Erro ao cadastrar cliente'),
  });
}
