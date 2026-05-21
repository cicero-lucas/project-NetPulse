import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps { className?: string; children: ReactNode; }

export function Card({ className, children }: CardProps) {
  return <div className={cn('bg-slate-800 border border-slate-700 rounded-xl p-6', className)}>{children}</div>;
}

interface StatCardProps { title: string; value: string | number; icon: ReactNode; color?: string; subtitle?: string; }

export function StatCard({ title, value, icon, color = 'text-blue-400', subtitle }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className={cn('text-3xl font-bold mt-1', color)}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('p-3 rounded-xl bg-slate-700', color)}>{icon}</div>
      </div>
    </Card>
  );
}

interface BadgeProps { label: string; className?: string; }
export function Badge({ label, className }: BadgeProps) {
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className)}>{label}</span>;
}
