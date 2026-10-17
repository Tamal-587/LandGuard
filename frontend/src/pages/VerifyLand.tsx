import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  RefreshCw,
  AlertOctagon,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { ScreeningResult } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';

export const VerifyLand: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialRecordId = searchParams.get('record_id') || 'LR-DHK-2024-002';

  const [recordId, setRecordId] = useState(initialRecordId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [reportId, setReportId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick demonstration test presets
  const demoPresets = [
    {
      id: 'LR-DHK-2024-002',
      label: language === 'bn' ? 'দ্বৈত বিক্রয় সংঘাত' : 'Double-Selling Conflict',
      tag: language === 'bn' ? 'উচ্চ ঝুঁকি (+৪০)' : 'High Risk (+40)',
      desc: language === 'bn' ? '২টি সমান্তরাল সক্রিয় বিক্রয় বিচারাধীন' : '2 concurrent active sales pending'
    },
    {
      id: 'LR-DHK-2024-005',
      label: language === 'bn' ? 'মালিকানা চেইনের ফাঁক' : 'Ownership Chain Gap',
      tag: language === 'bn' ? 'মাঝারি (+২০)' : 'Medium (+20)',
      desc: language === 'bn' ? 'বিক্রেতার সাথে পূর্ববর্তী ক্রেতার নাম মেলেনি' : 'Seller doesn’t match prior buyer'
    },
    {
      id: 'LR-DHK-2024-006',
      label: language === 'bn' ? 'নামজারি তথ্যের অমিল' : 'Mutation Mismatch',
      tag: language === 'bn' ? 'মাঝারি (+১৫)' : 'Medium (+15)',
      desc: language === 'bn' ? 'অনিয়মিত নামজারি মন্তব্য ও কেস অনুপস্থিত' : 'Irregular Namzari remarks & missing case'
    },
    {
      id: 'LR-DHK-2024-007',
      label: language === 'bn' ? 'বিকৃত দলিল (SHA-256)' : 'Document Tampering',
      tag: language === 'bn' ? 'উচ্চ ঝুঁকি (+২০)' : 'High (+20)',
      desc: language === 'bn' ? 'দলিলের ডিজিটাল চেকসাম মেলেনি' : 'SHA-256 deed checksum mismatch'
    },
    {
      id: 'LR-DHK-2024-001',
      label: language === 'bn' ? 'বৈধ একক বিক্রয়' : 'Clean Single Sale',
      tag: language === 'bn' ? 'সুরক্ষিত (০)' : 'Low (0)',
      desc: language === 'bn' ? 'বৈধ একক মালিক ও অনুমোদিত নামজারি' : 'Legitimate single owner & approved mutation'
    },
    {
      id: 'LR-DHK-2024-003',
      label: language === 'bn' ? 'ধারাবাহিক মালিকানা' : 'Multi-Year Chain',
      tag: language === 'bn' ? 'সুরক্ষিত (০)' : 'Low (0)',
      desc: language === 'bn' ? '৩টি ধারাবাহিক সম্পন্ন হস্তান্তর' : '3 sequential completed transfers'
    },
    {
      id: 'LR-DHK-2024-004',
      label: language === 'bn' ? 'বাতিলকৃত বিক্রয় কেস' : 'Cancelled Sale Case',
      tag: language === 'bn' ? 'সুরক্ষিত (০)' : 'Low (0)',
      desc: language === 'bn' ? 'বাতিল দলিল কোনো ভুল সংকেত তৈরি করে না' : 'Cancelled sale does not trigger false alarm'
    },
  ];

  const handleRunVerification = async (targetId: string) => {
    if (!targetId.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে সিন্থেটিক ভূমি রেকর্ড আইডি প্রদান করুন।' : 'Please provide a synthetic land record identifier.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.verifyLandRecord(targetId.trim());
      setResult(res.screening_result);
      setReportId(res.report_id);
    } catch (err: any) {
      setError(err.message || (language === 'bn' ? 'যাচাইকরণ পরিচালনা ব্যর্থ হয়েছে।' : 'Verification execution failed.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRecordId) {
      setRecordId(initialRecordId);
      handleRunVerification(initialRecordId);
    }
  }, [initialRecordId]);

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {text(t.verifyPage.title)}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {text(t.verifyPage.subtitle)}
        </p>
      </div>

      {/* Input & Demo Selector Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {text(t.verifyPage.enterRecordId)}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={recordId}
                onChange={(e) => setRecordId(e.target.value)}
                placeholder={language === 'bn' ? 'রেকর্ড আইডি লিখুন (যেমন: LR-DHK-2024-002)...' : 'Enter Record ID (e.g. LR-DHK-2024-002)...'}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            <button
              onClick={() => handleRunVerification(recordId)}
              disabled={loading || !recordId.trim()}
              className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'bn' ? 'রুল মূল্যায়ন চলছে...' : 'Evaluating Rules...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{text(t.verifyPage.runButton)}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Demo Scenario Buttons */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {text(t.verifyPage.quickPresets)}:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {demoPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setRecordId(preset.id);
                  handleRunVerification(preset.id);
                }}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  recordId === preset.id
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-slate-900">{preset.id}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                    {preset.tag}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 truncate">{preset.label}</p>
                <p className="text-[10px] text-slate-500 truncate">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Screening Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Result Summary Banner */}
          <div className={`p-6 rounded-2xl border shadow-sm ${
            result.risk_band === 'HIGH'
              ? 'bg-rose-50/80 border-rose-300 text-rose-950'
              : result.risk_band === 'MEDIUM'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <RiskBadge band={result.risk_band} score={result.risk_score} size="lg" />
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-white/80 border border-current">
                    {language === 'bn' ? 'পার্সেল:' : 'Parcel:'} {result.record_identifier}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{result.screening_status}</h2>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  <strong>{language === 'bn' ? 'প্রস্তাবিত পরবর্তী পদক্ষেপ:' : 'Recommended Next Action:'}</strong> {result.recommended_next_steps}
                </p>
              </div>

              {reportId && (
                <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                  <Link
                    to={`/reports/${reportId}`}
                    className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 justify-center"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                    <span>{text(t.verifyPage.viewFullReport)}</span>
                  </Link>
                  <Link
                    to={`/records/${result.record_identifier}`}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 justify-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'bn' ? 'মূল রেকর্ড দেখুন' : 'Inspect Raw Record'}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Triggered Rule Findings (Detailed Breakdown) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{text(t.verifyPage.ruleFindings)}</h3>
                <p className="text-xs text-slate-400">
                  {result.findings.length} {language === 'bn' ? 'টি রুল চিহ্নিত' : 'rule(s) triggered'} • {language === 'bn' ? 'মোট ঝুঁকি স্কোর:' : 'Total Risk Score:'} {result.risk_score}/100
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {result.findings.length === 0 ? (language === 'bn' ? 'কোনো অসঙ্গতি নেই' : 'Zero Violations') : `${result.findings.length} ${language === 'bn' ? 'টি সতর্কতা' : 'Findings Noted'}`}
              </span>
            </div>

            {result.findings.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">{text(t.verifyPage.noFindings)}</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {language === 'bn' ? 'সকল ঐতিহাসিক হস্তান্তর, ক্রেতা-বিক্রেতা ক্রম ও নামজারি অনুমোদন সিন্থেটিক ডাটাবেজে সামঞ্জস্যপূর্ণ রয়েছে।' : 'All chronological transfers, buyer-seller chains, and mutation approvals are consistent in the synthetic demo database.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {result.findings.map((f, idx) => (
                  <div key={idx} className="p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <RiskBadge band={f.severity} size="sm" />
                        <h4 className="font-bold text-sm text-slate-900">{f.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        +{f.points} {language === 'bn' ? 'ঝুঁকি পয়েন্ট' : 'Risk Points'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{f.explanation}</p>

                    {/* Evidence Box */}
                    {f.evidence && Object.keys(f.evidence).length > 0 && (
                      <div className="bg-slate-900 rounded-lg p-3 text-slate-300 font-mono text-[11px] overflow-x-auto">
                        <div className="text-[10px] text-emerald-400 font-bold mb-1 uppercase tracking-wider">
                          {language === 'bn' ? 'ক্রিপ্টোগ্রাফিক / সম্পর্কযুক্ত প্রমাণক:' : 'Cryptographic / Relational Evidence:'}
                        </div>
                        <pre className="whitespace-pre-wrap">{JSON.stringify(f.evidence, null, 2)}</pre>
                      </div>
                    )}

                    {f.suggested_action && (
                      <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>{text(t.verifyPage.suggestedAction)}</strong> {f.suggested_action}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* List of 7 Checks Performed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800">{text(t.verifyPage.checksExecuted)}</h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'রুল ইঞ্জিন কর্তৃক সম্পাদিত স্বয়ংক্রিয় ভেরিফিকেশন ম্যাট্রিক্স' : 'Automated verification matrix executed by the rules engine'}
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {result.checks_performed.map((chk, i) => {
                const wasTriggered = result.findings.some((f) => f.rule_code.includes(chk.check_id.replace('CHK_', '')));
                return (
                  <div key={i} className="p-4 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-400">{chk.check_id}</span>
                        <h4 className="text-xs font-bold text-slate-800">{chk.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500">{chk.description}</p>
                    </div>
                    <div>
                      {wasTriggered ? (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded whitespace-nowrap">
                          {language === 'bn' ? 'অসঙ্গতি চিহ্নিত' : 'Issue Found'}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded whitespace-nowrap">
                          {language === 'bn' ? 'সঠিক' : 'Clear'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyLand;
