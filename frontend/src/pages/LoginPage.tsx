import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { LandGuardLogo } from '../components/LandGuardLogo';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useDemoAuth } from '../context/DemoAuthContext';

export const LoginPage: React.FC = () => {
  const { language, t, text } = useLanguage();
  const { loginDemo, exploreDemo } = useDemoAuth();
  const navigate = useNavigate();

  const [identity, setIdentity] = useState('investigator@landguard.demo');
  const [password, setPassword] = useState('demo-access');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    // Demo entry validation
    if (!identity.trim() || !password.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন।' : 'Enter the demo username and password to continue.');
      return;
    }
    setMessage(text(t.auth.validation.successLogin));
    loginDemo(identity.trim());
    window.setTimeout(() => navigate('/dashboard'), 250);
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
                ? 'সিন্থেটিক ভূমি রেকর্ড পর্যালোচনা করুন, পরস্পরবিরোধী বিক্রয় ও নামজারি অমিল চিহ্নিত করুন এবং রুল ইঞ্জিনের ফলাফল পরীক্ষা করুন।'
                : 'Review synthetic land records, investigate potential conflicts, and understand why a rule-based check raised a concern.'}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <ShieldCheck className="mb-2 h-5 w-5 text-emerald-300" />
              <span>{language === 'bn' ? 'ব্যাখ্যাযোগ্য পরীক্ষণ' : 'Explainable checks'}</span>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-3">
              <LockKeyhole className="mb-2 h-5 w-5 text-emerald-300" />
              <span>{language === 'bn' ? 'সিন্থেটিক ডেমো ওয়ার্কস্পেস' : 'Synthetic demo only'}</span>
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-md my-auto">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {language === 'bn' ? 'তদন্তকারী ওয়ার্কস্পেস' : 'Investigator workspace'}
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {text(t.auth.loginTitle)}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                {text(t.auth.loginSubtitle)}
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {error}
              </div>
            )}

            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700" htmlFor="identity">
              {text(t.auth.email)}
            </label>
            <input
              id="identity"
              autoComplete="username"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              className="mb-4 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              placeholder="investigator@landguard.demo"
            />

            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700" htmlFor="password">
              {text(t.auth.password)}
            </label>
            <div className="relative mb-4">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-12 text-xs sm:text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                placeholder={text(t.auth.passwordPlaceholder)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="mb-5 flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span>{text(t.auth.rememberMe)}</span>
              </label>
              <span className="text-slate-400 cursor-not-allowed" title="Demo mode">
                {text(t.auth.forgotPassword)}
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
            >
              {text(t.auth.loginButton)} <ArrowRight className="h-4 w-4" />
            </button>

            {/* Explore Demo Button */}
            <button
              type="button"
              onClick={handleExploreDemo}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-600/40 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
            >
              <Compass className="h-4 w-4 text-emerald-700" />
              {text(t.auth.exploreDemoButton)}
            </button>

            {/* Link to Register */}
            <div className="mt-5 text-center text-xs text-slate-600">
              <span>{text(t.auth.dontHaveAccount)}{' '}</span>
              <Link to="/register" className="font-bold text-emerald-700 hover:underline">
                {text(t.auth.linkToRegister)}
              </Link>
            </div>

            {message && (
              <p role="status" className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
                ✓ {message}
              </p>
            )}

            <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">
              <strong>{language === 'bn' ? 'ডেমো প্রবেশাধিকার নোটিশ:' : 'Demo access only:'}</strong>{' '}
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

export default LoginPage;
