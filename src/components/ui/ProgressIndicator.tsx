import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface Step {
  id: string;
  label: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStepIndex: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps, currentStepIndex }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-sky-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs',
                  isDone && 'bg-sky-600 text-white',
                  isCurrent && 'bg-sky-600 text-white ring-4 ring-sky-100',
                  !isDone && !isCurrent && 'bg-white border-2 border-slate-300 text-slate-500'
                )}
              >
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={clsx(
                  'text-xs mt-1 font-medium hidden sm:block',
                  isCurrent ? 'text-sky-700 font-semibold' : 'text-slate-500'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
