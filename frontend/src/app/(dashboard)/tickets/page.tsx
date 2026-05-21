'use client';
import { useState } from 'react';
import { useTickets, useCustomers } from '@/hooks/useApi';
import { Header } from '@/components/layout/Header';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Table, Pagination } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS, formatDate } from '@/lib/utils';
import { Ticket } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateTicket } from '@/hooks/useApi';
import { Input } from '@/components/ui/Input';

export default function TicketsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const customerId = searchParams.get('customerId') || undefined;
  const { data, isLoading } = useTickets({ page, limit: 10, status: status || undefined, priority: priority || undefined, search: search || undefined, customerId });
  const { data: customers } = useCustomers({ limit: 100 });
  const createTicket = useCreateTicket();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    await createTicket.mutateAsync(data);
    setShowModal(false);
    reset();
  };

  const columns = [
    { key: 'title', header: 'Título', render: (r: Ticket) => <div><p className="font-medium text-white">{r.title}</p><p className="text-xs text-slate-400">#{r.id.slice(0, 8)}</p></div> },
    { key: 'customer', header: 'Cliente', render: (r: Ticket) => r.customer?.user?.name ?? '-' },
    { key: 'priority', header: 'Prioridade', render: (r: Ticket) => <Badge label={STATUS_LABELS[r.priority]} className={STATUS_COLORS[r.priority]} /> },
    { key: 'status', header: 'Status', render: (r: Ticket) => <Badge label={STATUS_LABELS[r.status]} className={STATUS_COLORS[r.status]} /> },
    { key: 'assignedTo', header: 'Responsável', render: (r: Ticket) => r.assignedTo?.name ?? <span className="text-slate-500">Não atribuído</span> },
    { key: 'slaDeadline', header: 'SLA', render: (r: Ticket) => r.slaDeadline ? <span className={new Date(r.slaDeadline) < new Date() ? 'text-red-400' : 'text-slate-300'}>{formatDate(r.slaDeadline)}</span> : '-' },
    { key: 'createdAt', header: 'Criado em', render: (r: Ticket) => formatDate(r.createdAt) },
  ];

  return (
    <div>
      <Header title="Chamados" subtitle="Gerenciamento de chamados técnicos" />

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar chamados..." className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos os status</option>
            {['ABERTO','EM_ANALISE','AGUARDANDO_CLIENTE','EM_MANUTENCAO','RESOLVIDO','FECHADO'].map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <select value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todas as prioridades</option>
            {['BAIXA','MEDIA','ALTA','CRITICA'].map(p => <option key={p} value={p}>{STATUS_LABELS[p]}</option>)}
          </select>
          <Button onClick={() => setShowModal(true)}><Plus size={16} />Novo Chamado</Button>
        </div>

        <Table columns={columns} data={data?.data ?? []} isLoading={isLoading} onRowClick={r => router.push(`/tickets/${r.id}`)} />
        {data && <Pagination page={page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Abrir Chamado">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Título" {...register('title', { required: true })} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-300">Descrição</label>
            <textarea {...register('description', { required: true })} rows={3} className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <Select label="Prioridade" {...register('priority', { required: true })}>
            <option value="">Selecione</option>
            {['BAIXA','MEDIA','ALTA','CRITICA'].map(p => <option key={p} value={p}>{STATUS_LABELS[p]}</option>)}
          </Select>
          <Select label="Cliente" {...register('customerId', { required: true })}>
            <option value="">Selecione o cliente</option>
            {customers?.data.map((c: any) => <option key={c.id} value={c.id}>{c.user?.name}</option>)}
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">Abrir Chamado</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
