import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';
import { UserData } from './types'; // Импорт интерфейса UserData

const setupI18n = async () => {
    let language: string = 'en'; // Язык по умолчанию
    const resources: { [key: string]: { translation: any } } = {}; // Типизация resources

    try {
        // Получаем переводы с помощью вызова Rust-команды
        const translations: { [key: string]: string } = await invoke('get_translations_command');

        // Добавляем переводы в ресурсы
        for (const [lang, translation] of Object.entries(translations)) {
            resources[lang] = { translation: JSON.parse(translation) }; // Явно указываем, что translation - это строка
        }

        // Получаем язык пользователя
        const userData: UserData = await invoke('get_user_data_command');
        language = userData?.language || 'en'; // Если язык пользователя не определён, используем 'en'
        // Инициализация i18n с ресурсами и языком
        i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: language,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });
        
    } catch (error) {
        console.error('Ошибка при получении данных пользователя или переводов:', error);
    }

    
};

// Инициализация i18n при первой загрузке страницы
setupI18n()
    .then(() => {
        console.log("i18next успешно инициализирован");
    })
    .catch(err => {
        console.error("Ошибка инициализации i18next:", err);
    });

export { setupI18n };
