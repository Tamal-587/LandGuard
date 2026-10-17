import React, { useEffect, useState } from 'react';
import { AlertTriangle, Dna, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { FraudDnaResponse, FraudDnaCluster } from '../types';
import { useLanguage } from '../context/LanguageContext';

const severityClass = (s: string) =>
  s === 'HIGH'
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : s === 'MEDIUM'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

export const FraudDnaPage: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [data, setData] = useState<FraudDnaResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError('');
    api.getFraudDnaClusters()
      .then(setData)
      .catch((e) => setError(e.message || (language === 'bn' ? 'প্যাটার্ন লোড করা সম্ভব হয়নি' : 'Could not load patterns')))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.18em] font-bold text-emerald-700">
            {language === 'bn' ? 'জালিয়াতি ইন্টেলিজেন্স' : 'Fraud intelligence'}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">{text(t.dna.title)}</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">{text(t.dna.subtitle)}</p>
        </div>
        <button onClick={load} className="lg-button-secondary">
          <RefreshCw size={16} /> {language === 'bn' ? 'প্যাটার্ন রিফ্রেশ' : 'Refresh patterns'}
        </button>
      </header>

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            [text(t.dna.patterns), data.total_clusters],
            [text(t.dna.highSeverity), data.summary.high_severity_patterns],
            [text(t.dna.flaggedParcels), data.summary.total_flagged_parcels],
          ].map(([label, value]) => (
            <div className="lg-card p-5" key={String(label)}>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-3xl font-bold mt-2">{value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="lg-card p-10 text-center text-slate-500">
          <RefreshCw className="animate-spin mx-auto mb-3" />
          {language === 'bn' ? 'ব্যাকএন্ড থেকে প্যাটার্ন লোড হচ্ছে...' : 'Loading patterns from the backend…'}
        </div>
      ) : error ? (
        <div className="lg-card p-6 text-rose-700">
          {error}
          <button onClick={load} className="ml-3 underline font-semibold">
            {language === 'bn' ? 'পুনরায় চেষ্টা' : 'Retry'}
          </button>
        </div>
      ) : !data?.clusters.length ? (
        <div className="lg-card p-8 text-slate-600">
          {language === 'bn' ? 'বর্তমান সিন্থেটিক ডেটায় কোনো পুনরাবৃত্ত প্যাটার্ন পাওয়া যায়নি।' : 'No cross-record patterns were returned by the current synthetic dataset.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {data.clusters.map((c: FraudDnaCluster) => (
            <article key={c.cluster_id} className="lg-card p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-50 text-emerald-700 p-3">
                  <Dna />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-900">{c.title}</h2>
                    <span className={`text-xs border rounded-full px-2 py-0.5 font-bold ${severityClass(c.severity)}`}>
                      {c.severity} {language === 'bn' ? 'ঝুঁকি' : 'SEVERITY'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {c.cluster_id} · {c.category}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-600">{c.pattern_summary}</p>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  {text(t.dna.recurringIndicators)}
                </p>
                <ul className="space-y-2">
                  {c.recurring_indicators.map((x) => (
                    <li className="flex gap-2 text-sm text-slate-700" key={x}>
                      <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-600 mb-2">{text(t.dna.recordedFacts)}</p>
                {c.verifiable_facts.map((x) => (
                  <p key={x} className="text-sm text-slate-600 mb-1">
                    • {x}
                  </p>
                ))}
                <p className="text-sm text-emerald-800 mt-3">
                  <strong>{text(t.dna.suggestedReview)}</strong> {c.recommended_action}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {c.affected_parcels.map((p) => (
                  <Link
                    key={p}
                    to={`/records/${encodeURIComponent(p)}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                  >
                    {p} <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 flex gap-2 items-start">
        <ShieldCheck size={15} className="shrink-0" />
        {language === 'bn'
          ? 'সিন্থেটিক ডেমো প্রদর্শন মাত্র। কোনো চিহ্নিত প্যাটার্ন সরাসরি আইনি মালিকানা বা অপরাধমূলক প্রতারণার প্রমাণ নির্ধারণ করে না।'
          : 'Synthetic demonstration only. A detected pattern does not establish legal ownership or criminal fraud.'}
      </p>
    </section>
  );
};

export default FraudDnaPage;
