
import React from 'react';
import { Language } from '../types';

interface LanguageToggleProps {
  currentLang: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ currentLang, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(currentLang === 'ar' ? 'en' : 'ar')}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-all text-sm font-medium"
    >
      <span className={currentLang === 'en' ? 'font-bold text-emerald-600' : 'text-slate-400'}>EN</span>
      <span className="text-slate-300">|</span>
      <span className={currentLang === 'ar' ? 'font-bold text-emerald-600' : 'text-slate-400'}>AR</span>
    </button>
  );
};
