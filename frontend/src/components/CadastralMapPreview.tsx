import React, { useState } from 'react';
import { MapPin, Maximize2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CadastralMapPreviewProps {
  parcelId?: string;
  dagNo?: string;
  khatianNo?: string;
  location?: string;
  areaDecimal?: number | string;
  className?: string;
}

export const CadastralMapPreview: React.FC<CadastralMapPreviewProps> = ({
  parcelId = 'P-2048',
  dagNo = '125',
  khatianNo = '786',
  location = 'Joypara, Dhamrai, Dhaka',
  areaDecimal = '8.5',
  className = '',
}) => {
  const { language, t, text } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`relative rounded-xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900 group select-none ${className}`}
      >
        {/* Map canvas using high-contrast stylized SVG tile */}
        <div className="relative w-full h-full min-h-[190px] bg-[#1a2e22] overflow-hidden">
          {/* Faux Satellite Agricultural Fields Grid Texture */}
          <svg
            viewBox="0 0 400 300"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Field boundaries */}
            <rect width="400" height="300" fill="#203a2b" />
            <path d="M0,80 L400,110" stroke="#16291e" strokeWidth="6" />
            <path d="M0,220 L400,190" stroke="#16291e" strokeWidth="6" />
            <path d="M120,0 L140,300" stroke="#16291e" strokeWidth="5" />
            <path d="M280,0 L260,300" stroke="#16291e" strokeWidth="5" />

            {/* Adjacent parcel plots */}
            <rect x="15" y="15" width="95" height="60" fill="#294836" opacity="0.6" />
            <rect x="145" y="10" width="110" height="90" fill="#1f3729" opacity="0.7" />
            <rect x="290" y="20" width="95" height="80" fill="#2c4f3b" opacity="0.6" />
            <rect x="15" y="95" width="110" height="110" fill="#223f2f" opacity="0.7" />
            <rect x="275" y="120" width="115" height="65" fill="#254332" opacity="0.6" />
            <rect x="20" y="235" width="120" height="55" fill="#2a4a37" opacity="0.6" />
            <rect x="150" y="210" width="105" height="75" fill="#1d3427" opacity="0.7" />

            {/* TARGET PARCEL POLYGON */}
            <polygon
              points="145,115 250,95 270,195 155,205"
              fill="#EF4444"
              fillOpacity="0.38"
              stroke="#EF4444"
              strokeWidth="3.5"
              strokeDasharray="none"
              className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            />

            {/* Target Parcel Label in Center */}
            <text
              x="195"
              y="160"
              fill="#FFFFFF"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
              className="font-mono tracking-wider drop-shadow"
            >
              {language === 'bn' ? `দাগ ${dagNo}` : `Dag ${dagNo}`}
            </text>

            {/* Map Pin Marker */}
            <g transform="translate(195, 125)">
              <circle cx="0" cy="0" r="14" fill="#EF4444" fillOpacity="0.4" className="animate-ping" />
              <path
                d="M0 -14 C-7 -14 -12 -9 -12 -2 C-12 6 0 14 0 14 C0 14 12 6 12 -2 C12 -9 7 -14 0 -14 Z"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="-4" r="3.5" fill="#FFFFFF" />
            </g>
          </svg>

          {/* Top subtle overlay badge */}
          <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300 font-bold">
            {language === 'bn' ? `মৌজা নকশা দাগ #${dagNo}` : `Cadastral Plot #${dagNo}`}
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-auto">
            <span className="text-[10px] text-white/90 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded border border-white/10 truncate max-w-[130px]">
              {location}
            </span>
            <button
              onClick={() => setModalOpen(true)}
              className="px-2.5 py-1 bg-slate-900/85 hover:bg-emerald-600 text-white rounded text-[10px] font-semibold flex items-center gap-1 border border-white/15 backdrop-blur-sm transition-all"
            >
              <Maximize2 className="w-3 h-3" />
              <span>{language === 'bn' ? 'বড় নকশা দেখুন' : 'View Larger Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Larger Map Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  {language === 'bn' ? `ক্যাডাস্ট্রাল সার্ভে নকশা • পার্সেল ${parcelId}` : `Cadastral Survey Map • Parcel ${parcelId}`}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative h-80 rounded-xl overflow-hidden border border-slate-300 bg-[#173022]">
                <svg
                  viewBox="0 0 600 400"
                  className="w-full h-full object-cover"
                >
                  <rect width="600" height="400" fill="#1b3627" />
                  {/* Grid lines */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line
                      key={`h-${i}`}
                      x1="0"
                      y1={i * 50}
                      x2="600"
                      y2={i * 50}
                      stroke="#224230"
                      strokeWidth="1"
                    />
                  ))}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={`v-${i}`}
                      x1={i * 50}
                      y1="0"
                      x2={i * 50}
                      y2="400"
                      stroke="#224230"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Adjacent cadastral parcels */}
                  <polygon points="50,40 180,30 200,140 70,160" fill="#254734" stroke="#335e46" strokeWidth="2" />
                  <text x="120" y="100" fill="#88b598" fontSize="12" textAnchor="middle">
                    {language === 'bn' ? 'দাগ ১২৩' : 'Plot 123'}
                  </text>

                  <polygon points="380,40 540,50 510,170 360,150" fill="#254734" stroke="#335e46" strokeWidth="2" />
                  <text x="440" y="110" fill="#88b598" fontSize="12" textAnchor="middle">
                    {language === 'bn' ? 'দাগ ১২৪' : 'Plot 124'}
                  </text>

                  {/* Target Parcel 125 */}
                  <polygon
                    points="210,150 370,140 400,290 220,310"
                    fill="#EF4444"
                    fillOpacity="0.45"
                    stroke="#EF4444"
                    strokeWidth="4"
                  />
                  <text
                    x="295"
                    y="225"
                    fill="#FFFFFF"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono drop-shadow-md"
                  >
                    {language === 'bn' ? `পার্সেল ${parcelId} (দাগ ${dagNo})` : `Parcel ${parcelId} (Dag ${dagNo})`}
                  </text>
                  <text
                    x="295"
                    y="245"
                    fill="#FEE2E2"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {language === 'bn' ? `পরিমাণ: ${areaDecimal} শতক • খতিয়ান ${khatianNo}` : `Area: ${areaDecimal} Decimal • Khatian ${khatianNo}`}
                  </text>
                </svg>

                {/* Overlay details */}
                <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs space-y-0.5 border border-white/10">
                  <p className="font-bold text-emerald-400">{language === 'bn' ? 'মৌজা:' : 'Mouza:'} {location}</p>
                  <p className="text-[11px] text-slate-300">
                    {language === 'bn' ? 'জরিপ তফসিল: আরএস/বিএস সিমানা' : 'Survey Schedule: RS/BS Demarcation'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">{text(t.common.dagNo)}</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{dagNo}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">{text(t.common.khatianNo)}</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{khatianNo}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">{language === 'bn' ? 'সীমানাকৃত পরিমাণ' : 'Demarcated Area'}</p>
                  <p className="font-bold text-emerald-700 text-sm mt-0.5">{areaDecimal} {language === 'bn' ? 'শতক' : 'Decimal'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {text(t.common.close)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CadastralMapPreview;
