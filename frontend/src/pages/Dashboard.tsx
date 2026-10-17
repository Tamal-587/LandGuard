import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  GitFork,
  Search,
  RefreshCw,
  Layers,
  ShieldAlert,
  ChevronRight,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

import { api } from '../services/api';
import { DashboardStats, VerificationReport } from '../types';
import { StatCard } from '../components/StatCard';
import { RiskBadge } from '../components/RiskBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { RuralIllustration } from '../components/RuralIllustration';
import { useLanguage } from '../context/LanguageContext';

export const Dashboard: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboardStats();
      setData(res);
    } catch (err: any) {
      setError(err.message || (language === 'bn' ? 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।' : 'Failed to connect to backend service.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">{text(t.dashboard.loadingStats)}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl p-8 border border-rose-200 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">{text(t.dashboard.errorTitle)}</h3>
        <p className="text-xs text-slate-500 mt-2 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          {text(t.dashboard.retry)}
        </button>
      </div>
    );
  }

  const { summary, recent_reports, recent_alerts } = data;

  // Use mutually exclusive categories that sum to the real record total.
  const totalCount = Math.max(0, Number(summary.total_records) || 0);
  const highRiskCount = Math.min(totalCount, Math.max(0, Number(summary.high_risk_cases) || 0));
  const mediumRiskCount = Math.min(Math.max(0, totalCount - highRiskCount), Math.max(0, Number(summary.medium_risk_cases) || 0));
  const lowRiskCount = Math.min(Math.max(0, totalCount - highRiskCount - mediumRiskCount), Math.max(0, Number(summary.no_conflict_cases) || 0));
  const noRiskCount = Math.max(0, totalCount - highRiskCount - mediumRiskCount - lowRiskCount);

  const donutData = [
    { name: language === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Risk', value: highRiskCount, color: '#EF4444' },
    { name: language === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium Risk', value: mediumRiskCount, color: '#F59E0B' },
    { name: language === 'bn' ? 'কম ঝুঁকি' : 'Low Risk', value: lowRiskCount, color: '#10B981' },
    { name: language === 'bn' ? 'ঝুঁকিমুক্ত' : 'No Risk', value: noRiskCount, color: '#CBD5E1' },
  ].map((item) => ({ ...item, pct: totalCount > 0 ? ((item.value / totalCount) * 100).toFixed(1) : '0.0' }));

  // Helper to map report verdict to badge style
  const getVerdictBadge = (band: string, findingsJson?: string) => {
    const norm = band.toUpperCase();
    if (norm === 'HIGH') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          {language === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Risk'}
        </span>
      );
    }
    if (norm === 'MEDIUM') {
      const hasMutation = findingsJson && findingsJson.includes('MUTATION');
      if (hasMutation) {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            {language === 'bn' ? 'নামজারি অমিল' : 'Mismatch'}
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          {language === 'bn' ? 'সন্দেহজনক' : 'Suspicious'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        {language === 'bn' ? 'বৈধ ও সুরক্ষিত' : 'Valid'}
      </span>
    );
  };

  // Helper for check type display
  const getCheckType = (report: VerificationReport) => {
    try {
      const rules = JSON.parse(report.triggered_rules_json || '[]');
      if (rules.includes('CONFLICTING_ACTIVE_SALES') || rules.includes('CONFLICTING_OWNERSHIP_TRANSFERS')) {
        return language === 'bn' ? 'দ্বৈত বিক্রয়' : 'Double-Selling';
      }
      if (rules.includes('MUTATION_MISMATCH')) {
        return language === 'bn' ? 'নামজারি যাচাই' : 'Mutation Check';
      }
      if (rules.includes('OWNERSHIP_CHAIN_INCONSISTENCY')) {
        return language === 'bn' ? 'হস্তান্তর বিশ্লেষণ' : 'Transfer Analysis';
      }
      if (rules.includes('DOC_HASH_MISMATCH')) {
        return language === 'bn' ? 'দলিল অখণ্ডতা' : 'Document';
      }
    } catch {
      // fallback
    }
    return language === 'bn' ? 'পূর্ণাঙ্গ স্ক্রিনিং' : 'Full Screening';
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Disclaimer Banner */}
      <DisclaimerBanner compact />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            {text(t.dashboard.title)}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {text(t.dashboard.subtitle)}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/records"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200/90 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>{text(t.nav.searchLand)}</span>
          </Link>
          <Link
            to="/verify"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{text(t.nav.verifyLand)}</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={text(t.dashboard.totalRecords)}
          value={summary.total_records.toLocaleString()}
          subtitle={language === 'bn' ? 'নিবন্ধিত সিন্থেটিক পার্সেল' : 'Synthetic registered parcels'}
          icon={Layers}
          variant="emerald"
          change={{ value: '12%', isPositive: true }}
        />
        <StatCard
          title={text(t.dashboard.highRiskCases)}
          value={summary.high_risk_cases.toLocaleString()}
          subtitle={language === 'bn' ? 'পরস্পরবিরোধী দলিল চিহ্নিত' : 'Confirmed clashing deeds'}
          icon={AlertOctagon}
          variant="rose"
          change={{ value: '6%', isPositive: false, isGood: true }}
        />
        <StatCard
          title={language === 'bn' ? 'যাচাইকৃত দলিল' : 'Documents Verified'}
          value={(summary.documents_verified ?? summary.records_screened).toLocaleString()}
          subtitle={language === 'bn' ? 'ক্রিপ্টোগ্রাফিক SHA-256 পরীক্ষা' : 'Cryptographic SHA-256 checks'}
          icon={FileCheck}
          variant="blue"
          change={{ value: '22%', isPositive: true }}
        />
        <StatCard
          title={language === 'bn' ? 'রেকর্ড অসঙ্গতি' : 'Record Mismatches'}
          value={(summary.record_mismatches ?? summary.medium_risk_cases).toLocaleString()}
          subtitle={language === 'bn' ? 'নামজারি ও ধারাবাহিকতার ফাঁক' : 'Namzari & chain inconsistencies'}
          icon={GitFork}
          variant="amber"
          change={{ value: '4%', isPositive: false }}
        />
      </div>

      {/* Middle Row: Recent Activity Table + Risk Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Recent Verification Activity Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {text(t.dashboard.recentReports)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {language === 'bn' ? 'সিন্থেটিক রেকর্ডের সর্বশেষ রুল-ভিত্তিক স্ক্রিনিং ফলাফল' : 'Latest rule-based screening outcomes from synthetic records'}
                </p>
              </div>

              <Link
                to="/reports"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                {text(t.dashboard.viewAllReports)}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{language === 'bn' ? 'আইডি' : 'ID'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'ধরণ' : 'Type'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'পার্সেল / দলিল নং' : 'Parcel / Deed No.'}</th>
                    <th className="py-3 px-4">{text(t.common.status)}</th>
                    <th className="py-3 px-4">{text(t.common.date)}</th>
                    <th className="py-3 px-4 text-right">{text(t.common.actions)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent_reports && recent_reports.length > 0 ? (
                    recent_reports.map((report, idx) => (
                      <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-600">
                          #{String(idx + 1).padStart(3, '0')}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {getCheckType(report)}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-emerald-800">
                          {report.land_record_identifier || `REC-${report.land_record_id}`}
                        </td>
                        <td className="py-3 px-4">
                          {getVerdictBadge(report.risk_band, report.findings_json)}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-medium">
                          {new Date(report.created_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/reports/${report.id}`}
                            className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
                          >
                            {text(t.common.details)}
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {language === 'bn' ? 'কোনো যাচাই প্রতিবেদন পাওয়া যায়নি।' : 'No screening reports recorded yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'bn' ? 'সিন্থেটিক ভূমি ডাটাবেজের সাথে সামঞ্জস্যপূর্ণ তথ্য প্রদর্শিত হচ্ছে' : 'Showing verified activity against synthetic land database'}</span>
            <Link to="/verify" className="text-emerald-700 hover:underline font-semibold">
              {language === 'bn' ? 'নতুন পার্সেল যাচাই করুন →' : 'Screen another parcel →'}
            </Link>
          </div>
        </div>

        {/* Right: Risk Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {text(t.dashboard.riskDistribution)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'bn' ? 'সকল ইনডেক্সকৃত সিন্থেটিক পার্সেলের পরিসংখ্যান' : 'Breakdown across all indexed synthetic parcels'}
            </p>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-center">
            {/* Donut Chart with central record count */}
            <div className="relative w-full h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val} ${language === 'bn' ? 'রেকর্ড' : 'records'}`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '11px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Central Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {totalCount}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {language === 'bn' ? 'মোট রেকর্ড' : 'Records'}
                </span>
              </div>
            </div>

            {/* Legend breakdown list */}
            <div className="mt-4 space-y-2 px-2">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.color }}
                    ></span>
                    <span className="text-slate-700">{d.name}</span>
                  </div>
                  <span className="text-slate-500 font-semibold">
                    {d.value} <span className="text-slate-400 font-normal">({d.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rural Bangladesh village illustration */}
          <div className="border-t border-slate-100 bg-[#F4F8F4] overflow-hidden">
            <RuralIllustration className="opacity-90" />
          </div>
        </div>
      </div>

      {/* Priority Fraud Alerts Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              {text(t.dashboard.recentAlerts)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'bn' ? 'সহকারী কমিশনার (ভূমি) বা সাব-রেজিস্ট্রারদের বিবেচনার জন্য উত্থাপিত অসঙ্গতি' : 'Explainable anomalies requiring review by AC Land or Sub-Registry officers'}
            </p>
          </div>
          <Link
            to="/alerts"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
          >
            <span>{text(t.dashboard.viewAllAlerts)}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent_alerts && recent_alerts.length > 0 ? (
            recent_alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {alert.alert_ref}
                    </span>
                    <RiskBadge band={alert.risk_band} score={alert.risk_score} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-emerald-800 font-semibold">
                    {alert.land_record_identifier || `Parcel ${alert.land_record_id}`}
                  </span>
                  <Link
                    to={`/alerts?record_id=${encodeURIComponent(alert.land_record_identifier || '')}`}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
                  >
                    {language === 'bn' ? 'তদন্ত করুন →' : 'Investigate →'}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 col-span-3 text-center">
              {language === 'bn' ? 'সিন্থেটিক ডেটায় কোনো খোলা অ্যালার্ট নেই।' : 'No open fraud alerts found in synthetic dataset.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
