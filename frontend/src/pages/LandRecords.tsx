import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  Database,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { LandRecord } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { CadastralMapPreview } from '../components/CadastralMapPreview';
import { useLanguage } from '../context/LanguageContext';

export const LandRecords: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search Mode Tab
  const [activeTab, setActiveTab] = useState<'location' | 'deed'>('location');

  // Location Tab Inputs
  const [district, setDistrict] = useState(searchParams.get('district') || 'Dhaka');
  const [upazila, setUpazila] = useState(searchParams.get('upazila') || 'Dhamrai');
  const [mouza, setMouza] = useState(searchParams.get('mouza') || 'Joypara');
  const [dagNo, setDagNo] = useState(searchParams.get('dag_no') || '125');
  const [khatianNo, setKhatianNo] = useState(searchParams.get('khatian_no') || '786');

  // Deed Tab Inputs
  const [deedNumber, setDeedNumber] = useState(searchParams.get('deed_number') || 'D-101');
  const [regYear, setRegYear] = useState('2022');
  const [office, setOffice] = useState('Dhamrai Sub-Registry');

  // Quick query string
  const quickQuery = searchParams.get('q') || '';

  // State
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Selected Parcel for Cadastral Map Preview
  const [previewParcel, setPreviewParcel] = useState<{
    id: string;
    dagNo: string;
    khatianNo: string;
    location: string;
    area: string;
  }>({
    id: 'P-2048',
    dagNo: '125',
    khatianNo: '786',
    location: 'Joypara, Dhamrai, Dhaka',
    area: '8.5',
  });

  const executeSearch = async () => {
    setLoading(true);
    try {
      if (quickQuery.trim()) {
        const res = await api.searchLandRecords({ q: quickQuery.trim() });
        setRecords(res.records);
        setTotal(res.total);
        if (res.records.length > 0) {
          const r = res.records[0];
          setPreviewParcel({
            id: r.record_id,
            dagNo: r.plot_no,
            khatianNo: r.khatian_no,
            location: `${r.mouza}, ${r.district}`,
            area: (r.area_acres * 100).toFixed(1),
          });
        }
      } else if (activeTab === 'deed' && deedNumber.trim()) {
        const res = await api.searchLandRecords({ deed_number: deedNumber.trim() });
        setRecords(res.records);
        setTotal(res.total);
        if (res.records.length > 0) {
          const r = res.records[0];
          setPreviewParcel({
            id: r.record_id,
            dagNo: r.plot_no,
            khatianNo: r.khatian_no,
            location: `${r.mouza}, ${r.district}`,
            area: (r.area_acres * 100).toFixed(1),
          });
        }
      } else {
        const res = await api.searchLandRecords({
          district: district || undefined,
          upazila: upazila || undefined,
          mouza: mouza || undefined,
          dag_no: dagNo || undefined,
          khatian_no: khatianNo || undefined,
        });
        setRecords(res.records);
        setTotal(res.total);
        if (res.records.length > 0) {
          const r = res.records[0];
          setPreviewParcel({
            id: r.record_id,
            dagNo: r.plot_no,
            khatianNo: r.khatian_no,
            location: `${r.mouza}, ${r.district}`,
            area: (r.area_acres * 100).toFixed(1),
          });
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [quickQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'location') {
      setSearchParams({
        district,
        upazila,
        mouza,
        dag_no: dagNo,
        khatian_no: khatianNo,
      });
    } else {
      setSearchParams({
        deed_number: deedNumber,
      });
    }
    executeSearch();
  };

  const handleReset = () => {
    setDistrict('');
    setUpazila('');
    setMouza('');
    setDagNo('');
    setKhatianNo('');
    setDeedNumber('');
    setSearchParams({});
    api.getLandRecords({ limit: 50 }).then((res) => {
      setRecords(res.records);
      setTotal(res.total);
    });
  };

  const handleSelectRecordForPreview = (r: LandRecord) => {
    setPreviewParcel({
      id: r.record_id,
      dagNo: r.plot_no,
      khatianNo: r.khatian_no,
      location: `${r.mouza}, ${r.district}`,
      area: (r.area_acres * 100).toFixed(1),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <DisclaimerBanner compact />

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
          {text(t.records.title)}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {text(t.records.subtitle)}
        </p>
      </div>

      {/* Main Search Panel & Cadastral Map Preview */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form Controls */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'location'
                    ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {text(t.records.locationTab)}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('deed')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'deed'
                    ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {text(t.records.deedTab)}
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              {activeTab === 'location' ? (
                <>
                  {/* Row 1: District, Upazila, Mouza */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {text(t.common.district)}
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      >
                        <option value="Dhaka">{language === 'bn' ? 'ঢাকা' : 'Dhaka'}</option>
                        <option value="Chattogram">{language === 'bn' ? 'চট্টগ্রাম' : 'Chattogram'}</option>
                        <option value="Sylhet">{language === 'bn' ? 'সিলেট' : 'Sylhet'}</option>
                        <option value="Rajshahi">{language === 'bn' ? 'রাজশাহী' : 'Rajshahi'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {text(t.common.upazila)}
                      </label>
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      >
                        <option value="Dhamrai">{language === 'bn' ? 'ধামরাই' : 'Dhamrai'}</option>
                        <option value="Savar">{language === 'bn' ? 'সাভার' : 'Savar'}</option>
                        <option value="Uttara">{language === 'bn' ? 'উত্তরা' : 'Uttara'}</option>
                        <option value="Gulshan">{language === 'bn' ? 'গুলশান' : 'Gulshan'}</option>
                        <option value="Badda">{language === 'bn' ? 'বাড্ডা' : 'Badda'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {text(t.common.mouza)}
                      </label>
                      <select
                        value={mouza}
                        onChange={(e) => setMouza(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      >
                        <option value="Joypara">{language === 'bn' ? 'জয়পাড়া' : 'Joypara'}</option>
                        <option value="Badda">{language === 'bn' ? 'বাড্ডা (ডেমো)' : 'Badda (Demo)'}</option>
                        <option value="Gulshan">{language === 'bn' ? 'গুলশান (ডেমো)' : 'Gulshan (Demo)'}</option>
                        <option value="Uttara">{language === 'bn' ? 'উত্তরা (ডেমো)' : 'Uttara (Demo)'}</option>
                        <option value="Dhamrai">{language === 'bn' ? 'ধামরাই (ডেমো)' : 'Dhamrai (Demo)'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Dag Number, Khatian Number, Search Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {text(t.common.dagNo)}
                      </label>
                      <input
                        type="text"
                        value={dagNo}
                        onChange={(e) => setDagNo(e.target.value)}
                        placeholder="e.g. 125"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {text(t.common.khatianNo)}
                      </label>
                      <input
                        type="text"
                        value={khatianNo}
                        onChange={(e) => setKhatianNo(e.target.value)}
                        placeholder="e.g. 786"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-4 flex items-center gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Search className="w-4 h-4" />
                        <span>{text(t.common.search)}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title={text(t.records.resetButton)}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Tab 2: By Deed Number */
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {text(t.common.deedNo)}
                    </label>
                    <input
                      type="text"
                      value={deedNumber}
                      onChange={(e) => setDeedNumber(e.target.value)}
                      placeholder="e.g. D-101 or DEED-2021-1001"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {language === 'bn' ? 'নিবন্ধন বছর' : 'Registration Year'}
                    </label>
                    <input
                      type="text"
                      value={regYear}
                      onChange={(e) => setRegYear(e.target.value)}
                      placeholder="e.g. 2022"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {language === 'bn' ? 'সাব-রেজিস্ট্রি অফিস' : 'Office'}
                    </label>
                    <input
                      type="text"
                      value={office}
                      onChange={(e) => setOffice(e.target.value)}
                      placeholder="Sub-Registry Office"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <Search className="w-4 h-4" />
                      <span>{text(t.common.search)}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Cadastral Map Preview */}
          <div className="lg:col-span-4">
            <CadastralMapPreview
              parcelId={previewParcel.id}
              dagNo={previewParcel.dagNo}
              khatianNo={previewParcel.khatianNo}
              location={previewParcel.location}
              areaDecimal={previewParcel.area}
              className="h-full min-h-[180px]"
            />
          </div>
        </div>
      </div>

      {/* Search Results Table Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {text(t.records.recordList)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'bn' ? `ভূমি ডাটাবেজের প্রাপ্ত ফলাফল (${total}টি রেকর্ড পাওয়া গেছে)` : `Matching synthetic records in land registry database (${total} results found)`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{language === 'bn' ? 'পার্সেল আইডি' : 'Parcel ID'}</th>
                <th className="py-3 px-4">{text(t.common.dagNo)}</th>
                <th className="py-3 px-4">{text(t.common.khatianNo)}</th>
                <th className="py-3 px-4">{text(t.common.area)}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'বর্তমান মালিক' : 'Current Owner'}</th>
                <th className="py-3 px-4">{text(t.common.status)}</th>
                <th className="py-3 px-4 text-right">{text(t.common.actions)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                    <span>{language === 'bn' ? 'সিন্থেটিক ভূমি রেকর্ড অনুসন্ধান করা হচ্ছে...' : 'Querying synthetic land database...'}</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">
                      {language === 'bn' ? 'কোনো রেকর্ড পাওয়া যায়নি' : 'No Matching Records Found'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'bn'
                        ? 'আপনার দেওয়া তথ্যের সাথে কোনো পার্সেল মেলেনি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।'
                        : 'No synthetic parcels match your query criteria. Try clearing filters or searching for "P-2048", "125", or "Dhamrai".'}
                    </p>
                  </td>
                </tr>
              ) : (
                records.map((r) => {
                  const isDisputed = r.record_status.toLowerCase().includes('disputed') || r.record_status.toLowerCase().includes('review');
                  const ownerName = r.recorded_owner ? r.recorded_owner.full_name.replace(' (Synthetic)', '') : 'Unknown';
                  const areaDecimal = (r.area_acres * 100).toFixed(1);

                  return (
                    <tr
                      key={r.id}
                      onClick={() => handleSelectRecordForPreview(r)}
                      className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                        {r.record_id}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {r.plot_no}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {r.khatian_no}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {areaDecimal}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {ownerName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isDisputed
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isDisputed ? (language === 'bn' ? 'বিতর্কিত' : 'Disputed') : (language === 'bn' ? 'সক্রিয়' : 'Active')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/records/${r.record_id}`}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-900 border border-emerald-200/60 transition-colors"
                        >
                          {text(t.common.details)}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LandRecords;
