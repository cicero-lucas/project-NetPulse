import { ReactNode } from 'react';

interface Column<T> { key: string; header: string; render?: (row: T) => ReactNode; }

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id: string }>({ columns, data, isLoading, onRowClick }: TableProps<T>) {
  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 text-sm font-medium text-slate-400">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-8 text-slate-500">Nenhum registro encontrado</td></tr>
          ) : data.map(row => (
            <tr key={row.id} onClick={() => onRowClick?.(row)} className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}>
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4 text-sm text-slate-300">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps { page: number; totalPages: number; onPageChange: (p: number) => void; }

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
      <span>Página {page} de {totalPages}</span>
      <div className="flex gap-2">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="px-3 py-1 rounded bg-slate-700 disabled:opacity-40 hover:bg-slate-600 transition-colors">Anterior</button>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="px-3 py-1 rounded bg-slate-700 disabled:opacity-40 hover:bg-slate-600 transition-colors">Próximo</button>
      </div>
    </div>
  );
}
