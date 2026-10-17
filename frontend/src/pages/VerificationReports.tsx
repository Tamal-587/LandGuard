import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, RefreshCw, Eye, Filter, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { VerificationReport } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';

export const VerificationReports: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [reports, setReports] = useState<VerificationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('');
  const [total, setTotal] = useState(0);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.getVerificationReports({
        risk_band: riskFilter || undefined,
        limit: 100,
      });
      setReports(res.reports);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [riskFilter]);

  return (
    <div className="space-y-6">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {text(t.reports.title)}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {text(t.reports.subtitle)}
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          {text(t.reports.archivedCount)} <strong className="text-slate-800">{total}</strong>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">{text(t.reports.filterRisk)}</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">{language === 'bn' ? 'সকল ঝুঁকি মাত্রা' : 'All Risk Bands'}</option>
            <option value="HIGH">{language === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Risk Alert'}</option>
            <option value="MEDIUM">{language === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium Risk Warning'}</option>
            <option value="LOW">{language === 'bn' ? 'কম ঝুঁকি' : 'Low Risk Consistent'}</option>
          </select>
        </div>

        <Link
          to="/verify"
          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন যাচাইকরণ' : 'New Verification'}</span>
        </Link>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">
              {language === 'bn' ? 'সংরক্ষিত যাচাইকরণ রিপোর্ট লোড হচ্ছে...' : 'Loading archived verification reports...'}
            </p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {language === 'bn' ? 'কোনো রিপোর্ট পাওয়া যায়নি' : 'No Reports Found'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'যেকোনো সিন্থেটিক ভূমি রেকর্ড যাচাই করে রিপোর্ট তৈরি করুন।' : 'Run a verification on any synthetic land record to generate a report.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">{language === 'bn' ? 'রিপোর্ট রেফারেন্স' : 'Report Reference'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'পার্সেল আইডি' : 'Target Parcel'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'স্ক্রিনিং ফলাফল' : 'Screening Verdict'}</th>
                  <th className="py-3 px-4">{text(t.common.riskBand)}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'তৈরির সময়' : 'Generated Timestamp'}</th>
                  <th className="py-3 px-4 text-right">{text(t.common.actions)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{rep.report_ref}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      <Link to={`/records/${rep.land_record_identifier || ''}`} className="hover:underline">
                        {rep.land_record_identifier || `ID ${rep.land_record_id}`}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-slate-800">
                      {rep.screening_status}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge band={rep.risk_band} score={rep.risk_score} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(rep.created_at).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-GB')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/reports/${rep.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded transition-colors font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'ডসিয়ার দেখুন' : 'Inspect Dossier'}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationReports;
