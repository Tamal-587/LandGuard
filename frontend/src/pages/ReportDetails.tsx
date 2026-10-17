import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  ArrowLeft,
  Printer,
  AlertOctagon,
  CheckCircle2,
  Info,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { VerificationReport, Finding, CheckPerformed } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../context/LanguageContext';

export const ReportDetails: React.FC = () => {
  const { language, t, text } = useLanguage();
  const { reportId } = useParams<{ reportId: string }>();

  const [report, setReport] = useState<VerificationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;
    setLoading(true);
    api.getVerificationReportDetail(reportId)
      .then((res) => setReport(res.report))
      .catch((err) => setError(err.message || (language === 'bn' ? 'রিপোর্ট পাওয়া যায়নি' : 'Report not found')))
      .finally(() => setLoading(false));
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          {language === 'bn' ? 'যাচাইকরণ ডসিয়ার লোড হচ্ছে...' : 'Loading report dossier...'}
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="bg-white rounded-xl p-8 border border-rose-200 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">
          {language === 'bn' ? 'যাচাইকরণ রিপোর্ট পাওয়া যায়নি' : 'Verification Report Not Found'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {language === 'bn' ? 'সকল রিপোর্টে ফিরে যান' : 'Back to All Reports'}
        </Link>
      </div>
    );
  }

  // Parse JSON payloads
  const checksPerformed: CheckPerformed[] = JSON.parse(report.checks_performed_json || '[]');
  const findings: Finding[] = JSON.parse(report.findings_json || '[]');
  const triggeredRules: string[] = JSON.parse(report.triggered_rules_json || '[]');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Print Controls (Hidden on Print) */}
      <div className="no-print flex items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {language === 'bn' ? 'যাচাই রিপোর্টে ফিরে যান' : 'Back to Verification Reports'}
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/records/${report.land_record_identifier || ''}`}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ভূমি রেকর্ড দেখুন' : 'View Land Record'}</span>
          </Link>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>{text(t.reports.printReport)}</span>
          </button>
        </div>
      </div>

      {/* Official Report Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                {language === 'bn' ? 'ল্যান্ডগার্ড স্ক্রিনিং ডসিয়ার' : 'LandGuard Screening Dossier'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {language === 'bn' ? 'সিন্থেটিক ডেমো প্রোটোটাইপ' : 'Synthetic Demo Prototype'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {report.report_ref}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {text(t.reports.screenedAt)}: <strong>{new Date(report.created_at).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-GB')}</strong>
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
            <RiskBadge band={report.risk_band} score={report.risk_score} size="lg" />
          </div>
        </div>

        {/* Target Parcel Summary Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">{language === 'bn' ? 'টার্গেট পার্সেল আইডি' : 'Target Parcel Identifier'}</span>
            <span className="font-mono font-bold text-slate-900 block mt-0.5">{report.land_record_identifier}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">{text(t.common.khatianNo)}</span>
            <span className="font-mono font-semibold text-slate-800 block mt-0.5">{report.khatian_no || (language === 'bn' ? 'অনুপস্থিত' : 'Missing')}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">{text(t.common.dagNo)}</span>
            <span className="font-mono font-semibold text-slate-800 block mt-0.5">{report.plot_no}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">{text(t.common.mouza)}</span>
            <span className="font-semibold text-slate-800 block mt-0.5">{report.mouza}</span>
          </div>
        </div>

        {/* Overall Verdict & Recommended Next Steps */}
        <div className={`p-5 rounded-xl border ${
          report.risk_band === 'HIGH' ? 'bg-rose-50/70 border-rose-200 text-rose-950' :
          report.risk_band === 'MEDIUM' ? 'bg-amber-50/70 border-amber-200 text-amber-950' :
          'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}>
          <h2 className="text-base font-bold mb-1.5 flex items-center gap-2">
            {report.risk_band === 'HIGH' ? <AlertOctagon className="w-5 h-5 text-rose-600" /> :
             report.risk_band === 'MEDIUM' ? <Info className="w-5 h-5 text-amber-600" /> :
             <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {report.screening_status}
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed mt-2">
            <strong>{language === 'bn' ? 'প্রস্তাবিত পদক্ষেপ ও সতর্কতা:' : 'Recommended Due Diligence Protocol:'}</strong> {report.recommended_next_steps}
          </p>
        </div>

        {/* Rule Engine Diagnostic Findings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
            {language === 'bn' ? `রুল ইঞ্জিন ডায়াগনস্টিক ফলাফল (${findings.length}টি)` : `Rule Engine Diagnostic Findings (${findings.length})`}
          </h3>

          {findings.length === 0 ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{text(t.verifyPage.noFindings)}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {findings.map((finding, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RiskBadge band={finding.severity} size="sm" />
                      <h4 className="font-bold text-xs text-slate-900">{finding.title}</h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      +{finding.points} {language === 'bn' ? 'পয়েন্ট' : 'pts'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{finding.explanation}</p>

                  {finding.evidence && Object.keys(finding.evidence).length > 0 && (
                    <div className="bg-slate-900 rounded-lg p-3 text-slate-300 font-mono text-[11px] overflow-x-auto">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block mb-1">
                        {language === 'bn' ? 'সম্পর্কযুক্ত অডিট প্রমাণক:' : 'Relational Audit Evidence:'}
                      </span>
                      <pre className="whitespace-pre-wrap">{JSON.stringify(finding.evidence, null, 2)}</pre>
                    </div>
                  )}

                  {finding.suggested_action && (
                    <p className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200">
                      <strong>{language === 'bn' ? 'প্রয়োজনীয় পদক্ষেপ:' : 'Required Action:'}</strong> {finding.suggested_action}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matrix of All 7 Performed Checks */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
            {language === 'bn' ? 'সম্পাদিত ভেরিফিকেশন ম্যাট্রিক্স' : 'Executed Verification Matrix'}
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            {checksPerformed.map((chk, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{chk.check_id}</span>
                    <span className="font-bold text-slate-800">{chk.name}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{chk.description}</p>
                </div>
                <div>
                  {triggeredRules.some((r) => r.includes(chk.check_id.replace('CHK_', ''))) ? (
                    <span className="font-bold text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase">
                      {language === 'bn' ? 'অসঙ্গতি চিহ্নিত' : 'Triggered'}
                    </span>
                  ) : (
                    <span className="font-bold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                      {language === 'bn' ? 'পাস / নিরাপদ' : 'Pass'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Legal & Prototype Disclaimer Footer */}
        <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed space-y-2 bg-slate-50 p-5 rounded-xl">
          <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            {language === 'bn' ? 'সংবিধিবদ্ধ ডেমো নোটিশ' : 'Statutory Demonstration Disclaimer'}
          </p>
          <p>{report.disclaimer}</p>
          <p>
            {language === 'bn'
              ? 'এই স্বয়ংক্রিয় অডিট রিপোর্টটি ল্যান্ডটেক ২০২৬ হ্যাকাথনের সমস্যা ৩ — জালিয়াতি ও দ্বৈত-বিক্রয় শনাক্তকরণ ডেমোর উদ্দেশ্যে প্রস্তুত করা হয়েছে। ঝুঁকি স্কোর রুল-ভিত্তিক সতর্কবার্তা মাত্র, কোনো আদালতের চূড়ান্ত আইনি রায় বা ফৌজদারি প্রমাণ নয়।'
              : 'This automated audit report is generated algorithmically for demonstration of problem statement P3 — Fraud & Double-Selling Detection. Risk scores are rule-based screening indicators and do not represent statistical probabilities of criminal fraud. Low scores do not certify that a property is legally encumbrance-free.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
