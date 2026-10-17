import React, { useEffect, useState } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import type { LandRecord, TimelineData, TimelineEvent } from '../types';
import { useLanguage } from '../context/LanguageContext';

const badge = (v: string) =>
  v === 'danger'
    ? 'bg-rose-50 text-rose-700'
    : v === 'warning'
    ? 'bg-amber-50 text-amber-700'
    : v === 'success'
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-blue-50 text-blue-700';

export const TimelinePage: React.FC = () => {
  const { language, t, text } = useLanguage();
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [id, setId] = useState('');
  const [data, setData] = useState<TimelineData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getLandRecords({ limit: 100 })
      .then((r) => {
        setRecords(r.records);
        if (r.records[0]) setId(r.records[0].record_id);
      })
      .catch((e) => setError(e.message));
  }, []);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await api.getRecordTimeline(id));
    } catch (e: any) {
      setError(e.message || (language === 'bn' ? 'টাইমলাইন লোড করা সম্ভব হয়নি' : 'Timeline could not be loaded'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.18em] font-bold text-emerald-700">
            {language === 'bn' ? 'মালিকানা ইতিহাস ও ধারা' : 'Ownership history'}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">{text(t.timeline.title)}</h1>
          <p className="text-sm text-slate-500 mt-2">{text(t.timeline.subtitle)}</p>
        </div>
        <div className="flex gap-2">
          <select className="lg-input" value={id} onChange={(e) => setId(e.target.value)}>
            {records.map((r) => (
              <option value={r.record_id} key={r.id}>
                {r.record_id} · {r.mouza}
              </option>
            ))}
          </select>
          <button className="lg-button-secondary" onClick={load}>
            <RefreshCw size={15} /> {text(t.common.refresh)}
          </button>
        </div>
      </header>

      {error && <div className="lg-card p-5 text-rose-700">{error}</div>}

      {loading && !data ? (
        <div className="lg-card p-10 text-center text-slate-500">
          <RefreshCw className="animate-spin mx-auto mb-3" />
          {text(t.common.loading)}
        </div>
      ) : (
        data && (
          <div className="lg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
              <div>
                <h2 className="font-bold text-lg">{data.summary?.parcel_id || data.record_id}</h2>
                <p className="text-sm text-slate-500">
                  {language === 'bn' ? 'খতিয়ান নং' : 'Khatian'} {data.summary?.khatian_no || '—'} · {language === 'bn' ? 'দাগ নং' : 'Dag'} {data.summary?.plot_no || '—'}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 text-xs font-semibold">
                {data.summary?.total_events ?? data.events.length} {text(t.timeline.eventsCount)}
              </span>
            </div>

            {data.events.length === 0 ? (
              <p className="text-sm text-slate-500">{text(t.timeline.noEvents)}</p>
            ) : (
              <div className="relative ml-3 border-l-2 border-emerald-100 pl-7 space-y-7">
                {data.events.map((event: TimelineEvent) => (
                  <article className="relative" key={event.id}>
                    <span className="absolute -left-[36px] top-1 w-4 h-4 rounded-full bg-white border-4 border-emerald-500" />
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-emerald-700">{event.date || event.year}</p>
                        <h3 className="font-bold text-slate-900 mt-1">{event.title}</h3>
                        <p className="text-sm text-slate-600 mt-1 max-w-3xl">{event.description}</p>
                        {event.party && (
                          <p className="text-xs text-slate-500 mt-2">
                            {text(t.timeline.party)} {event.party}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs font-bold rounded-full px-3 py-1 ${badge(event.badge_variant)}`}>
                        {event.status_badge}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )
      )}

      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900 flex gap-2">
        <History size={17} className="shrink-0" />
        <p>{text(t.timeline.note)}</p>
      </div>
    </section>
  );
};

export default TimelinePage;
