'use client';
import { useDashboard, useDashboardCharts } from '@/hooks/useApi';
import { Header } from '@/components/layout/Header';
import { StatCard, Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { NetBarChart, NetPieChart } from '@/components/charts/Charts';
import { Users, Ticket, AlertTriangle, Activity, Clock, CheckCircle } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboard();
  const { data: charts } = useDashboardCharts();

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ticketsByStatusData = metrics?.tickets.byStatus.map((s: any) => ({ name: STATUS_LABELS[s.status] || s.status, value: s._count })) ?? [];
  const chartData = charts ? charts.labels.map((label: string, i: number) => ({ label, tickets: charts.datasets.tickets[i], incidents: charts.datasets.incidents[i] })) : [];

  return (
    <div>
      <Header title="Dashboard" subtitle="Visão geral da plataforma" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total de Clientes" value={metrics?.customers.total ?? 0} icon={<Users size={22} />} subtitle={`${metrics?.customers.active ?? 0} online`} />
        <StatCard title="Uptime Geral" value={`${metrics?.customers.uptime ?? 0}%`} icon={<Activity size={22} />} color="text-green-400" subtitle="Disponibilidade" />
        <StatCard title="Chamados Abertos" value={metrics?.tickets.open ?? 0} icon={<Ticket size={22} />} color="text-yellow-400" subtitle={`${metrics?.tickets.total ?? 0} total`} />
        <StatCard title="Incidentes Ativos" value={metrics?.incidents.active ?? 0} icon={<AlertTriangle size={22} />} color="text-red-400" subtitle={`${metrics?.incidents.total ?? 0} total`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card className="xl:col-span-2">
          <h3 className="text-base font-semibold text-white mb-4">Chamados e Incidentes (7 dias)</h3>
          <NetBarChart data={chartData} bars={[{ key: 'tickets', color: '#3b82f6', name: 'Chamados' }, { key: 'incidents', color: '#ef4444', name: 'Incidentes' }]} xKey="label" />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-white mb-4">Chamados por Status</h3>
          <NetPieChart data={ticketsByStatusData} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Chamados Recentes</h3>
            <Link href="/tickets" className="text-sm text-blue-400 hover:text-blue-300">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {metrics?.recent.tickets.map((t: any) => (
              <Link key={t.id} href={`/tickets/${t.id}`} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">{t.title}</p>
                  <p className="text-xs text-slate-400">{t.customer?.user?.name}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge label={STATUS_LABELS[t.status]} className={STATUS_COLORS[t.status]} />
                  <Badge label={STATUS_LABELS[t.priority]} className={STATUS_COLORS[t.priority]} />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Incidentes Ativos</h3>
            <Link href="/incidents" className="text-sm text-blue-400 hover:text-blue-300">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {metrics?.recent.incidents.length === 0 && (
              <div className="flex items-center gap-2 text-green-400 py-4">
                <CheckCircle size={18} />
                <span className="text-sm">Nenhum incidente ativo</span>
              </div>
            )}
            {metrics?.recent.incidents.map((inc: any) => (
              <div key={inc.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">{inc.title}</p>
                  <p className="text-xs text-slate-400">{formatDate(inc.createdAt)}</p>
                </div>
                <Badge label={STATUS_LABELS[inc.severity]} className={STATUS_COLORS[inc.severity]} />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1"><Clock size={14} /><span>Tempo médio: {metrics?.tickets.avgResolutionHours}h</span></div>
            <div className="flex items-center gap-1"><CheckCircle size={14} /><span>Resolvidos (30d): {metrics?.tickets.resolvedLast30Days}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
