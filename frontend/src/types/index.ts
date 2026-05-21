export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TECNICO' | 'CLIENTE';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Customer {
  id: string;
  userId: string;
  document: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  planId: string;
  serviceStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';
  contractStart: string;
  createdAt: string;
  user: { name: string; email: string };
  plan: InternetPlan;
}

export interface InternetPlan {
  id: string;
  name: string;
  type: string;
  downloadSpeed: number;
  uploadSpeed: number;
  price: number;
  slaHours: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'ABERTO' | 'EM_ANALISE' | 'AGUARDANDO_CLIENTE' | 'EM_MANUTENCAO' | 'RESOLVIDO' | 'FECHADO';
  priority: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  customerId: string;
  createdById: string;
  assignedToId?: string;
  slaDeadline?: string;
  resolvedAt?: string;
  createdAt: string;
  customer?: { user: { name: string } };
  assignedTo?: { name: string };
  createdBy?: { name: string };
  comments?: TicketComment[];
  history?: TicketHistory[];
}

export interface TicketComment {
  id: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  user: { name: string; role: string };
}

export interface TicketHistory {
  id: string;
  fromStatus?: string;
  toStatus: string;
  note?: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  customerId?: string;
  isResolved: boolean;
  resolvedAt?: string;
  affectedServices: string[];
  createdAt: string;
  customer?: { user: { name: string } };
}

export interface ServiceMetric {
  id: string;
  customerId: string;
  latency: number;
  uptime: number;
  packetLoss: number;
  downloadSpeed: number;
  uploadSpeed: number;
  status: string;
  recordedAt: string;
}

export interface DashboardMetrics {
  customers: { total: number; active: number; uptime: number };
  tickets: { total: number; open: number; resolvedLast30Days: number; avgResolutionHours: number; byStatus: any[]; byPriority: any[] };
  incidents: { total: number; active: number; bySeverity: any[] };
  services: { overview: any[] };
  recent: { tickets: Ticket[]; incidents: Incident[] };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
