import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  FileCheck,
  Bell,
  Menu,
  LogOut,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useDemoAuth } from '../context/DemoAuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenDocModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenDocModal }) => {
  const { language, t, text } = useLanguage();
  const { user, logout } = useDemoAuth();

  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [quickQuery, setQuickQuery] = useState('');
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? setIsBackendHealthy(true) : setIsBackendHealthy(false)))
      .catch(() => {
        fetch('http://127.0.0.1:5000/api/health')
          .then((res) => (res.ok ? setIsBackendHealthy(true) : setIsBackendHealthy(false)))
          .catch(() => setIsBackendHealthy(false));
      });

    api.getFraudAlerts({ status: 'OPEN', limit: 1 })
      .then((res) => setUnreadAlerts(res.total))
      .catch(() => setUnreadAlerts(0));
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/records?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200/90 text-slate-800 sticky top-0 z-40 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Sidebar Toggle & Mobile Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none transition-colors"
            title={language === 'bn' ? 'সাইডবার লুকান/দেখান' : 'Toggle Sidebar'}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span className="text-emerald-700 font-bold">LandGuard</span>
            <span>/</span>
            <span className="text-slate-700">{text(t.header.title)}</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <form onSubmit={handleQuickSearch} className="flex-1 max-w-lg mx-1 sm:mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder={text(t.header.searchPlaceholder)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50/90 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Right: Language Selector, Actions, Notifications, User Profile & API status */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Language Switcher */}
          <LanguageSelector variant="light" />

          {/* Quick Doc Verification Trigger */}
          <button
            onClick={onOpenDocModal}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors shadow-sm"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{text(t.header.verifyDocument)}</span>
          </button>

          {/* Notification Bell */}
          <Link
            to="/alerts"
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={text(t.header.notifications)}
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </Link>

          {/* Backend Status indicator */}
          <div
            className="hidden xl:flex items-center space-x-1.5 text-[11px] px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600"
            title={isBackendHealthy ? 'Flask API Online' : 'Flask API Unreachable'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            ></span>
            <span className="text-[10px] font-medium">
              {isBackendHealthy ? text(t.header.apiOnline) : text(t.header.apiOffline)}
            </span>
          </div>

          {/* User Profile Pill & Dropdown Menu */}
          <div className="relative pl-1 sm:pl-2 border-l border-slate-200" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="User Profile Menu"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/20 shadow-sm">
                {user.avatarLetter || 'B'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                  {language === 'bn' ? 'তদন্তকারী (ডেমো)' : user.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{user.email}</p>
                  <span className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {language === 'bn' ? 'সক্রিয় ডেমো সেশন' : 'Demo Session Active'}
                  </span>
                </div>

                <div className="px-2 py-1">
                  <Link
                    to="/register"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                  >
                    <span>{text(t.auth.linkToRegister)}</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                  >
                    <span>{text(t.auth.linkToLogin)}</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 px-2 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg font-semibold transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{text(t.header.logout)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
