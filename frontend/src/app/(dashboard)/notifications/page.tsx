'use client';
import { useNotifications } from '@/hooks/useApi';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { notificationsApi } from '@/lib/services';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const TYPE_COLORS: Record<string, string> = {
  TICKET: 'bg-blue-500/20 text-blue-400',
  INCIDENT: 'bg-red-500/20 text-red-400',
  ALERT: 'bg-yellow-500/20 text-yellow-400',
  INFO: 'bg-slate-500/20 text-slate-400',
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const qc = useQueryClient();

  const markAllRead = async () => {
    await notificationsApi.markAllAsRead();
    qc.invalidateQueries({ queryKey: ['notifications'] });
    qc.invalidateQueries({ queryKey: ['unread-count'] });
    toast.success('Todas marcadas como lidas');
  };

  const markRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    qc.invalidateQueries({ queryKey: ['notifications'] });
    qc.invalidateQueries({ queryKey: ['unread-count'] });
  };

  const unread = notifications?.filter(n => !n.isRead).length ?? 0;

  return (
    <div>
      <Header title="Notificações" subtitle={`${unread} não lidas`} />

      <Card>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">{notifications?.length ?? 0} notificações</p>
          {unread > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllRead}><CheckCheck size={16} />Marcar todas como lidas</Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : notifications?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Bell size={40} className="mb-3 opacity-30" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications?.map(n => (
              <div key={n.id} onClick={() => !n.isRead && markRead(n.id)} className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${n.isRead ? 'bg-slate-700/20 border-slate-700/30' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'}`}>
                <div className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${TYPE_COLORS[n.type] || TYPE_COLORS.INFO}`}>{n.type}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${n.isRead ? 'text-slate-400' : 'text-white'}`}>{n.title}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(n.createdAt)}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
