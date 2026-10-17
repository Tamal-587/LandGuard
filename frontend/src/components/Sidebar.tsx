import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  CheckCircle2,
  ShieldAlert,
  GitBranch,
  FileSpreadsheet,
  Info,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Network,
  FlaskConical,
  GitCompare,
  History,
  Layers
} from 'lucide-react';
import { LandGuardLogo } from './LandGuardLogo';
import { RuralIllustration } from './RuralIllustration';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onOpenDocModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, onOpenDocModal }) => {
  const { language, t, text } = useLanguage();
  const [openAlertCount, setOpenAlertCount] = useState<number | null>(null);

  useEffect(() => {
    api.getFraudAlerts({ status: 'OPEN', limit: 1 })
      .then((res) => setOpenAlertCount(res.total))
      .catch(() => setOpenAlertCount(null));
  }, []);

  const navItems = [
    { name: text(t.nav.dashboard), to: '/dashboard', icon: LayoutDashboard },
    { name: text(t.nav.home), to: '/', icon: Layers },
    { name: text(t.nav.searchLand), to: '/records', icon: Search },
    { name: text(t.nav.verifyLand), to: '/verify', icon: CheckCircle2 },
    { name: text(t.nav.fraudGraph), to: '/graph', icon: Network },
    { name: text(t.nav.fraudDna), to: '/fraud-dna', icon: GitCompare },
    { name: text(t.nav.simulator), to: '/simulation', icon: FlaskConical },
    { name: text(t.nav.timeline), to: '/timeline', icon: History },
    { name: text(t.nav.alerts), to: '/alerts', icon: ShieldAlert, badge: openAlertCount },
    { name: text(t.nav.mutations), to: '/mutations', icon: GitBranch },
    { name: text(t.nav.reports), to: '/reports', icon: FileSpreadsheet },
    { name: text(t.nav.about), to: '/about', icon: Info },
  ];

  return (
    <aside
      className={`bg-forest-900 border-r border-forest-800 text-slate-200 transition-all duration-300 flex flex-col justify-between z-30 select-none shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Branding */}
      <div className="flex flex-col">
        <div className="h-16 px-4 flex items-center justify-between border-b border-forest-800/80 bg-forest-950/40">
          {!collapsed ? (
            <LandGuardLogo size="md" showTagline />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold mx-auto ring-1 ring-emerald-400/40">
              LG
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-emerald-400/80 hover:text-white hover:bg-forest-800 transition-colors ml-auto"
            title={collapsed ? (language === 'bn' ? 'সাইডবার প্রসারিত করুন' : 'Expand Sidebar') : (language === 'bn' ? 'সাইডবার সঙ্কুচিত করুন' : 'Collapse Sidebar')}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="py-4 px-3 space-y-1">
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
              {text(t.nav.platformNav)}
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/30'
                      : 'text-slate-300 hover:bg-forest-800/90 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-emerald-400 group-hover:text-emerald-300" />
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm ml-1">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Quick Action: Upload / Verify Document Hash Modal */}
          {onOpenDocModal && (
            <button
              onClick={onOpenDocModal}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-forest-800/90 hover:text-white transition-all group mt-2 border border-forest-800"
              title={text(t.nav.uploadDoc)}
            >
              <UploadCloud className="w-4 h-4 flex-shrink-0 text-emerald-400 group-hover:text-emerald-300" />
              {!collapsed && <span>{text(t.nav.uploadDoc)}</span>}
            </button>
          )}
        </div>
      </div>

      {/* Footer / Rural Illustration & Demo Badge */}
      <div className="flex flex-col border-t border-forest-800/80 bg-forest-950/30">
        {!collapsed && (
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400/90">
              <span>{text(t.nav.syntheticEngine)}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[9px] uppercase tracking-wider font-bold">
                {text(t.nav.demoTag)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
              {text(t.nav.activeScenarios)}
            </p>
          </div>
        )}

        {/* Scenic Rural Bangladesh Landscape */}
        <RuralIllustration className={collapsed ? 'opacity-40' : 'opacity-85'} />
      </div>
    </aside>
  );
};
