'use client';
import { useMonitoringOverview, useCustomers } from '@/hooks/useApi';
import { Header } from '@/components/layout/Header';
import { Card, StatCard, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NetLineChart } from '@/components/charts/Charts';
import { Activity, Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/utils';
import { monitoringApi } from '@/lib/services';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function MonitoringPage() {
  const { data: overview, isLoading } = useMonitoringOverview();
  const { data: customers } = useCustomers({ limit: 20 });
  const qc = useQueryClient();
  const [simulating, setSimulating] = useState(false);

  const simulate = async () => {
    setSimulating(true);
    try {
      await monitoringApi.simulate();
      qc.invalidateQueries({ queryKey: ['monitoring-overview'] });
      qc.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Métricas simuladas com sucesso!');
    } catch { toast.error('Erro ao simular métricas'); }
    finally { setSimulating(false); }
  };

  return (
    <div>
      <Header title="Monitoramento" subtitle="Status em tempo real dos serviços" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total de Clientes" value={overview?.totalCustomers ?? 0} icon={<Activity size={22} />} />
        <StatCard title="Online" value={overview?.online ?? 0} icon={<Wifi size={22} />} color="text-green-400" />
        <StatCard title="Offline" value={overview?.offline ?? 0} icon={<WifiOff size={22} />} color="text-red-400" />
        <StatCard title="Latência Média" value={`${overview?.avgLatency ?? 0}ms`} icon={<AlertTriangle size={22} />} color="text-yellow-400" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">Status dos Clientes</h2>
        <Button variant="secondary" onClick={simulate} isLoading={simulating}><RefreshCw size={16} />Simular Métricas</Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {customers?.data.map((c: any) => (
            <div key={c.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white truncate">{c.user?.name}</p>
                <Badge label={STATUS_LABELS[c.serviceStatus]} className={STATUS_COLORS[c.serviceStatus]} />
              </div>
              <p className="text-xs text-slate-400 mb-1">{c.plan?.name}</p>
              <p className="text-xs text-slate-500">{c.city}/{c.state}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${c.serviceStatus === 'ONLINE' ? 'bg-green-400 animate-pulse' : c.serviceStatus === 'OFFLINE' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                <span className="text-xs text-slate-400">{c.serviceStatus === 'ONLINE' ? 'Serviço ativo' : c.serviceStatus === 'OFFLINE' ? 'Sem conexão' : 'Instável'}</span>
              </div>
            </div>
          ))}
        </div>
        {(!customers?.data || customers.data.length === 0) && (
          <p className="text-center text-slate-400 py-8">Nenhum cliente cadastrado</p>
        )}
      </Card>

      <div className="mt-6">
        <Card>
          <h3 className="text-base font-semibold text-white mb-2">Distribuição de Status</h3>
          <div className="flex gap-6 mt-4">
            {overview && [
              { label: 'Online', value: overview.online, color: 'bg-green-500' },
              { label: 'Offline', value: overview.offline, color: 'bg-red-500' },
              { label: 'Degradado', value: overview.degraded, color: 'bg-yellow-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-slate-300">{item.label}: <strong className="text-white">{item.value}</strong></span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-4 bg-slate-700 rounded-full overflow-hidden flex">
            {overview && overview.totalCustomers > 0 && <>
              <div className="bg-green-500 h-full transition-all" style={{ width: `${(overview.online / overview.totalCustomers) * 100}%` }} />
              <div className="bg-yellow-500 h-full transition-all" style={{ width: `${(overview.degraded / overview.totalCustomers) * 100}%` }} />
              <div className="bg-red-500 h-full transition-all" style={{ width: `${(overview.offline / overview.totalCustomers) * 100}%` }} />
            </>}
          </div>
          <p className="text-sm text-slate-400 mt-2">Uptime geral: <strong className="text-white">{overview?.uptime ?? 100}%</strong></p>
        </Card>
      </div>
    </div>
  );
}
