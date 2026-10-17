import React from 'react';
import { Shield, Database, Cpu, FileCheck, Award, Layers } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { language, t, text } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DisclaimerBanner />

      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {text(t.about.title)}
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          {text(t.about.subtitle)}
        </p>
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          {text(t.about.hackathonTag)}
        </span>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-700" />
          {text(t.about.problemTitle)}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {language === 'bn'
            ? 'ভূমি রেকর্ড ব্যবস্থাপনায় সনাতন ম্যানুয়াল প্রক্রিয়া এবং সাব-রেজিস্ট্রি অফিস বনাম সহকারী কমিশনার (ভূমি) অফিসের মধ্যে তথ্যের সমন্বয়হীনতার কারণে প্রায়শই জাল দলিল তৈরি, অননুমোদিত হস্তান্তর এবং একই জমির একাধিক ক্রেতার নিকট অবৈধ দ্বৈত বিক্রয় ঘটে থাকে। ল্যান্ডগার্ড একটি স্বয়ংক্রিয় ও ব্যাখ্যাযোগ্য স্ক্রিনিং স্তর প্রদান করে যা জমির তফসিল, দলিলের ইতিহাস, নামজারি মামলার নথি এবং ক্রিপ্টোগ্রাফিক ডিজিটাল হ্যাশ মিলিয়ে সম্ভাব্য জালিয়াতি ও দ্বৈত-বিক্রয় অবিলম্বে শনাক্ত করে।'
            : 'In land record management, manual processes and fragmented sub-registry vs. AC Land office records often lead to malicious duplicate sales, unrecorded transfers, and forged deed submissions. LandGuard provides an automated, explainable screening layer that cross-checks land schedules, deed histories, mutation orders, and cryptographic document hashes to flag potential double-selling attempts before irreversible financial loss occurs.'}
        </p>
      </div>

      {/* Technical Architecture */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-700" />
          {text(t.about.techTitle)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" /> {language === 'bn' ? 'ফ্রন্টএন্ড অ্যাপ্লিকেশন' : 'Frontend Application'}
            </h3>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li><strong>React 19 & TypeScript</strong> {language === 'bn' ? 'টাইপ-নিরাপদ ইন্টারফেসের জন্য' : 'for type-safe interactive components'}</li>
              <li><strong>Vite</strong> {language === 'bn' ? 'দ্রুত ডেভেলপমেন্ট ও প্রোডাকশন বিল্ড টুল' : 'build tool & dev proxy'}</li>
              <li><strong>Tailwind CSS</strong> {language === 'bn' ? 'আধুনিক নাগরিক সেবার ভিজ্যুয়াল ডিজাইন' : 'for responsive land-tech styling'}</li>
              <li><strong>Recharts</strong> {language === 'bn' ? 'ঝুঁকি স্কোর ও গতিশীল চার্ট প্রদর্শন' : 'for dynamic telemetry data visualization'}</li>
              <li><strong>React Router DOM</strong> {language === 'bn' ? 'ক্লায়েন্ট সাইড রুট নেভিগেশন' : 'for client-side navigation'}</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-700" /> {language === 'bn' ? 'ব্যাকএন্ড API ও ডেটাবেজ' : 'Backend API & Database'}
            </h3>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li><strong>Python Flask REST API</strong> {language === 'bn' ? 'মডুলার ব্লুপ্রিন্ট সহ' : 'with clean blueprint separation'}</li>
              <li><strong>SQLAlchemy ORM</strong> {language === 'bn' ? 'SQLite ডেটাবেজ (MySQL রেডি)' : 'with SQLite default, architected for MySQL migration'}</li>
              <li><strong>Rule-Based Fraud Engine</strong> {language === 'bn' ? 'ব্যাখ্যাযোগ্য স্কোর ও প্রমাণক সহ' : 'with explainable weights & findings'}</li>
              <li><strong>SHA-256 Checksum Engine</strong> {language === 'bn' ? 'ডিজিটাল দলিলের অখণ্ডতা যাচাই' : 'for document byte integrity'}</li>
              <li><strong>Pytest</strong> {language === 'bn' ? 'স্বয়ংক্রিয় ইউনিট টেস্ট স্যুট' : 'automated test suite'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rule Engine & Scoring Methodology */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-700" />
          {language === 'bn' ? 'ডিটেকশন রুল ইঞ্জিন ও স্কোরিং পদ্ধতি' : 'Detection Engine & Scoring Rules'}
        </h2>
        <p className="text-xs text-slate-600">
          {language === 'bn'
            ? 'স্কোরিং ইঞ্জিন ০ পয়েন্ট দিয়ে শুরু করে, অসঙ্গতি শনাক্তের সাথে সাথে নির্ধারিত ওয়েট যুক্ত করে এবং সর্বোচ্চ স্কোর ১০০-তে সীমাবদ্ধ রাখে:'
            : 'The scoring engine starts with 0 points, adds configurable weights upon violation, deduplicates underlying issues, and caps the maximum score at 100:'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">{language === 'bn' ? 'রুলের বিবরণ' : 'Rule Identification'}</th>
                <th className="p-3">{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                <th className="p-3 text-center">{language === 'bn' ? 'স্কোর পয়েন্ট' : 'Score Weight'}</th>
                <th className="p-3">{language === 'bn' ? 'ঝুঁকি মাত্রা' : 'Risk Band'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-slate-900">
                  {language === 'bn' ? 'পরস্পরবিরোধী সক্রিয় বিক্রয়' : 'Conflicting Active Sales'}
                </td>
                <td className="p-3">{language === 'bn' ? 'দ্বৈত বিক্রয়' : 'Double-Selling'}</td>
                <td className="p-3 text-center font-mono font-bold text-rose-600">+40</td>
                <td className="p-3 font-semibold text-rose-600">{language === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Risk'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">
                  {language === 'bn' ? 'মালিকানা হস্তান্তরে সংঘাত' : 'Conflicting Ownership Transfers'}
                </td>
                <td className="p-3">{language === 'bn' ? 'হস্তান্তর সংঘাত' : 'Transfer Conflict'}</td>
                <td className="p-3 text-center font-mono font-bold text-rose-600">+30</td>
                <td className="p-3 font-semibold text-rose-600">{language === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Risk'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">
                  {language === 'bn' ? 'মালিকানা চেইনের ফাঁক' : 'Ownership Chain Inconsistency'}
                </td>
                <td className="p-3">{language === 'bn' ? 'ধারাবাহিকতা অখণ্ডতা' : 'Chain Integrity'}</td>
                <td className="p-3 text-center font-mono font-bold text-amber-600">+20</td>
                <td className="p-3 font-semibold text-amber-600">{language === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium Risk'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">
                  {language === 'bn' ? 'দলিলের ডিজিটাল হ্যাশ অমিল' : 'Document Hash Mismatch'}
                </td>
                <td className="p-3">{language === 'bn' ? 'দলিল অখণ্ডতা' : 'Document Integrity'}</td>
                <td className="p-3 text-center font-mono font-bold text-amber-600">+20</td>
                <td className="p-3 font-semibold text-amber-600">{language === 'bn' ? 'মাঝারি / উচ্চ' : 'Medium / High'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">
                  {language === 'bn' ? 'নামজারি রেকর্ডের অসঙ্গতি' : 'Mutation Record Mismatch'}
                </td>
                <td className="p-3">{language === 'bn' ? 'নামজারি মেলবন্ধন' : 'Namzari Alignment'}</td>
                <td className="p-3 text-center font-mono font-bold text-amber-600">+15</td>
                <td className="p-3 font-semibold text-amber-600">{language === 'bn' ? 'মাঝারি ঝুঁকি' : 'Medium Risk'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">
                  {language === 'bn' ? 'প্রয়োজনীয় সহায়ক তথ্যের ঘাটতি' : 'Missing Supporting Data'}
                </td>
                <td className="p-3">{language === 'bn' ? 'তথ্য পূর্ণাঙ্গতা' : 'Completeness'}</td>
                <td className="p-3 text-center font-mono font-bold text-slate-600">+10</td>
                <td className="p-3 font-semibold text-slate-600">{language === 'bn' ? 'স্বল্প / মাঝারি' : 'Low / Medium'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Assistant Disclosure */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm">
          {language === 'bn' ? 'এআই কোডিং অ্যাসিস্ট্যান্ট ডিসক্লোজার' : 'AI Coding Assistant Disclosure'}
        </h3>
        <p>
          {language === 'bn'
            ? 'হ্যাকাথনের নির্দেশিকা অনুযায়ী, দ্রুত প্রোটোটাইপিং ও ইউআই কাঠামো তৈরিতে আধুনিক এআই কোডিং সহকারী ব্যবহৃত হয়েছে। সিস্টেমের সার্বিক স্থাপত্য, রুল ইঞ্জিন অ্যালগরিদম, ডেটাবেজ স্কিমা এবং ঝুঁকি যাচাইকরণ লজিক প্রকৌশলী দল কর্তৃক সম্পূর্ণভাবে পর্যালোচিত ও স্বয়ংক্রিয় টেস্ট দ্বারা পরীক্ষিত।'
            : 'In accordance with competition guidelines, modern AI coding assistants (such as Google Antigravity / Gemini) were utilized during the rapid prototyping, test-case authoring, and UI scaffolding phases of this hackathon submission. All system architecture, detection rules, database schema designs, and risk verification logic have been fully reviewed, benchmarked with automated unit tests, and validated by the software engineering team.'}
        </p>
      </div>
    </div>
  );
};

export default About;
