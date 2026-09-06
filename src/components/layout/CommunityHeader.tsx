'use client';

import React from 'react';
import Link from 'next/link';

export const CommunityHeader: React.FC<{ title: string; isWorker?: boolean }> = ({ title, isWorker = false }) => {
  return (
    <header className="bg-sky-700 text-white px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-xs">
      <div>
        <span className="text-[10px] uppercase font-bold text-sky-200 tracking-wider block">
          {isWorker ? 'COMMUNITY HEALTH WORKER PORTAL' : 'PATIENT HEALTHCARE PORTAL'}
        </span>
        <h1 className="text-base font-bold leading-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/patient/emergency"
          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs animate-pulse-glow flex items-center gap-1"
        >
          <span>108 SOS</span>
        </Link>
      </div>
    </header>
  );
};
