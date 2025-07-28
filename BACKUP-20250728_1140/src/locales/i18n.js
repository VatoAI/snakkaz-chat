import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import nbNO from './nb-NO.json';

const resources = {
  nb: {
    translation: nbNO
  },
  'nb-NO': {
    translation: nbNO
  },
  no: {
    translation: nbNO
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'nb',
    lng: 'nb', // Default to Norwegian
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'snakkaz-language',
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Norwegian-specific configuration
    debug: process.env.NODE_ENV === 'development',
    
    // Date/time formatting for Norwegian
    timeFormat: 'HH:mm',
    dateFormat: 'DD.MM.YYYY',
    dateTimeFormat: 'DD.MM.YYYY HH:mm',
    
    // Norwegian pluralization rules
    pluralSeparator: '_',
    keySeparator: '.',
    nsSeparator: ':',
  });

export default i18n;
