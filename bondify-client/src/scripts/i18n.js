import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';
import { invoke } from '@tauri-apps/api/core';


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

// Получение данных пользователя из Rust
const getUserdata = async () => {
  try {
    const userData = await invoke('get_user_data'); // Rust функция через invoke
    return userData.language; // Предполагается, что объект userData содержит поле language
  } catch (error) {
    console.error('Error fetching user data from Rust', error);
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
  let language;
  try {
    // Попробуем получить язык из Cookies
    const cookieLanguage = Cookies.get('language');
    // Если не найдено в Cookies, пробуем получить из данных пользователя
    const userLanguage = await getUserdata();

    language = cookieLanguage || userLanguage || 'en'; // Устанавливаем язык

  } catch (error) {
    console.error('Error fetching language', error);
    language = 'en';
  }

  // Инициализация i18n
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language, // Устанавливаем язык
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

// Инициализация i18n при первой загрузке страницы
setupI18n();

export default i18n;
