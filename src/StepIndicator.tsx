
import React from 'react';
import { Language } from '../types';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  lang: Language;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, lang }) => {
  return (
    <div className="flex justify-between items-center mb-8 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            i + 1 <= currentStep
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
              : 'bg-white border-2 border-slate-200 text-slate-400'
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};
