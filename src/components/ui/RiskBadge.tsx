import React from 'react';
import { RiskLevel } from '@/types';
import { clsx } from 'clsx';
import { AlertTriangle, ShieldCheck, AlertCircle, Zap } from 'lucide-react';

interface RiskBadgeProps {
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level = 'LOW', size = 'md', showIcon = true }) => {
  const styles = {
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    CRITICAL: 'bg-red-50 text-red-700 border-red-300 font-bold animate-pulse-glow',
  };

  const icons = {
    LOW: <ShieldCheck className="w-3.5 h-3.5" />,
    MEDIUM: <AlertCircle className="w-3.5 h-3.5" />,
    HIGH: <AlertTriangle className="w-3.5 h-3.5" />,
    CRITICAL: <Zap className="w-3.5 h-3.5" />,
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  };

  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full border', styles[level], sizes[size])}>
      {showIcon && icons[level]}
      {level} RISK
    </span>
  );
};
