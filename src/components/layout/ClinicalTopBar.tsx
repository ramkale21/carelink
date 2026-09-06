'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, User } from 'lucide-react';
import { UserRole } from '@/types';

export const ClinicalTopBar: React.FC<{ role: UserRole; title: string }> = ({ role, title }) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-900">{title}</h1>
        <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-xs font-semibold rounded border border-sky-200 uppercase">
          {role.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Link>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
            {role[0]}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-900 leading-tight">Dr. Clinical MO</span>
            <span className="block text-[10px] text-slate-500">PHC Khed Facility</span>
          </div>
        </div>
      </div>
    </header>
  );
};
