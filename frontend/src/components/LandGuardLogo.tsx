import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface LandGuardLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const LandGuardLogo: React.FC<LandGuardLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const { language } = useLanguage();
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Emblem */}
      <div
        className={`${iconSize} rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-0.5 shadow-sm flex items-center justify-center ring-1 ring-emerald-400/40`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5/6 h-5/6 text-white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Shield path */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#059669" fillOpacity="0.4" />
          {/* Internal leaf / sprouting shoot representing land vitality & security */}
          <path d="M12 8c2 0 4 2 4 4.5S14 17 12 17s-4-2-4-4.5S10 8 12 8z" fill="#34D399" />
          <path d="M12 17V8" stroke="#FFFFFF" strokeWidth="1.8" />
          <path d="M12 12c1.5-1.5 3-1 3-1" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span className={`${textSize} font-extrabold tracking-tight text-white font-sans`}>
            Land<span className="text-emerald-400 font-bold">Guard</span>
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] text-emerald-200/80 tracking-tight leading-none mt-0.5">
            {language === 'bn' ? 'নিরাপদ ভূমি • বিশ্বস্ত রেকর্ড' : 'Safer Land. Verified Records.'}
          </p>
        )}
      </div>
    </div>
  );
};
