import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export const STATUS_COLORS: Record<string, string> = {
  ABERTO: 'bg-blue-500/20 text-blue-400',
  EM_ANALISE: 'bg-yellow-500/20 text-yellow-400',
  AGUARDANDO_CLIENTE: 'bg-orange-500/20 text-orange-400',
  EM_MANUTENCAO: 'bg-purple-500/20 text-purple-400',
  RESOLVIDO: 'bg-green-500/20 text-green-400',
  FECHADO: 'bg-gray-500/20 text-gray-400',
  ONLINE: 'bg-green-500/20 text-green-400',
  OFFLINE: 'bg-red-500/20 text-red-400',
  DEGRADED: 'bg-yellow-500/20 text-yellow-400',
  MAINTENANCE: 'bg-purple-500/20 text-purple-400',
  LOW: 'bg-blue-500/20 text-blue-400',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400',
  HIGH: 'bg-orange-500/20 text-orange-400',
  CRITICAL: 'bg-red-500/20 text-red-400',
  BAIXA: 'bg-blue-500/20 text-blue-400',
  MEDIA: 'bg-yellow-500/20 text-yellow-400',
  ALTA: 'bg-orange-500/20 text-orange-400',
  CRITICA: 'bg-red-500/20 text-red-400',
};

export const STATUS_LABELS: Record<string, string> = {
  ABERTO: 'Aberto', EM_ANALISE: 'Em Análise', AGUARDANDO_CLIENTE: 'Aguardando Cliente',
  EM_MANUTENCAO: 'Em Manutenção', RESOLVIDO: 'Resolvido', FECHADO: 'Fechado',
  ONLINE: 'Online', OFFLINE: 'Offline', DEGRADED: 'Degradado', MAINTENANCE: 'Manutenção',
  LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', CRITICAL: 'Crítica',
  BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta', CRITICA: 'Crítica',
};
