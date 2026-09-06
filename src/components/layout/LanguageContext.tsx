'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const DICTIONARY: Translations = {
  app_name: { en: 'CareLink', hi: 'केयरलिंक' },
  tagline: { en: 'Accessible healthcare, wherever you are.', hi: 'सुलभ स्वास्थ्य सेवा, आप जहाँ भी हों।' },
  symptom_checker: { en: 'Check Symptoms', hi: 'लक्षणों की जाँच करें' },
  find_hospital: { en: 'Find Hospital', hi: 'अस्पताल खोजें' },
  book_doctor: { en: 'Book Doctor', hi: 'डॉक्टर बुक करें' },
  my_records: { en: 'My Records', hi: 'मेरे स्वास्थ्य रिकॉर्ड' },
  my_medicines: { en: 'My Medicines', hi: 'मेरी दवाइयाँ' },
  emergency: { en: 'Emergency Help', hi: 'आपातकालीन सहायता' },
  appointments: { en: 'Appointments', hi: 'अपॉइंटमेंट' },
  referrals: { en: 'Referrals', hi: 'रेफरल' },
  queue: { en: 'Live Queue', hi: 'लाइव कतार' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
