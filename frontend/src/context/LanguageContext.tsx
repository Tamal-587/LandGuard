import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations;
  // Helper to extract string in current language
  text: (item: { bn: string; en: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'landguard_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'bn') {
        return saved;
      }
    } catch {
      // ignore
    }
    // Default to Bangla as required
    return 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const text = (item: { bn: string; en: string }) => {
    if (!item) return '';
    return item[language] || item.bn || item.en || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t: translations, text }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
