import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Database,
  ArrowLeft,
  ShieldCheck,
  User,
  FileText,
  History,
  Hash,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertOctagon,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';
import { LandRecord } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { DocumentHashModal } from '../components/DocumentHashModal';
import { useLanguage } from '../context/LanguageContext';

export const RecordDetails: React.FC = () => {
  const { language, t, text } = useLanguage();
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<LandRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'mutations' | 'documents' | 'reports'>('overview');

  // Document verify modal state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDocHash, setSelectedDocHash] = useState('');
  const [selectedDocTitle, setSelectedDocTitle] = useState('');

  const fetchRecord = async () => {
    if (!recordId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getLandRecordDetail(recordId);
      setRecord(res.record);
    } catch (err: any) {
      setError(err.message || (language === 'bn' ? 'ভূমি রেকর্ড লোড করা সম্ভব হয়নি।' : 'Failed to load land record.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [recordId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          {language === 'bn' ? 'সিন্থেটিক ভূমি রেকর্ড ডেটা লোড হচ্ছে...' : 'Retrieving synthetic land record data...'}
        </p>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="bg-white rounded-xl p-8 border border-rose-200 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">
          {language === 'bn' ? 'রেকর্ড পাওয়া যায়নি' : 'Record Not Found'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          {error || (language === 'bn' ? `'${recordId}' আইডির কোনো রেকর্ড ডেমো ডাটাবেজে পাওয়া যায়নি।` : `No record matching '${recordId}' found in demo database.`)}
        </p>
        <Link
          to="/records"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {language === 'bn' ? 'রেকর্ড তালিকায় ফিরে যান' : 'Back to Records Registry'}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DisclaimerBanner compact />

      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/records"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
                {record.record_id}
              </h1>
              <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                record.record_status.includes('High') || record.record_status.includes('Disputed')
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : record.record_status.includes('Review')
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {record.record_status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn' ? `মৌজা: ${record.mouza}, জেলা: ${record.district} • বিভাগ: ${record.division}` : `Mouza ${record.mouza}, District ${record.district} • Division ${record.division}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/verify?record_id=${record.record_id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্বয়ংক্রিয় স্ক্রিনিং চালান' : 'Run Automated Screening'}</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex space-x-1 sm:space-x-4 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: language === 'bn' ? 'পার্সেল সারসংক্ষেপ' : 'Parcel Overview', icon: Database },
          { id: 'transactions', label: `${language === 'bn' ? 'হস্তান্তর দলিল' : 'Transactions'} (${record.transactions?.length || 0})`, icon: FileText },
          { id: 'mutations', label: `${language === 'bn' ? 'নামজারি ইতিহাস' : 'Mutation History'} (${record.mutations?.length || 0})`, icon: History },
          { id: 'documents', label: `${language === 'bn' ? 'দলিলের ডিজিটাল হ্যাশ' : 'Document Integrity'} (${record.documents?.length || 0})`, icon: Hash },
          { id: 'reports', label: `${language === 'bn' ? 'যাচাই রিপোর্ট' : 'Screening Reports'} (${record.verification_reports?.length || 0})`, icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Land Parcel Specifications Card */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {language === 'bn' ? 'জমির তফসিল ও পার্সেল পরিচিতি' : 'Land Schedule & Parcel Identifiers'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">{language === 'bn' ? 'রেকর্ড আইডি' : 'Record Identifier'}</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">{record.record_id}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">{text(t.common.khatianNo)}</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                  {record.khatian_no || <span className="text-rose-600 italic">{language === 'bn' ? 'অনুপস্থিত' : 'Missing / Unrecorded'}</span>}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">{text(t.common.dagNo)}</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">{record.plot_no}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">{language === 'bn' ? 'জমির শ্রেণী' : 'Land Classification'}</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{record.land_type}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">{language === 'bn' ? 'জমির পরিমাণ' : 'Surveyed Area'}</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{record.area_acres} {language === 'bn' ? 'একর' : 'Acres'} ({(record.area_acres * 100).toFixed(1)} {language === 'bn' ? 'শতক' : 'Decimal'})</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">{text(t.common.mouza)}</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{record.mouza}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 mb-2">{language === 'bn' ? 'প্রশাসনিক এখতিয়ার' : 'Administrative Authority'}</h4>
              <p className="text-xs text-slate-600">
                {language === 'bn'
                  ? `সহকারী কমিশনার (ভূমি) সার্কেল: এসি ল্যান্ড অফিস ${record.mouza} • সাব-রেজিস্ট্রি অফিস: সাব-রেজিস্ট্রি ${record.district} (ডেমো)`
                  : `AC Land Office Circle: AC Land Office ${record.mouza} • Sub-Registry Office: Sub-Registry ${record.district} (Demo)`}
              </p>
            </div>
          </div>

          {/* Recorded Owner Profile Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'bn' ? 'রেকর্ডভুক্ত মালিকের প্রোফাইল' : 'Recorded Owner Profile'}
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  {language === 'bn' ? 'সিন্থেটিক' : 'Synthetic'}
                </span>
              </div>

              {record.recorded_owner ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                    <User className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{record.recorded_owner.full_name}</p>
                      <p className="font-mono text-[11px] text-emerald-800 mt-0.5">ID: {record.recorded_owner.owner_id}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">{language === 'bn' ? 'জাতীয় পরিচয়পত্র রেফারেন্স' : 'Synthetic National ID Ref'}</span>
                      <span className="font-mono font-medium text-slate-700">{record.recorded_owner.synthetic_id_label}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{language === 'bn' ? 'যোগাযোগের ফোন নম্বর' : 'Contact Telephone (Masked)'}</span>
                      <span className="font-medium text-slate-700">{record.recorded_owner.phone_masked}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">{language === 'bn' ? 'বর্তমান ঠিকানা' : 'Recorded Domicile Address'}</span>
                      <span className="font-medium text-slate-700 leading-snug">{record.recorded_owner.address}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
                  <AlertOctagon className="w-4 h-4 mb-1 text-rose-600" />
                  <strong>{language === 'bn' ? 'মালিক নির্ধারিত নেই:' : 'No Active Owner Assigned:'}</strong>{' '}
                  {language === 'bn' ? 'এই সিন্থেটিক রেকর্ডে কোনো নির্দিষ্ট মালিকের প্রোফাইল পাওয়া যায়নি।' : 'This synthetic record has an unassigned ownership profile.'}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to={`/verify?record_id=${record.record_id}`}
                className="w-full inline-flex justify-center items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {language === 'bn' ? 'মালিকানা চেইন স্ক্রিনিং করুন' : 'Screen Owner & Title Chain'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {language === 'bn' ? 'ঐতিহাসিক ও বিচারাধীন দলিল হস্তান্তর' : 'Historical & Pending Deed Transactions'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? `পার্সেল ${record.record_id} এর ক্রমানুসারিক বিক্রয় ও হস্তান্তর তালিকা` : `Chronological conveyance registry for parcel ${record.record_id}`}
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {record.transactions?.length || 0} {language === 'bn' ? 'টি হস্তান্তর' : 'Transactions Found'}
            </span>
          </div>

          {!record.transactions || record.transactions.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">
              {language === 'bn' ? 'এই পার্সেলের কোনো দলিলের রেকর্ড পাওয়া যায়নি।' : 'No transaction records on file for this parcel.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">{language === 'bn' ? 'ট্রানজাকশন আইডি' : 'Txn Ref'}</th>
                    <th className="py-3 px-4">{text(t.common.deedNo)}</th>
                    <th className="py-3 px-4">{text(t.common.date)}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'বিক্রেতা' : 'Seller (Conveyer)'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'ক্রেতা' : 'Buyer (Recipient)'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'মূল্য (টাকা)' : 'Value (BDT)'}</th>
                    <th className="py-3 px-4">{text(t.common.status)}</th>
                    <th className="py-3 px-4">{text(t.common.notes)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {record.transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{txn.transaction_ref}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                        {txn.deed_number || <span className="text-rose-600 italic">{language === 'bn' ? 'অনুপস্থিত' : 'Missing'}</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{txn.deed_date}</td>
                      <td className="py-3.5 px-4">
                        {txn.seller ? txn.seller.full_name : <span className="text-slate-400 italic">{language === 'bn' ? 'মৌলিক রেকর্ড' : 'None (First Registry)'}</span>}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {txn.buyer ? txn.buyer.full_name : <span className="text-rose-600 italic">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        ৳{Number(txn.transaction_value_bdt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          txn.status === 'PENDING_REGISTRATION' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          txn.status === 'CANCELLED' ? 'bg-slate-200 text-slate-600' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                        {txn.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Mutations */}
      {activeTab === 'mutations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">{text(t.mutations.title)}</h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'সহকারী কমিশনার (ভূমি) অফিসের নামজারি কেস রেজিস্ট্রি' : 'Assistant Commissioner (Land) mutation case files'}
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {record.mutations?.length || 0} {language === 'bn' ? 'টি মামলা' : 'Cases'}
            </span>
          </div>

          {!record.mutations || record.mutations.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">
              {language === 'bn' ? 'এই পার্সেলের কোনো নামজারি মামলা পাওয়া যায়নি।' : 'No mutation case entries recorded for this parcel.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">{text(t.mutations.caseNo)}</th>
                    <th className="py-3 px-4">{text(t.mutations.applicant)}</th>
                    <th className="py-3 px-4">{text(t.mutations.prevOwner)}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'নতুন খতিয়ান' : 'New Khatian'}</th>
                    <th className="py-3 px-4">{text(t.mutations.appDate)}</th>
                    <th className="py-3 px-4">{text(t.mutations.apprDate)}</th>
                    <th className="py-3 px-4">{text(t.common.status)}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'মন্তব্য / অসঙ্গতি' : 'Remarks / Discrepancies'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {record.mutations.map((mut) => (
                    <tr key={mut.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{mut.mutation_case_no}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{mut.applicant_name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{mut.previous_owner_name}</td>
                      <td className="py-3.5 px-4 font-mono">{mut.new_khatian_no || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-500">{mut.application_date}</td>
                      <td className="py-3.5 px-4 text-slate-500">{mut.approval_date || (language === 'bn' ? 'বিচারাধীন' : 'Pending')}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          mut.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          mut.status === 'IRREGULAR' ? 'bg-rose-100 text-rose-800' :
                          mut.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {mut.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {mut.remarks || <span className="text-slate-400 italic">{language === 'bn' ? 'কোনো অসঙ্গতি নেই' : 'None noted'}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {language === 'bn' ? 'সংযুক্ত দলিল ও SHA-256 ক্রিপ্টোগ্রাফিক হ্যাশ' : 'Document References & SHA-256 Checksums'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'দলিল ও পরচার ডিজিটাল সততা সংরক্ষণের হ্যাশ রেকর্ড' : 'Stored cryptographic hashes for deed, porcha, and tax receipts'}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedDocHash('');
                setSelectedDocTitle('');
                setDocModalOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'দলিল হ্যাশ পরীক্ষা' : 'Test Document Hash'}</span>
            </button>
          </div>

          {!record.documents || record.documents.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">
              {language === 'bn' ? 'কোনো দলিলের ডিজিটাল হ্যাশ নিবন্ধিত নেই।' : 'No document reference checksums registered.'}
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {record.documents.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs">{doc.doc_title}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {doc.doc_type}
                      </span>
                      {doc.verified_hash ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {language === 'bn' ? 'হ্যাশ অটুট' : 'Hash Consistent'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 border border-rose-200">
                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                          {language === 'bn' ? 'হ্যাশ অমিল ফ্ল্যাগড' : 'Hash Mismatch Flagged'}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-slate-500 break-all">
                      SHA-256: {doc.reference_hash}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {language === 'bn' ? 'ফাইল:' : 'File:'} {doc.file_name} • {language === 'bn' ? 'নিবন্ধনের তারিখ:' : 'Registered on:'} {new Date(doc.upload_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDocHash(doc.reference_hash);
                      setSelectedDocTitle(doc.doc_title);
                      setDocModalOpen(true);
                    }}
                    className="self-start sm:self-auto px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Hash className="w-3 h-3" />
                    <span>{language === 'bn' ? 'হ্যাশ তুলনা করুন' : 'Compare Byte Hash'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Screening Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {language === 'bn' ? 'সংরক্ষিত যাচাইকরণ প্রতিবেদন' : 'Historical Screening Reports'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? `পার্সেল ${record.record_id} এর সংরক্ষিত স্ক্রিনিং ডসিয়ার` : `Archived verification dossiers for ${record.record_id}`}
              </p>
            </div>
            <Link
              to={`/verify?record_id=${record.record_id}`}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {language === 'bn' ? 'নতুন অডিট তৈরি করুন' : 'Generate New Audit'}
            </Link>
          </div>

          {!record.verification_reports || record.verification_reports.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">
              {language === 'bn' ? 'কোনো যাচাই প্রতিবেদন সংরক্ষিত নেই।' : 'No verification reports yet. Click above to run screening.'}
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {record.verification_reports.map((rep) => (
                <div key={rep.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-800 text-xs">{rep.report_ref}</span>
                      <RiskBadge band={rep.risk_band} score={rep.risk_score} size="sm" />
                      <span className="text-[11px] text-slate-400">
                        {new Date(rep.created_at).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-GB')}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800">{rep.screening_status}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{rep.recommended_next_steps}</p>
                  </div>
                  <Link
                    to={`/reports/${rep.id}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    <span>{language === 'bn' ? 'রিপোর্ট দেখুন' : 'View Report'}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Document Hash Verification Modal */}
      <DocumentHashModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        initialReferenceHash={selectedDocHash}
        initialDocumentTitle={selectedDocTitle}
      />
    </div>
  );
};

export default RecordDetails;
