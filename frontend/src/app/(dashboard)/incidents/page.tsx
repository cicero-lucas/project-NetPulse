'use client';
import { useState } from 'react';
import { useIncidents, useCreateIncident, useResolveIncident } from '@/hooks/useApi';
import { Header } from '@/components/layout/Header';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Table, Pagination } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, CheckCircle } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS, formatDate } from '@/lib/utils';
import { Incident } from '@/types';
import { useForm } from 'react-hook-form';
import { useCustomers } from '@/hooks/useApi';

export default function IncidentsPage() {
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useIncidents({ page, limit: 10, severity: severity || undefined });
  const { data: customers } = useCustomers({ limit: 100 });
  const createIncident = useCreateIncident();
  const resolveIncident = useResolveIncident();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    const payload = { ...data, affectedServices: data.affectedServices ? data.affectedServices.split(',').map((s: string) => s.trim()) : [] };
    await createIncident.mutateAsync(payload);
    setShowModal(false);
    reset();
  };

  const columns = [
    { key: 'title', header: 'Título', render: (r: Incident) => <div><p className="font-medium text-white">{r.title}</p><p className="text-xs text-slate-400">#{r.id.slice(0, 8)}</p></div> },
    { key: 'severity', header: 'Severidade', render: (r: Incident) => <Badge label={STATUS_LABELS[r.severity]} className={STATUS_COLORS[r.severity]} /> },
    { key: 'customer', header: 'Cliente', render: (r: Incident) => r.customer?.user?.name ?? <span className="text-slate-500">Global</span> },
    { key: 'affectedServices', header: 'Serviços', render: (r: Incident) => r.affectedServices.join(', ') || '-' },
    { key: 'isResolved', header: 'Status', render: (r: Incident) => <Badge label={r.isResolved ? 'Resolvido' : 'Ativo'} className={r.isResolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} /> },
    { key: 'createdAt', header: 'Criado em', render: (r: Incident) => formatDate(r.createdAt) },
    { key: 'actions', header: '', render: (r: Incident) => !r.isResolved ? (
      <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); resolveIncident.mutate(r.id); }}>
        <CheckCircle size={14} />Resolver
      </Button>
    ) : null },
  ];

  return (
    <div>
      <Header title="Incidentes" subtitle="Registro e acompanhamento de incidentes técnicos" />

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select value={severity} onChange={e => { setSeverity(e.target.value); setPage(1); }} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todas as severidades</option>
            {['LOW','MEDIUM','HIGH','CRITICAL'].map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <div className="flex-1" />
          <Button onClick={() => setShowModal(true)}><Plus size={16} />Registrar Incidente</Button>
        </div>

        <Table columns={columns} data={data?.data ?? []} isLoading={isLoading} />
        {data && <Pagination page={page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Incidente">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Título" {...register('title', { required: true })} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-300">Descrição</label>
            <textarea {...register('description', { required: true })} rows={3} className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <Select label="Severidade" {...register('severity', { required: true })}>
            <option value="">Selecione</option>
            {['LOW','MEDIUM','HIGH','CRITICAL'].map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </Select>
          <Select label="Cliente (opcional)" {...register('customerId')}>
            <option value="">Incidente global</option>
            {customers?.data.map((c: any) => <option key={c.id} value={c.id}>{c.user?.name}</option>)}
          </Select>
          <Input label="Serviços afetados (separados por vírgula)" placeholder="DNS, DHCP, Roteamento" {...register('affectedServices')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
