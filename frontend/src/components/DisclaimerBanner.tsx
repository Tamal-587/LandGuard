import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  const { language } = useLanguage();

  if (compact) {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-900 flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          <strong>{language === 'bn' ? 'সিন্থেটিক ডেমো প্রোটোটাইপ:' : 'Synthetic Demonstration Prototype:'}</strong>{' '}
          {language === 'bn'
            ? 'সকল তথ্য কাল্পনিক ও পরীক্ষামূলক। এই ফলাফল কোনো আইনি মালিকানার সনদ বা অপরাধমূলক জালিয়াতির চূড়ান্ত প্রমাণ নয়।'
            : 'All data is fictional. Results do not certify legal title or prove criminal fraud.'}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="bg-amber-100 p-2 rounded-lg text-amber-700 flex-shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-sm text-amber-900 leading-relaxed">
          <p className="font-semibold text-amber-950 mb-1 flex items-center gap-1.5">
            {language === 'bn'
              ? 'সিন্থেটিক ডেটা ও স্ক্রিনিং নোটিশ (ল্যান্ডটেক ২০২৬ হ্যাকাথন প্রোটোটাইপ)'
              : 'Synthetic Data Screening Disclaimer (Hackathon Prototype)'}
          </p>
          <p className="text-xs sm:text-sm">
            {language === 'bn'
              ? 'ল্যান্ডগার্ড সিন্থেটিক ভূমি রেকর্ডের মধ্যে স্বয়ংক্রিয় সামঞ্জস্য ও রুল-ভিত্তিক স্ক্রিনিংয়ের জন্য নির্মিত একটি প্রোটোটাইপ। প্রদর্শিত সকল রেকর্ড ও তথ্য সম্পূর্ণ কাল্পনিক, যা কোনো বাস্তব নাগরিককে উপস্থাপন করে না এবং সরকারের লাইভ ডাটাবেজের সাথে সংযুক্ত নয়। স্ক্রিনিং সতর্কবার্তাগুলো প্রযুক্তিগত পর্যালোচনা সূচক এবং এটি কোনো অবস্থাতেই চূড়ান্ত আইনি মালিকানা বা বিচারিক ঘোষণা হিসেবে বিবেচনা করা যাবে না।'
              : 'LandGuard is a demonstration prototype designed for automated consistency screening across synthetic land records. The displayed information is entirely fictional, does not represent real citizens, and does not connect to live government databases. Screening indicators are rule-based warnings and must never be construed as legal determinations of ownership or judicial findings of fraud.'}
          </p>
        </div>
      </div>
    </div>
  );
};
