import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'header';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'light', className = '' }) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'dark') {
    return (
      <div className={`inline-flex items-center rounded-xl bg-white/10 p-1 border border-white/20 backdrop-blur-sm text-xs font-semibold ${className}`}>
        <Languages className="w-3.5 h-3.5 mx-1.5 text-emerald-300" />
        <button
          type="button"
          onClick={() => setLanguage('bn')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            language === 'bn'
              ? 'bg-[#128a5d] text-white shadow-sm font-bold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
          title="বাংলায় পরিবর্তন করুন"
        >
          বাংলা
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            language === 'en'
              ? 'bg-[#128a5d] text-white shadow-sm font-bold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
          title="Switch to English"
        >
          English
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold ${className}`}>
      <Languages className="w-3.5 h-3.5 mx-1 text-slate-500" />
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2 py-1 rounded-md transition-all ${
          language === 'bn'
            ? 'bg-white text-emerald-700 shadow-sm font-bold border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        title="বাংলায় পরিবর্তন করুন"
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md transition-all ${
          language === 'en'
            ? 'bg-white text-emerald-700 shadow-sm font-bold border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
        title="Switch to English"
      >
        English
      </button>
    </div>
  );
};
