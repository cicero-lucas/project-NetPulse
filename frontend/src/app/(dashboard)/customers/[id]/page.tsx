'use client';
import { useCustomer } from '@/hooks/useApi';
import { Header } from '@/components/layout/Header';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { STATUS_COLORS, STATUS_LABELS, formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Wifi, Phone, MapPin, Calendar, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const { data: customer, isLoading } = useCustomer(params.id);
  const router = useRouter();

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!customer) return <div className="text-slate-400">Cliente não encontrado</div>;

  return (
    <div>
      <Header title={customer.user?.name} subtitle="Detalhes do cliente" />

      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}><ArrowLeft size={16} />Voltar</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Informações do Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-300"><Phone size={16} className="text-slate-400" /><div><p className="text-xs text-slate-400">Telefone</p><p className="text-sm">{customer.phone}</p></div></div>
              <div className="flex items-center gap-3 text-slate-300"><MapPin size={16} className="text-slate-400" /><div><p className="text-xs text-slate-400">Endereço</p><p className="text-sm">{customer.address}, {customer.city}/{customer.state}</p></div></div>
              <div className="flex items-center gap-3 text-slate-300"><Calendar size={16} className="text-slate-400" /><div><p className="text-xs text-slate-400">Cliente desde</p><p className="text-sm">{formatDate(customer.contractStart)}</p></div></div>
              <div className="flex items-center gap-3 text-slate-300"><Wifi size={16} className="text-slate-400" /><div><p className="text-xs text-slate-400">Status do Serviço</p><Badge label={STATUS_LABELS[customer.serviceStatus]} className={STATUS_COLORS[customer.serviceStatus]} /></div></div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Chamados Recentes</h3>
            {(customer as any).tickets?.length === 0 ? (
              <p className="text-slate-400 text-sm">Nenhum chamado registrado</p>
            ) : (
              <div className="space-y-2">
                {(customer as any).tickets?.map((t: any) => (
                  <Link key={t.id} href={`/tickets/${t.id}`} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <p className="text-sm text-white">{t.title}</p>
                    <div className="flex gap-2">
                      <Badge label={STATUS_LABELS[t.status]} className={STATUS_COLORS[t.status]} />
                      <Badge label={STATUS_LABELS[t.priority]} className={STATUS_COLORS[t.priority]} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Plano Contratado</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Zap size={16} className="text-blue-400" /><span className="text-white font-medium">{customer.plan?.name}</span></div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-700/50 rounded-lg p-3"><p className="text-slate-400 text-xs">Download</p><p className="text-white font-medium">{customer.plan?.downloadSpeed} Mbps</p></div>
                <div className="bg-slate-700/50 rounded-lg p-3"><p className="text-slate-400 text-xs">Upload</p><p className="text-white font-medium">{customer.plan?.uploadSpeed} Mbps</p></div>
                <div className="bg-slate-700/50 rounded-lg p-3"><p className="text-slate-400 text-xs">Mensalidade</p><p className="text-white font-medium">{formatCurrency(customer.plan?.price)}</p></div>
                <div className="bg-slate-700/50 rounded-lg p-3"><p className="text-slate-400 text-xs">SLA</p><p className="text-white font-medium">{customer.plan?.slaHours}h</p></div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Ações</h3>
            <div className="space-y-2">
              <Link href={`/tickets?customerId=${customer.id}`}><Button variant="secondary" className="w-full">Ver Chamados</Button></Link>
              <Link href={`/monitoring?customerId=${customer.id}`}><Button variant="secondary" className="w-full">Ver Métricas</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
