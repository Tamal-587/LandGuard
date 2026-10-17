import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  FileCheck,
  Layers,
  TrendingUp,
  GitBranch,
  ShieldCheck,
  MapPin,
  Search,
  CheckCircle2,
  Compass,
  UserPlus,
  LogIn
} from 'lucide-react';

import villageImage from '../assets/hero.png';
import bangladeshMap from '../assets/landguard-hero.png';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useDemoAuth } from '../context/DemoAuthContext';

export const LandingPage: React.FC = () => {
  const { language, t, text } = useLanguage();
  const { exploreDemo } = useDemoAuth();

  const featureIcons = [FileCheck, Layers, TrendingUp, GitBranch];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F8F4] text-[#17372B]">

      {/* ================= NAVBAR ================= */}
      <header className="relative z-30 border-b border-[#E6EEE8] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-8">

          {/* LandGuard Logo */}
          <Link
            to="/"
            aria-label="LandGuard home"
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#087B52] text-white shadow-sm">
              <ShieldCheck size={26} strokeWidth={2.2} />
            </span>

            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#123D2D]">
              Land<span className="text-[#16A875]">Guard</span>
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="#home"
              className="font-semibold text-[#087B52] transition hover:text-emerald-600"
            >
              {language === 'bn' ? 'হোম' : 'Home'}
            </a>

            <a
              href="#features"
              className="font-medium text-slate-600 transition hover:text-[#087B52]"
            >
              {language === 'bn' ? 'ফিচারসমূহ' : 'Features'}
            </a>

            <a
              href="#how-it-works"
              className="font-medium text-slate-600 transition hover:text-[#087B52]"
            >
              {language === 'bn' ? 'পদ্ধতি' : 'How It Works'}
            </a>

            <Link
              to="/about"
              className="font-medium text-slate-600 transition hover:text-[#087B52]"
            >
              {language === 'bn' ? 'পরিচিতি' : 'About'}
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <LanguageSelector variant="light" />

            {/* Demo Registration Link */}
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              <UserPlus size={15} />
              <span>{text(t.auth.linkToRegister)}</span>
            </Link>

            {/* Dashboard / Explore Demo Button */}
            <Link
              to="/dashboard"
              className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-xl bg-[#087B52] px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#075E40]"
            >
              <ShieldCheck size={17} />
              <span>{text(t.nav.dashboard)}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section
        id="home"
        className="relative isolate overflow-hidden bg-[#092C20] text-white"
      >
        {/* Natural Bangladesh village background */}
        <div className="absolute inset-0 -z-20">
          <img
            src={villageImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Dark overlay for readable text */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06271C]/95 via-[#082B20]/85 to-[#082B20]/50" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[610px] lg:grid-cols-2 lg:gap-10 lg:py-20">

          {/* LEFT: Hero text */}
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-[#073B2A]/70 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-200 backdrop-blur-sm">
              <ShieldCheck size={16} />
              <span>{text(t.landing.heroTag)}</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[54px]">
              {text(t.landing.heroTitle)}
              <span className="mt-2 block text-[#55E6AE]">
                {text(t.landing.heroTitleHighlight)}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
              {text(t.landing.heroSubtitle)}
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/records"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#43E6A6] px-5 py-3.5 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-[#073A29] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-[#76F1BE]"
              >
                <Search size={18} />
                {text(t.landing.ctaVerify)}
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/60 bg-white/10 px-5 py-3.5 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <UserPlus size={18} />
                {text(t.auth.registerTitle)}
              </Link>

              <Link
                to="/dashboard"
                onClick={() => exploreDemo()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-[#063b27]/80 px-4 py-3 text-xs font-semibold text-emerald-200 hover:bg-[#074b32]"
              >
                <Compass size={16} />
                {text(t.auth.exploreDemoButton)}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs sm:text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#55E6AE]" />
                {text(t.landing.trustSimple)}
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#55E6AE]" />
                {text(t.landing.trustEvidence)}
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#55E6AE]" />
                {text(t.landing.trustDemo)}
              </span>
            </div>
          </div>

          {/* RIGHT: Bangladesh map card */}
          <div className="relative mx-auto w-full max-w-[550px] lg:ml-auto">
            <div className="absolute -inset-4 rounded-[35px] bg-emerald-400/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-[#062B20]/70 p-2 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-[20px]">
                <img
                  src={bangladeshMap}
                  alt={text(t.landing.bangladeshMap)}
                  className="aspect-[5/4] w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#062B20]/55 via-transparent to-transparent" />
                
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/25 bg-[#082D22]/85 px-3 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg backdrop-blur-md">
                  <MapPin size={17} className="text-[#55E6AE]" />
                  <span>{language === 'bn' ? 'বাংলাদেশ ডিজিটাল ল্যান্ড রেজিস্ট্রি' : 'Bangladesh Land Registry'}</span>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="flex items-center gap-3 px-3 py-3.5 sm:px-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-[#55E6AE]">
                  <ShieldCheck size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-xs sm:text-sm">
                    {text(t.landing.landVerification)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/70">
                    {text(t.landing.landVerificationSub)}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-[#55E6AE]" />
                  {text(t.nav.demoTag)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent gradient */}
        <div className="h-1.5 bg-gradient-to-r from-[#20C989] via-[#9CE9B5] to-[#20C989]" />
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="scroll-mt-20 px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#13835B]">
              {text(t.landing.capabilitiesTag)}
            </span>

            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#17372B]">
              {text(t.landing.capabilitiesTitle)}
            </h2>

            <p className="mt-3.5 text-sm sm:text-base leading-7 text-slate-600">
              {text(t.landing.capabilitiesSub)}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {t.landing.features.map((feature, idx) => {
              const Icon = featureIcons[idx] || FileCheck;

              return (
                <article
                  key={feature.title.en}
                  className="group rounded-2xl border border-[#E0EAE3] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5"
                >
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#E5F8EF] text-[#11845A] transition group-hover:bg-[#D2F4E3]">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold leading-6 sm:leading-7 text-[#17372B]">
                    {text(feature.title)}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm leading-6 text-slate-600">
                    {text(feature.description)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-[#E2EDE4] bg-[#EDF6EF] px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#13835B]">
              {text(t.landing.processTag)}
            </span>

            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17372B]">
              {text(t.landing.processTitle)}
            </h2>

            <p className="mt-3.5 text-sm sm:text-base leading-7 text-slate-600">
              {text(t.landing.processSub)}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {t.landing.steps.map((step) => (
              <article
                key={step.step}
                className="rounded-2xl border border-white bg-white p-6 sm:p-7 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#DDF7E9] text-base sm:text-lg font-extrabold text-[#11794F]">
                  {step.step}
                </div>

                <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-bold text-[#17372B]">
                  {text(step.title)}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
                  {text(step.description)}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/records"
              className="inline-flex items-center gap-2 rounded-xl bg-[#116B4A] px-6 py-3.5 font-semibold text-white transition hover:bg-[#0B5137] text-xs sm:text-sm"
            >
              <span>{language === 'bn' ? 'যাচাইকরণ অনুসন্ধান শুরু করুন' : 'Start Verification'}</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-emerald-600/40 px-6 py-3.5 font-semibold text-emerald-800 transition hover:bg-emerald-50 text-xs sm:text-sm"
            >
              <UserPlus size={18} />
              <span>{text(t.auth.registerTitle)}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= RESPONSIBLE USE ================= */}
      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 rounded-2xl border border-[#D6E9DB] bg-white p-5 sm:flex-row sm:items-center sm:p-8 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E5F8EF] text-[#11845A]">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h2 className="font-bold text-[#17372B] text-sm sm:text-base">
              {text(t.landing.responsibleTitle)}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm leading-6 text-slate-600">
              {text(t.landing.responsibleDesc)}
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#09271D] px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-[#55E6AE]">
              <ShieldCheck size={22} />
            </span>
            <span className="text-xl font-extrabold">
              Land<span className="text-[#55E6AE]">Guard</span>
            </span>
          </Link>

          <p className="text-xs leading-5 text-white/65">
            {text(t.landing.footerNote)}
          </p>

          <div className="flex items-center gap-4 text-xs text-white/80">
            <Link to="/about" className="hover:underline">{text(t.nav.about)}</Link>
            <Link to="/login" className="hover:underline">{text(t.header.login)}</Link>
            <Link to="/register" className="hover:underline">{text(t.header.register)}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
