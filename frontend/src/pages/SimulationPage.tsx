import React, { useEffect, useState } from 'react';
import { FlaskConical, ArrowRight, RefreshCw, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import type { LandRecord, SimulationResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

const bandClass = (band: string) =>
  band === 'HIGH' ? 'text-rose-700 bg-rose-50' : band === 'MEDIUM' ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50';

export const SimulationPage: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [recordId, setRecordId] = useState('');
  const [scenario, setScenario] = useState('CANCEL_DEED');
  const [deed, setDeed] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scenarios = [
    { value: 'CANCEL_DEED', label: language === 'bn' ? 'কাল্পনিকভাবে একটি দলিল বাতিল করুন' : 'Hypothetically cancel a deed' },
    { value: 'RESOLVE_MUTATION', label: language === 'bn' ? 'নামজারি অমিল সংশোধন করুন' : 'Resolve mutation mismatch' },
    { value: 'CORRECT_CHAIN', label: language === 'bn' ? 'মালিকানা ধারাবাহিকতা সংশোধন করুন' : 'Correct ownership chain' },
    { value: 'RESOLVE_ALL', label: language === 'bn' ? 'সকল কাল্পনিক সমস্যা সমাধান করুন' : 'Resolve all simulated issues' },
  ];

  useEffect(() => {
    api.getLandRecords({ limit: 100 })
      .then((r) => {
        setRecords(r.records);
        if (r.records[0]) setRecordId(r.records[0].record_id);
      })
      .catch((e) => setError(e.message));
  }, []);

  const run = async () => {
    if (!recordId) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await api.evaluateSimulation({ record_id: recordId, scenario, target_deed: deed || undefined }));
    } catch (e: any) {
      setError(e.message || (language === 'bn' ? 'সিমুলেশন পরিচালনা ব্যর্থ হয়েছে' : 'Simulation failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[.18em] font-bold text-emerald-700">
          {language === 'bn' ? 'সিনারিও বিশ্লেষণ' : 'Scenario analysis'}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">{text(t.simulator.title)}</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">{text(t.simulator.subtitle)}</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="lg-card p-6 space-y-5 xl:col-span-1">
          <div className="flex gap-3 items-center">
            <div className="bg-emerald-50 text-emerald-700 rounded-xl p-3">
              <FlaskConical />
            </div>
            <div>
              <h2 className="font-bold">{text(t.simulator.configTitle)}</h2>
              <p className="text-xs text-slate-500">{language === 'bn' ? 'সিন্থেটিক রেকর্ড মাত্র' : 'Synthetic records only'}</p>
            </div>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            {text(t.simulator.selectRecord)}
            <select
              value={recordId}
              onChange={(e) => {
                setRecordId(e.target.value);
                setResult(null);
              }}
              className="lg-input mt-2 w-full"
            >
              {records.map((r) => (
                <option key={r.id} value={r.record_id}>
                  {r.record_id} · {r.mouza}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            {text(t.simulator.selectScenario)}
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="lg-input mt-2 w-full"
            >
              {scenarios.map((s) => (
                <option value={s.value} key={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            {text(t.simulator.targetDeed)}
            <input
              value={deed}
              onChange={(e) => setDeed(e.target.value)}
              placeholder="e.g. D-205"
              className="lg-input mt-2 w-full"
            />
          </label>

          <button
            onClick={run}
            disabled={loading || !recordId}
            className="lg-button-primary w-full justify-center"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <FlaskConical size={16} />}
            <span>{text(t.simulator.runButton)}</span>
          </button>

          {error && <p className="text-sm text-rose-700">{error}</p>}
        </div>

        <div className="xl:col-span-2 space-y-5">
          {!result ? (
            <div className="lg-card min-h-80 p-8 flex flex-col items-center justify-center text-center">
              <FlaskConical size={36} className="text-emerald-600 mb-3" />
              <h2 className="font-bold text-lg">
                {language === 'bn' ? 'বর্তমান ও কাল্পনিক ফলাফলের তুলনা দেখুন' : 'Compare current and hypothetical results'}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mt-2">
                {language === 'bn'
                  ? 'একটি রেকর্ড ও সিনারিও নির্বাচন করে সিমুলেশন পরিচালনা করুন এবং রুল স্কোর পরিবর্তনের প্রভাব পর্যবেক্ষণ করুন।'
                  : 'Choose a record and scenario, then run the simulation to see before/after risk and rule changes.'}
              </p>
            </div>
          ) : (
            <>
              <div className="lg-card p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h2 className="font-bold text-lg">
                    {language === 'bn' ? 'সিমুলেশন ফলাফল' : 'Simulation result'} · {result.record_id}
                  </h2>
                  <span className="text-xs rounded-full bg-amber-50 text-amber-800 px-3 py-1 font-semibold">
                    {language === 'bn' ? 'কাল্পনিক মাত্র' : 'Hypothetical only'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">{text(t.simulator.currentAssessment)}</p>
                    <p className="text-4xl font-bold mt-2">
                      {result.before.score}
                      <span className="text-base text-slate-400">/100</span>
                    </p>
                    <span className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-bold ${bandClass(result.before.risk_band)}`}>
                      {result.before.risk_band}
                    </span>
                  </div>

                  <ArrowRight className="mx-auto text-slate-400" />

                  <div className="rounded-2xl bg-emerald-50/70 p-5">
                    <p className="text-sm text-slate-500">{text(t.simulator.afterSimulation)}</p>
                    <p className="text-4xl font-bold mt-2">
                      {result.after.score}
                      <span className="text-base text-slate-400">/100</span>
                    </p>
                    <span className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-bold ${bandClass(result.after.risk_band)}`}>
                      {result.after.risk_band}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-5">{result.scenario_explanation}</p>
                <p className="text-sm font-semibold mt-2">
                  {text(t.simulator.scoreDelta)} {result.score_delta > 0 ? '+' : ''}{result.score_delta}
                </p>
              </div>

              <div className="lg-card p-6">
                <h3 className="font-bold mb-4">{text(t.simulator.ruleComparison)}</h3>
                {result.rule_comparison.map((rule) => (
                  <div key={rule.rule_code} className="flex items-center justify-between gap-3 py-3 border-b last:border-0 border-slate-100">
                    <div>
                      <p className="text-sm font-semibold">{rule.rule_name}</p>
                      <p className="text-xs text-slate-500">{rule.rule_code}</p>
                    </div>
                    <span
                      className={`text-xs font-bold rounded-full px-3 py-1 ${
                        rule.resolved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {rule.resolved ? text(t.simulator.resolvedInScenario) : rule.after_status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex gap-3">
            <ShieldAlert className="shrink-0" />
            <p>
              <strong>{text(t.simulator.safetyNote)}</strong> {result?.disclaimer || text(t.simulator.disclaimer)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulationPage;
