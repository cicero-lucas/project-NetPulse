'use client';
import { useState } from 'react';
import { useTicket, useUpdateTicket } from '@/hooks/useApi';
import { Header } from '@/components/layout/Header';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { STATUS_COLORS, STATUS_LABELS, formatDate } from '@/lib/utils';
import { ArrowLeft, Clock, User, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const { data: ticket, isLoading } = useTicket(params.id);
  const updateTicket = useUpdateTicket();
  const router = useRouter();
  const qc = useQueryClient();
  const [comment, setComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm({ values: { status: ticket?.status, assignedToId: ticket?.assignedToId } });

  const onUpdateStatus = async (data: any) => {
    await updateTicket.mutateAsync({ id: params.id, data });
  };

  const onAddComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/tickets/${params.id}/comments`, { content: comment, isInternal });
      setComment('');
      qc.invalidateQueries({ queryKey: ['ticket', params.id] });
      toast.success('Comentário adicionado');
    } catch { toast.error('Erro ao adicionar comentário'); }
    finally { setSubmitting(false); }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!ticket) return <div className="text-slate-400">Chamado não encontrado</div>;

  const statusFlow = ['ABERTO','EM_ANALISE','AGUARDANDO_CLIENTE','EM_MANUTENCAO','RESOLVIDO','FECHADO'];

  return (
    <div>
      <Header title={`Chamado #${ticket.id.slice(0, 8)}`} subtitle={ticket.title} />
      <div className="mb-6"><Button variant="ghost" onClick={() => router.back()}><ArrowLeft size={16} />Voltar</Button></div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{ticket.title}</h3>
              <div className="flex gap-2">
                <Badge label={STATUS_LABELS[ticket.priority]} className={STATUS_COLORS[ticket.priority]} />
                <Badge label={STATUS_LABELS[ticket.status]} className={STATUS_COLORS[ticket.status]} />
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{ticket.description}</p>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2"><MessageSquare size={16} />Comentários ({ticket.comments?.length ?? 0})</h3>
            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
              {ticket.comments?.map(c => (
                <div key={c.id} className={`p-3 rounded-lg ${c.isInternal ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-slate-700/50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{c.user.name}</span>
                    <div className="flex items-center gap-2">
                      {c.isInternal && <span className="text-xs text-yellow-400">Interno</span>}
                      <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{c.content}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Adicionar comentário..." className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)} className="rounded" />
                  Comentário interno
                </label>
                <Button size="sm" onClick={onAddComment} isLoading={submitting}>Comentar</Button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Histórico</h3>
            <div className="space-y-2">
              {ticket.history?.map(h => (
                <div key={h.id} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-slate-400">{formatDate(h.createdAt)}</span>
                  <span className="text-slate-300">{h.fromStatus ? `${STATUS_LABELS[h.fromStatus]} → ` : ''}{STATUS_LABELS[h.toStatus]}</span>
                  {h.note && <span className="text-slate-500">({h.note})</span>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Detalhes</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-300"><User size={14} className="text-slate-400" /><span>Cliente: {ticket.customer?.user?.name}</span></div>
              <div className="flex items-center gap-2 text-slate-300"><User size={14} className="text-slate-400" /><span>Criado por: {ticket.createdBy?.name}</span></div>
              <div className="flex items-center gap-2 text-slate-300"><User size={14} className="text-slate-400" /><span>Responsável: {ticket.assignedTo?.name ?? 'Não atribuído'}</span></div>
              {ticket.slaDeadline && <div className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /><span className={new Date(ticket.slaDeadline) < new Date() ? 'text-red-400' : 'text-slate-300'}>SLA: {formatDate(ticket.slaDeadline)}</span></div>}
              <div className="flex items-center gap-2 text-slate-300"><Clock size={14} className="text-slate-400" /><span>Criado: {formatDate(ticket.createdAt)}</span></div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Atualizar Status</h3>
            <form onSubmit={handleSubmit(onUpdateStatus)} className="space-y-3">
              <Select label="Status" {...register('status')}>
                {statusFlow.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </Select>
              <Button type="submit" className="w-full" isLoading={updateTicket.isPending}>Atualizar</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
