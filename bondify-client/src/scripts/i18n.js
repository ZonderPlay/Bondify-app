import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

// Функция для загрузки JSON-файла с переводами
const loadLanguage = async (lang) => {
  try {
    const translations = await import(`../locales/${lang}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Could not load language file for ${lang}`, error);
    return null;
  }
};

// Массив доступных языков
const languages = await import(`../locales/languages.json`);

const setupI18n = async () => {
  const resources = {};

  for (const lang of languages['languages']) {
    const translation = await loadLanguage(lang);
    if (translation) {
      resources[lang] = { translation };
    }
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: Cookies.get('language') || 'en', // язык берется из cookies или по умолчанию 'en'
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

// Инициализация i18n при первой загрузке страницы
setupI18n();

export default i18n;
