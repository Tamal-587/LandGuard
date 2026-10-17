import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  X,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { FraudAlert } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';

export const FraudAlerts: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterRecordId = searchParams.get('record_id') || '';

  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [riskBand, setRiskBand] = useState('');
  const [alertType, setAlertType] = useState('');
  const [status, setStatus] = useState('');
  const [recordIdQuery, setRecordIdQuery] = useState(filterRecordId);

  // Detail Modal
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.getFraudAlerts({
        risk_band: riskBand || undefined,
        alert_type: alertType || undefined,
        status: status || undefined,
        record_id: recordIdQuery || undefined,
        limit: 100,
      });
      setAlerts(res.alerts);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [riskBand, alertType, status, recordIdQuery]);

  const handleOpenAlert = (alert: FraudAlert) => {
    setSelectedAlert(alert);
    setReviewerNotes(alert.reviewer_notes || '');
    setUpdateMessage(null);
  };

  const handleUpdateStatus = async (newStatus: 'REVIEWED' | 'UNRESOLVED' | 'OPEN') => {
    if (!selectedAlert) return;
    setUpdating(true);
    setUpdateMessage(null);
    try {
      const res = await api.updateFraudAlert(selectedAlert.id, newStatus, reviewerNotes);
      setSelectedAlert(res.alert);
      setUpdateMessage(text(t.alertsPage.updateSuccess));
      fetchAlerts();
    } catch (err: any) {
      setUpdateMessage(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleResetFilters = () => {
    setRiskBand('');
    setAlertType('');
    setStatus('');
    setRecordIdQuery('');
    setSearchParams({});
  };

  const formatStatus = (s: string) => {
    if (s === 'OPEN') return language === 'bn' ? 'উন্মুক্ত (সক্রিয়)' : 'OPEN';
    if (s === 'REVIEWED') return language === 'bn' ? 'পর্যালোচিত' : 'REVIEWED';
    return language === 'bn' ? 'অমীমাংসিত' : 'UNRESOLVED';
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {text(t.alertsPage.title)}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {text(t.alertsPage.subtitle)}
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          {language === 'bn' ? 'মোট অ্যালার্ট সংখ্যা:' : 'Active Alerts:'} <strong className="text-slate-800">{total}</strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>{text(t.common.filter)}:</span>
        </div>

        <input
          type="text"
          value={recordIdQuery}
          onChange={(e) => setRecordIdQuery(e.target.value)}
          placeholder={language === 'bn' ? 'পার্সেল আইডি লিখুন...' : 'Filter by Parcel (e.g. LR-DHK-2024-002)...'}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
        />

        <select
          value={riskBand}
          onChange={(e) => setRiskBand(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">{language === 'bn' ? 'সকল ঝুঁকি মাত্রা' : 'All Risk Bands'}</option>
          <option value="HIGH">{language === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Risk'}</option>
          <option value="MEDIUM">{language === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium Risk'}</option>
          <option value="LOW">{language === 'bn' ? 'কম ঝুঁকি' : 'Low Risk'}</option>
        </select>

        <select
          value={alertType}
          onChange={(e) => setAlertType(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">{language === 'bn' ? 'সকল সতর্কতার ধরণ' : 'All Alert Types'}</option>
          <option value="CONFLICTING_ACTIVE_SALES">{language === 'bn' ? 'দ্বৈত বিক্রয় সংঘাত' : 'Conflicting Active Sales (Double-Selling)'}</option>
          <option value="CONFLICTING_OWNERSHIP_TRANSFERS">{language === 'bn' ? 'পূর্ববর্তী হস্তান্তরে সংঘাত' : 'Conflicting Prior Transfers'}</option>
          <option value="OWNERSHIP_CHAIN_INCONSISTENCY">{language === 'bn' ? 'মালিকানা চেইনের ফাঁক' : 'Ownership Chain Inconsistency'}</option>
          <option value="MUTATION_MISMATCH">{language === 'bn' ? 'নামজারি রেকর্ডের অমিল' : 'Mutation Record Mismatch'}</option>
          <option value="DOC_HASH_MISMATCH">{language === 'bn' ? 'দলিলের হ্যাশ অমিল' : 'Document Hash Mismatch'}</option>
          <option value="DUPLICATE_TXN_REF">{language === 'bn' ? 'ডুপ্লিকেট ট্রানজাকশন নম্বর' : 'Duplicate Transaction Reference'}</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">{language === 'bn' ? 'সকল অবস্থা' : 'All Statuses'}</option>
          <option value="OPEN">{language === 'bn' ? 'উন্মুক্ত / অপর্যালোচিত' : 'Open (Unreviewed)'}</option>
          <option value="REVIEWED">{language === 'bn' ? 'পর্যালোচিত' : 'Reviewed'}</option>
          <option value="UNRESOLVED">{language === 'bn' ? 'অমীমাংসিত' : 'Unresolved / Escalated'}</option>
        </select>

        <button
          onClick={handleResetFilters}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors ml-auto"
        >
          {language === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filters'}
        </button>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">{language === 'bn' ? 'ঝুঁকি সতর্কতা লোড হচ্ছে...' : 'Loading fraud risk telemetry...'}</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">{language === 'bn' ? 'কোনো অ্যালার্ট পাওয়া যায়নি' : 'No Matching Fraud Alerts Found'}</h3>
            <p className="text-xs text-slate-400">{language === 'bn' ? 'নির্বাচিত ফিল্টারে কোনো সক্রিয় সতর্কতা নেই।' : 'All filtered records appear consistent or have no active alerts.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">{language === 'bn' ? 'রেফারেন্স' : 'Alert Ref'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'পার্সেল আইডি' : 'Parcel Ref'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'অ্যালার্ট বিবরণ' : 'Alert Type / Title'}</th>
                  <th className="py-3 px-4">{text(t.common.riskBand)}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'শনাক্তের সময়' : 'Detection Timestamp'}</th>
                  <th className="py-3 px-4">{text(t.common.status)}</th>
                  <th className="py-3 px-4 text-right">{text(t.common.actions)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{alert.alert_ref}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                      <Link to={`/records/${alert.land_record_identifier || ''}`} className="hover:underline">
                        {alert.land_record_identifier || `Record #${alert.land_record_id}`}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 truncate">{alert.title}</p>
                      <span className="text-[10px] font-mono uppercase text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {alert.alert_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge band={alert.risk_band} score={alert.risk_score} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(alert.detected_at).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-GB')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        alert.status === 'OPEN' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                        alert.status === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {formatStatus(alert.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenAlert(alert)}
                        className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded transition-colors font-semibold"
                      >
                        {language === 'bn' ? 'পর্যালোচনা' : 'Inspect & Review'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Alert Details & Action Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-[#0b271d] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-900/70 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                  {selectedAlert.alert_type}
                </span>
                <h3 className="text-base font-bold mt-1">{selectedAlert.title}</h3>
                <p className="text-xs text-slate-300 font-mono">{language === 'bn' ? 'রেফারেন্স:' : 'Reference:'} {selectedAlert.alert_ref}</p>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">{language === 'bn' ? 'সংশ্লিষ্ট পার্সেল' : 'Related Synthetic Parcel'}</span>
                  <Link
                    to={`/records/${selectedAlert.land_record_identifier || ''}`}
                    className="font-mono font-bold text-emerald-800 text-xs flex items-center gap-1 hover:underline"
                  >
                    {selectedAlert.land_record_identifier || `ID ${selectedAlert.land_record_id}`}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{language === 'bn' ? 'গণনাকৃত প্রভাব' : 'Calculated Impact'}</span>
                  <RiskBadge band={selectedAlert.risk_band} score={selectedAlert.risk_score} size="md" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{text(t.common.status)}</span>
                  <span className="text-xs font-bold font-mono">{formatStatus(selectedAlert.status)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'রুল ফাইন্ডিংসের বিবরণ' : 'Rule Finding Explanation'}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                  {selectedAlert.description}
                </p>
              </div>

              {selectedAlert.evidence_json && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'bn' ? 'সংযুক্ত তথ্য-প্রমাণ' : 'Synthetic Evidence Registry'}
                  </h4>
                  <pre className="text-[11px] font-mono bg-slate-900 text-slate-300 p-3 rounded-lg overflow-x-auto max-h-48 whitespace-pre-wrap">
                    {selectedAlert.evidence_json}
                  </pre>
                </div>
              )}

              {/* Reviewer Action Form */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {text(t.alertsPage.reviewNotesLabel)}
                </h4>
                <textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'তদন্তকারী কর্মকর্তার পর্যালোচনা মন্তব্য এখানে লিখুন...' : 'Enter investigator review notes, cross-reference with deed book...'}
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  rows={3}
                />

                {updateMessage && (
                  <div className="p-2.5 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                    {updateMessage}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleUpdateStatus('REVIEWED')}
                    disabled={updating}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition shadow-sm"
                  >
                    {text(t.alertsPage.markReviewed)}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('UNRESOLVED')}
                    disabled={updating}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition shadow-sm"
                  >
                    {text(t.alertsPage.markUnresolved)}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('OPEN')}
                    disabled={updating}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 transition"
                  >
                    {text(t.alertsPage.reopen)}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {text(t.common.close)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudAlerts;
