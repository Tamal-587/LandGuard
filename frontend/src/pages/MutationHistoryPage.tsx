import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { LandRecord } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';

export const MutationHistoryPage: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await api.getLandRecords({ limit: 100 });
      setRecords(res.records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="space-y-6">
      <DisclaimerBanner compact />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {text(t.mutations.title)}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {text(t.mutations.subtitle)}
        </p>
      </div>

      {/* Explanatory Rule Box */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-4 h-4 text-emerald-700" />
          {text(t.mutations.criteriaTitle)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">
              {language === 'bn' ? 'ক. বিক্রয় পরবর্তী নামজারি অনুপস্থিতি' : 'A. Missing Mutation Post-Sale'}
            </strong>
            {language === 'bn'
              ? '১৮০ দিনের বেশি পূর্বে সম্পাদিত রেজিস্ট্রি দলিলের বিপরীতে অনুমোদিত নামজারি আবেদন না থাকলে সতর্কবার্তা দেওয়া হয়।'
              : 'Completed deeds over 180 days old without corresponding approved or pending mutation application are flagged.'}
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">
              {language === 'bn' ? 'খ. অনিয়মিত নামজারি মামলা' : 'B. Irregular Namzari Cases'}
            </strong>
            {language === 'bn'
              ? 'দাখিলা অনুপস্থিতি, ভুল খতিয়ান বা সীমানা পরচা রদবদলের অডিট মন্তব্য সম্বলিত আবেদনগুলো চিহ্নিত করা হয়।'
              : 'Mutation applications flagged with auditor remarks (missing Dakhila, altered boundary Porcha) are highlighted.'}
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">
              {language === 'bn' ? 'গ. রেকর্ডভুক্ত মালিকের নামের গরমিল' : 'C. Owner Name Disconnect'}
            </strong>
            {language === 'bn'
              ? 'সর্বশেষ অনুমোদিত নামজারির আবেদনকারীর নামের সাথে বর্তমান রেকর্ডভুক্ত মালিকের অমিল থাকলে চিহ্নিত হয়।'
              : 'Parcels where current recorded owner differs from the most recent approved mutation applicant.'}
          </div>
        </div>
      </div>

      {/* Parcels With Mutation Status */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {language === 'bn' ? 'সিন্থেটিক ভূমি পার্সেল ও নামজারি অবস্থা' : 'Synthetic Land Parcels & Mutation Status'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'সিন্থেটিক ডেটাসেট জুড়ে নামজারি তথ্যের সামঞ্জস্য পর্যালোচনা করুন' : 'Review mutation synchronization across the synthetic dataset'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">{language === 'bn' ? 'সকল পার্সেল' : 'All Parcels'}</option>
              <option value="Active">{language === 'bn' ? 'সক্রিয় / সুসংগত' : 'Active / Consistent'}</option>
              <option value="Disputed">{language === 'bn' ? 'বিতর্কিত / উচ্চ ঝুঁকি' : 'Disputed / High Risk'}</option>
              <option value="Review">{language === 'bn' ? 'বিচারাধীন' : 'Under Review'}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-2">
            <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" />
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'নামজারি ডেটাবেজ অনুসন্ধান করা হচ্ছে...' : 'Querying mutation database...'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">{language === 'bn' ? 'পার্সেল আইডি' : 'Parcel Ref'}</th>
                  <th className="py-3 px-4">{text(t.common.khatianNo)}</th>
                  <th className="py-3 px-4">{text(t.common.dagNo)}</th>
                  <th className="py-3 px-4">{text(t.common.mouza)}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'বর্তমান মালিক' : 'Recorded Owner'}</th>
                  <th className="py-3 px-4">{text(t.common.status)}</th>
                  <th className="py-3 px-4 text-right">{text(t.common.actions)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {records
                  .filter((r) => !filterStatus || r.record_status.includes(filterStatus))
                  .map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{rec.record_id}</td>
                      <td className="py-3.5 px-4 font-mono">{rec.khatian_no || (language === 'bn' ? 'অনুপস্থিত' : 'Missing')}</td>
                      <td className="py-3.5 px-4 font-mono">{rec.plot_no}</td>
                      <td className="py-3.5 px-4">{rec.mouza}, {rec.district}</td>
                      <td className="py-3.5 px-4">{rec.recorded_owner?.full_name || (language === 'bn' ? 'অনির্ধারিত' : 'Unassigned')}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          rec.record_status.includes('High') || rec.record_status.includes('Disputed')
                            ? 'bg-rose-100 text-rose-800'
                            : rec.record_status.includes('Review')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {rec.record_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={`/records/${rec.record_id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                        >
                          {language === 'bn' ? 'নামজারি দেখুন' : 'View Mutations'}
                        </Link>
                        <Link
                          to={`/verify?record_id=${rec.record_id}`}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
                        >
                          {language === 'bn' ? 'যাচাই' : 'Screen'}
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

export default MutationHistoryPage;
