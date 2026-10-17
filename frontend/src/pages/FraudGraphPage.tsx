import React, { useEffect, useState } from 'react';
import { Network, RefreshCw, AlertTriangle, FileText, UserRound, LandPlot, GitBranch } from 'lucide-react';
import { api } from '../services/api';
import type { FraudGraphData, GraphNode } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const FraudGraphPage: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [records, setRecords] = useState<{ record_id: string; mouza: string; district: string }[]>([]);
  const [recordId, setRecordId] = useState('');
  const [data, setData] = useState<FraudGraphData | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const typeMeta: Record<string, { label: string; icon: any; color: string }> = {
    parcel: {
      label: language === 'bn' ? 'ভূমি পার্সেল' : 'Land parcel',
      icon: LandPlot,
      color: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    },
    deed: {
      label: language === 'bn' ? 'দলিল / বিক্রয়' : 'Deed / transaction',
      icon: FileText,
      color: 'border-blue-200 bg-blue-50 text-blue-800',
    },
    owner: {
      label: language === 'bn' ? 'সিন্থেটিক মালিক' : 'Synthetic owner',
      icon: UserRound,
      color: 'border-cyan-200 bg-cyan-50 text-cyan-800',
    },
    mutation: {
      label: language === 'bn' ? 'নামজারি রেকর্ড' : 'Mutation record',
      icon: GitBranch,
      color: 'border-amber-200 bg-amber-50 text-amber-800',
    },
    alert: {
      label: language === 'bn' ? 'ঝুঁকি সতর্কতা' : 'Alert',
      icon: AlertTriangle,
      color: 'border-rose-200 bg-rose-50 text-rose-800',
    },
  };

  useEffect(() => {
    api.getLandRecords({ limit: 100 })
      .then((r) => {
        const rs = r.records;
        setRecords(rs);
        if (rs[0]) setRecordId(rs[0].record_id);
      })
      .catch((e) => setError(e.message));
  }, []);

  const load = async (id = recordId) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const d = await api.getFraudGraph(id);
      setData(d);
      setSelected(null);
    } catch (e: any) {
      setError(e.message || (language === 'bn' ? 'গ্রাফ লোড করা সম্ভব হয়নি' : 'Could not load graph'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recordId) load(recordId);
  }, [recordId]);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.18em] font-bold text-emerald-700">
            {language === 'bn' ? 'জালিয়াতি নেটওয়ার্ক ইন্টেলিজেন্স' : 'Fraud intelligence'}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">{text(t.graph.title)}</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">{text(t.graph.subtitle)}</p>
        </div>
        <div className="flex gap-2">
          <select className="lg-input" value={recordId} onChange={(e) => setRecordId(e.target.value)}>
            {records.map((r) => (
              <option key={r.record_id} value={r.record_id}>
                {r.record_id} · {r.mouza}
              </option>
            ))}
          </select>
          <button className="lg-button-secondary" onClick={() => load()}>
            <RefreshCw size={15} /> {text(t.common.refresh)}
          </button>
        </div>
      </header>

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            [text(t.graph.nodes), data.summary.total_nodes],
            [text(t.graph.relationships), data.summary.total_edges],
            [text(t.graph.conflicts), data.summary.conflicts_count],
          ].map(([k, v]) => (
            <div key={String(k)} className="lg-card p-5">
              <p className="text-sm text-slate-500">{k}</p>
              <p className="text-3xl font-bold mt-2">{v}</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="lg-card p-5 text-rose-700">
          {error}
          <button onClick={() => load()} className="ml-2 underline font-semibold">
            {language === 'bn' ? 'পুনরায় চেষ্টা' : 'Retry'}
          </button>
        </div>
      )}

      {loading && !data ? (
        <div className="lg-card p-12 text-center text-slate-500">
          <RefreshCw className="animate-spin mx-auto mb-3" />
          {text(t.common.loading)}
        </div>
      ) : (
        data && (
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-5">
            <div className="lg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Network className="text-emerald-700" />
                <h2 className="font-bold">{text(t.graph.connectedRecords)}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.nodes.map((n) => {
                  const meta = typeMeta[n.type] || typeMeta.parcel;
                  const Icon = meta.icon;
                  return (
                    <button
                      onClick={() => setSelected(n)}
                      key={n.id}
                      className={`text-left rounded-xl border p-4 hover:shadow-sm transition-shadow ${meta.color} ${
                        selected?.id === n.id ? 'ring-2 ring-emerald-500' : ''
                      }`}
                    >
                      <div className="flex gap-2 items-center">
                        <Icon size={17} />
                        <span className="text-xs font-bold uppercase">{meta.label}</span>
                      </div>
                      <p className="font-semibold text-sm mt-2 whitespace-pre-line">{n.label}</p>
                      {n.sublabel && <p className="text-xs mt-2 opacity-80 whitespace-pre-line">{n.sublabel}</p>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <h3 className="font-bold text-sm mb-3">{text(t.graph.relationshipsList)}</h3>
                <div className="space-y-2">
                  {data.edges.map((e) => (
                    <div
                      key={e.id}
                      className={`rounded-lg px-3 py-2 text-xs flex items-center justify-between gap-3 ${
                        e.is_conflict
                          ? 'bg-rose-50 text-rose-800 border border-rose-200 font-semibold'
                          : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span>
                        {data.nodes.find((n) => n.id === e.source)?.title ||
                          data.nodes.find((n) => n.id === e.source)?.label ||
                          e.source}
                      </span>
                      <span className="font-semibold text-center">
                        {e.label || (language === 'bn' ? 'সম্পর্কিত' : 'related to')} {e.is_conflict ? '⚠' : ''}
                      </span>
                      <span>
                        {data.nodes.find((n) => n.id === e.target)?.title ||
                          data.nodes.find((n) => n.id === e.target)?.label ||
                          e.target}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg-card p-5 h-fit">
              <h2 className="font-bold mb-3">{text(t.graph.recordDetails)}</h2>
              {selected ? (
                <>
                  <p className="font-semibold text-emerald-800 whitespace-pre-line">
                    {selected.title || selected.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {language === 'bn' ? 'ধরণ:' : 'Type:'} {selected.type}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'bn' ? 'অবস্থা:' : 'Status:'} {selected.status || (language === 'bn' ? 'অনির্দিষ্ট' : 'Not specified')}
                  </p>
                  <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-slate-50 p-3 text-xs whitespace-pre-wrap break-words">
                    {JSON.stringify(selected.details || {}, null, 2)}
                  </pre>
                </>
              ) : (
                <p className="text-sm text-slate-500">{text(t.graph.selectPrompt)}</p>
              )}
              <p className="text-xs text-slate-500 mt-5">
                {language === 'bn'
                  ? 'এই দৃশ্যটি সিন্থেটিক ডেমো ব্যাকএন্ডের সম্পর্কসমূহ তুলে ধরে। চিহ্নিত লাল লিংক পর্যালোচনার সংকেত, জালিয়াতির চূড়ান্ত প্রমাণ নয়।'
                  : 'This view reflects relationships returned by the synthetic demo backend. A flagged link is a review signal, not proof of fraud.'}
              </p>
            </aside>
          </div>
        )
      )}
    </section>
  );
};

export default FraudGraphPage;
