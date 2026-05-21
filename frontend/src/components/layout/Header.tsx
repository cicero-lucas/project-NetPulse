'use client';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '@/hooks/useApi';
import Link from 'next/link';

interface HeaderProps { title: string; subtitle?: string; }

export function Header({ title, subtitle }: HeaderProps) {
  const { data: unread } = useUnreadCount();

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/notifications" className="relative p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
          <Bell size={20} />
          {(unread?.count ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {unread!.count > 9 ? '9+' : unread!.count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
