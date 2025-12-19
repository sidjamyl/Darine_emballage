'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, defaultLocale, translations } from './i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.fr;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'fr' || savedLocale === 'ar')) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Update document direction and lang
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const value: LanguageContextType = {
    locale,
    setLocale,
    t: translations[locale],
    isRTL: locale === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
