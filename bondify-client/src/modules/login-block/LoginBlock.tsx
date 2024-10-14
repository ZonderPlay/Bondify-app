import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { open } from '@tauri-apps/plugin-shell';
import style from './LoginBlock.module.scss';
import { setupI18n } from '../../scripts/i18n';
import TelegramIcon from './imgs/icons/telegram-icon.svg';
import GitHubIcon from './imgs/icons/github-icon.svg';
import GoogleIcon from './imgs/icons/google-icon.svg';
import { SocialAuthButton } from '../social-auth-button';

const LoginBlock = () => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const { t, i18n } = useTranslation(); // Вызов useTranslation() после инициализации
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        const initializeI18n = async () => {
            await setupI18n(); // Ждем завершения инициализации
            setIsInitialized(true); // Обновляем состояние после инициализации
        };

        initializeI18n();
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

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

    if (!isInitialized) {
        return <div>Loading...</div>;
    }
    return (
        <div className={style.login_block}>
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
                    <button onClick={() => changeLanguage('en')}>en</button>
                    <button onClick={() => changeLanguage('ru')}>ru</button>
                </div>
            </div>
        </div>
    );
};

export { LoginBlock };
