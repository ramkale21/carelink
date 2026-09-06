import React from 'react';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
  variant?: 'green' | 'amber' | 'blue' | 'red' | 'gray';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  let computedVariant = variant;

  if (!computedVariant) {
    const s = status.toUpperCase();
    if (['COMPLETED', 'DISPENSED', 'AVAILABLE', 'CHECKED_IN', 'REVIEWED', 'ACCEPTED'].includes(s)) {
      computedVariant = 'green';
    } else if (['BOOKED', 'PENDING', 'WAITING', 'CREATED', 'SCHEDULED', 'PROCESSING'].includes(s)) {
      computedVariant = 'amber';
    } else if (['IN_CONSULTATION', 'ACTIVE'].includes(s)) {
      computedVariant = 'blue';
    } else if (['CANCELLED', 'REJECTED', 'EXPIRED', 'OUT_OF_STOCK', 'CRITICAL'].includes(s)) {
      computedVariant = 'red';
    } else {
      computedVariant = 'gray';
    }
  }

  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize', styles[computedVariant])}>
      {status.toLowerCase().replace(/_/g, ' ')}
    </span>
  );
};
