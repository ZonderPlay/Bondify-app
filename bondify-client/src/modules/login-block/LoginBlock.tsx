import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { open } from '@tauri-apps/plugin-shell';
import style from './LoginBlock.module.scss';
import TelegramIcon from './imgs/icons/telegram-icon.svg';
import GitHubIcon from './imgs/icons/github-icon.svg';
import GoogleIcon from './imgs/icons/google-icon.svg';
import { SocialAuthButton } from '../social-auth-button';
import { useUserContext } from '../user-context/UserContext';
import { invoke } from '@tauri-apps/api/core';



const LoginBlock: React.FC = () => {
    const { userData, setUserData } = useUserContext(); // Получаем userData и setUserData из контекста
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [language, setLanguage] = useState(userData?.language || 'en');
    const [translations, setTranslations] = useState<{ [key: string]: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const rulang = import('./locales/ru.json');
    const enlang = import('./locales/en.json');

    const t = (key: string) => {
        return translations ? translations[key] || key : key;
    };

    useEffect(() => {
        const changeLanguage = async (key: string) => {
            setLoading(true);
            let translation;
            switch (key) {
                case 'ru':
                    translation = (await rulang).default;
                    break;
                case 'en':
                    translation = (await enlang).default;
                    break;
                default:
                    translation = (await enlang).default;
                    break;
            }
            setTranslations(translation);

            // Обновляем данные пользователя
            const result = await invoke('update_user_data_command', {
                username: userData?.username, // Используйте текущее имя пользователя
                access_token: userData?.accessToken, // Используйте текущий токен доступа
                refresh_token: userData?.refreshToken, // Используйте текущий токен обновления
                theme: userData?.theme, // Используйте текущий темный режим
                language: key, // Новый язык
            });

            // Обновляем данные в контексте, если это необходимо
            if (result) {
                setUserData((prev) => ({ ...prev, language: key })); // Обновляем язык в контексте
            }

            setLoading(false);
        };

        changeLanguage(language);
    }, [language, userData, setUserData]);
    

    const telegramLoginUrl = `https://telegram.org/api/auth?bot_id=YOUR_BOT_ID&redirect_uri=https://your-site.com/auth/telegram`;

    const handleTelegramLogin = async () => {
        try {
            await open(telegramLoginUrl);
        } catch (error) {
            console.error('Ошибка при попытке авторизации через Telegram:', error);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Здесь вы можете добавить логику для отправки данных на сервер
        console.log("Логин:", username, "Пароль:", password);
    };
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className={style.login_block}>
            <div className={style.form_block}>
                <form className={style.form} onSubmit={handleSubmit}>
                    <div className={style.welcome_description}>
                        <motion.h2 
                            initial={{ opacity: 0, y: -20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5 }}
                        >
                            {t('login_welcome_header_text')}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: -20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {t('login_welcome_paragraph_text')}
                        </motion.p>
                    </div>
                    <input 
                        type="text" 
                        placeholder={t('username_placeholder')} 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder={t('password_placeholder')} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <input type="submit" value={t('login_button_text')} />
                </form>
                <div className={style.sub_form_block}>
                    <motion.h3
                    whileHover={{ scale: 1.03, color:'#98bcff' }} 
                    transition={{ duration: 0.2 }}
                    >
                        {t('sub_form_forgot_password_text')}
                    </motion.h3>
                    <motion.h3
                    whileHover={{ scale: 1.03, color:'#98bcff' }} 
                    transition={{ duration: 0.2 }}
                    >
                        {t('sub_form_register_text')}
                    </motion.h3>
                </div>
            </div>
            <div className={style.connects_container_block}>
                <motion.div className={style.connects_block}>
                    <SocialAuthButton 
                        icon={TelegramIcon} 
                        altText="Telegram" 
                        onClick={handleTelegramLogin} 
                    />
                    <SocialAuthButton 
                        icon={GitHubIcon} 
                        altText="GitHub" 
                        onClick={handleTelegramLogin} // Замените на правильный обработчик
                    />
                    <SocialAuthButton 
                        icon={GoogleIcon} 
                        altText="Google" 
                        onClick={handleTelegramLogin} // Замените на правильный обработчик
                    />
                </motion.div>
                
                <div className={style.description_block}>
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {t('login_connects_description_header_text')}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {t('login_connects_description_paragraph_text')}
                    </motion.p>
                </div>
                <div className={style.language_block}>
                    <motion.button
                        onClick={() => setLanguage('en')}
                        whileHover={{ scale: 1.04, color:'#f8f8f8' }} 
                        transition={{ duration: 0.2 }}
                    >
                        en
                    </motion.button>
                    <motion.button
                        onClick={() => setLanguage('ru')}
                        whileHover={{ scale: 1.04, color:'#f8f8f8' }} 
                        transition={{ duration: 0.2 }}
                    >
                        ru
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export { LoginBlock };
