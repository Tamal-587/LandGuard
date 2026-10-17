import React from 'react';

export const RuralIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden w-full select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 240 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto opacity-80"
      >
        <defs>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E5842" />
            <stop offset="100%" stopColor="#0A2218" />
          </linearGradient>
          <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E865F" />
            <stop offset="100%" stopColor="#133E2E" />
          </linearGradient>
        </defs>

        {/* Rolling Hills / Riverbank */}
        <path
          d="M0 45 Q 60 30, 130 40 T 240 32 L 240 70 L 0 70 Z"
          fill="url(#grassGrad)"
          opacity="0.8"
        />
        <path
          d="M0 50 Q 80 40, 160 52 T 240 45 L 240 70 L 0 70 Z"
          fill="#0D2B1F"
        />

        {/* Thatched Hut 1 */}
        <path d="M40 46 L 52 38 L 64 46 Z" fill="#D97706" opacity="0.9" />
        <rect x="43" y="46" width="18" height="12" fill="#78350F" />
        <rect x="50" y="50" width="4" height="8" fill="#1E293B" />

        {/* Small Thatched Hut 2 */}
        <path d="M68 49 L 77 42 L 86 49 Z" fill="#B45309" opacity="0.85" />
        <rect x="70" y="49" width="14" height="9" fill="#92400E" />

        {/* Palm Tree 1 */}
        <path d="M110 56 Q 112 40, 115 28" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />
        {/* Palm fronds */}
        <path d="M115 28 Q 104 22, 98 28" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
        <path d="M115 28 Q 124 20, 132 26" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
        <path d="M115 28 Q 110 16, 114 10" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        <path d="M115 28 Q 120 18, 126 12" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />

        {/* Rounded Banyan / Mango Trees */}
        <circle cx="155" cy="38" r="14" fill="url(#treeGrad)" />
        <circle cx="145" cy="42" r="10" fill="#174734" />
        <circle cx="165" cy="43" r="11" fill="#133E2E" />

        <circle cx="25" cy="46" r="9" fill="url(#treeGrad)" />
        <circle cx="18" cy="49" r="7" fill="#154131" />

        {/* Far background trees */}
        <circle cx="195" cy="42" r="8" fill="#123B2C" opacity="0.7" />
        <circle cx="210" cy="40" r="11" fill="#174734" opacity="0.7" />
        <circle cx="225" cy="44" r="7" fill="#0F3325" opacity="0.6" />
      </svg>
    </div>
  );
};
