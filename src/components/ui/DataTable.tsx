import React from 'react';

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found',
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        <div className="animate-pulse flex flex-col items-center justify-center gap-2">
          <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-xs">
      <table className="w-full text-left border-collapse text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-4 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-slate-50/80 transition-colors">
              {columns.map((col, idx) => (
                <td key={idx} className={`px-4 py-3.5 ${col.className || ''}`}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
