import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

i18n
  .use(LanguageDetector) // Detects browser language
  .use(initReactI18next) // Initializes i18next for React
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations }
    },
    fallbackLng: 'en', // Default language
    debug: process.env.NODE_ENV === 'development', // Enable debug mode only in development
    detection: {
      order: ['querystring', 'localStorage', 'navigator'], // Define language detection order
      caches: ['localStorage'] // Cache detected language
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
