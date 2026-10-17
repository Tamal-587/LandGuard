import React from 'react';
import { ShieldCheck, AlertCircle, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RiskBadgeProps {
  band: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ band, score, size = 'md' }) => {
  const { language } = useLanguage();
  const normalizedBand = band?.toUpperCase() || 'LOW';

  let config = {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    label: language === 'bn' ? 'কম ঝুঁকি' : 'Low Risk',
    icon: ShieldCheck,
  };

  if (normalizedBand === 'HIGH') {
    config = {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      label: language === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Risk Alert',
      icon: AlertOctagon,
    };
  } else if (normalizedBand === 'MEDIUM') {
    config = {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: language === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium Risk Warning',
      icon: AlertCircle,
    };
  }

  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
        {score !== undefined && <span className="opacity-75">({score})</span>}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border font-semibold ${config.bg}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm md:text-base">{config.label}</span>
        {score !== undefined && (
          <span className="ml-1 text-xs px-2 py-0.5 rounded bg-white/70 border border-current font-bold">
            {language === 'bn' ? 'স্কোর:' : 'Score:'} {score}/100
          </span>
        )}
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-0.5 opacity-80">[{score} {language === 'bn' ? 'পয়েন্ট' : 'pts'}]</span>
      )}
    </span>
  );
};
