import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
      <div className="p-4 bg-sky-50 text-sky-600 rounded-full mb-3">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      {description && <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>}
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 bg-slate-200/70 rounded-xl w-full" />
      ))}
    </div>
  );
};
