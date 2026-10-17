import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, ArrowRight, ShieldCheck, User, Mail, Compass } from 'lucide-react';
import { LandGuardLogo } from '../components/LandGuardLogo';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useDemoAuth } from '../context/DemoAuthContext';

export const RegisterPage: React.FC = () => {
  const { language, t, text } = useLanguage();
  const { registerDemo, exploreDemo } = useDemoAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Form Validations
    if (!fullName.trim()) {
      setError(text(t.auth.validation.nameRequired));
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError(text(t.auth.validation.emailRequired));
      return;
    }

    if (!password.trim() || password.length < 4) {
      setError(text(t.auth.validation.passwordRequired));
      return;
    }

    if (password !== confirmPassword) {
      setError(text(t.auth.validation.passwordMismatch));
      return;
    }

    setLoading(true);
    setSuccess(text(t.auth.validation.successReg));

    // Store demo session (name and email only; passwords never saved!)
    registerDemo(fullName, email);

    window.setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  const handleExploreDemo = () => {
    exploreDemo();
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen bg-[#f5f7f2] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.05fr_.95fr]">
        
        {/* Left Branding Panel */}
        <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-[#0c271d] p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          
          <div className="flex items-center justify-between z-10">
            <Link to="/"><LandGuardLogo size="md" /></Link>
            <LanguageSelector variant="dark" />
          </div>

          <div className="relative z-10 py-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-emerald-300">
              {language === 'bn' ? 'ডিজিটাল ভূমি যাচাই প্ল্যাটফর্ম' : 'Digital land verification'}
            </p>
            <h1 className="max-w-md font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {text(t.landing.heroTitle)}<br />
              <span className="text-[#55E6AE]">{text(t.landing.heroTitleHighlight)}</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-emerald-50/80">
              {language === 'bn'
                ? 'সহজ ডেমো নিবন্ধনের মাধ্যমে নাগরিক অথবা ভূমি তদন্তকারী কর্মকর্তা হিসেবে ল্যান্ডগার্ডের সকল ফিচার অবিলম্বে পরীক্ষা করুন।'
                : 'Review synthetic land records, investigate potential conflicts, and understand why a rule-based check raised a concern.'}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <ShieldCheck className="mb-2 h-5 w-5 text-emerald-300" />
              <span>{language === 'bn' ? 'ব্যাখ্যাযোগ্য রুল পরীক্ষণ' : 'Explainable checks'}</span>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <LockKeyhole className="mb-2 h-5 w-5 text-emerald-300" />
              <span>{language === 'bn' ? 'নিরাপদ ডেমো ওয়ার্কস্পেস' : 'Synthetic demo only'}</span>
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
          <form onSubmit={handleRegister} className="w-full max-w-md my-auto">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {language === 'bn' ? 'নতুন ডেমো প্রবেশাধিকার' : 'Investigator workspace'}
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {text(t.auth.registerTitle)}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                {text(t.auth.registerSubtitle)}
              </p>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div role="alert" className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
                <span className="font-bold">⚠</span> {error}
              </div>
            )}
            {success && (
              <div role="status" className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
                ✓ {success}
              </div>
            )}

            {/* Full Name */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="fullName">
                {text(t.auth.fullName)} *
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-3.5 pr-10 py-2.5 text-xs sm:text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  placeholder={text(t.auth.fullNamePlaceholder)}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="email">
                {text(t.auth.email)} *
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-3.5 pr-10 py-2.5 text-xs sm:text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  placeholder={text(t.auth.emailPlaceholder)}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="password">
                {text(t.auth.password)} *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-12 text-xs sm:text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  placeholder={text(t.auth.passwordPlaceholder)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="confirmPassword">
                {text(t.auth.confirmPassword)} *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-12 text-xs sm:text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  placeholder={text(t.auth.confirmPasswordPlaceholder)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {text(t.auth.registerButton)} <ArrowRight className="h-4 w-4" />
            </button>

            {/* Explore Demo Button (Bypass registration) */}
            <button
              type="button"
              onClick={handleExploreDemo}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-600/40 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
            >
              <Compass className="h-4 w-4 text-emerald-700" />
              {text(t.auth.exploreDemoButton)}
            </button>

            {/* Link to Login */}
            <div className="mt-5 text-center text-xs text-slate-600">
              <span>{text(t.auth.alreadyHaveAccount)}{' '}</span>
              <Link to="/login" className="font-bold text-emerald-700 hover:underline">
                {text(t.auth.linkToLogin)}
              </Link>
            </div>

            {/* Demo Notice */}
            <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">
              <strong>{language === 'bn' ? 'ডেমো রেজিস্ট্রেশন বিজ্ঞপ্তি:' : 'Demo registration only:'}</strong>{' '}
              {text(t.auth.disclaimerBanner)}
            </p>

            <p className="mt-4 text-center text-xs text-slate-500">
              <Link to="/" className="font-semibold text-emerald-700 hover:underline">
                {text(t.auth.returnHome)}
              </Link>
            </p>
          </form>
        </section>

      </div>
    </main>
  );
};
