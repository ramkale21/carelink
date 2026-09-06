import React from 'react';
import { clsx } from 'clsx';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden', className)} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('p-5 border-b border-slate-100 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={clsx('text-base font-semibold text-slate-900', className)} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('p-5', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3', className)} {...props}>
    {children}
  </div>
);
