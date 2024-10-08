import style from './LoginBlock.module.scss';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion'; // Импортируем необходимые компоненты

import TelegramIcon from './imgs/icons/telegram-icon.svg';
import GitHubIcon from './imgs/icons/github-icon.svg';
import GoogleIcon from './imgs/icons/google-icon.svg';

const LoginBlock = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        Cookies.set('language', lang, { expires: 7 });
    };

    // URL для входа с помощью Telegram
    const telegramLoginUrl = `https://telegram.org/api/auth?bot_id=YOUR_BOT_ID&redirect_uri=https://your-site.com/auth/telegram`;

    const handleTelegramLogin = () => {
        window.location.href = telegramLoginUrl; // Перенаправление на страницу авторизации Telegram
    };

    return (
        <div className={style.login_block}>
            <form className={style.form}>
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
                <input type="text" placeholder={t('username_placeholder')} />
                <input type="password" placeholder={t('password_placeholder')} />
                <input type="submit" value={t('login_button_text')} />
            </form>
            <div className={style.connects_container_block}>
                <motion.div className={style.connects_block}>
                    <motion.button 
                        className={style.connects_button} 
                        onClick={handleTelegramLogin}
                        whileHover={{ scale: 1.1 }} // Увеличение кнопки при наведении
                        transition={{ duration: 0.2 }} // Плавный переход
                    >
                        <img src={TelegramIcon} alt="Telegram" className={style.telegram_icon} />
                    </motion.button>
                    <motion.button 
                        className={style.connects_button} 
                        onClick={handleTelegramLogin}
                        whileHover={{ scale: 1.1 }} // Увеличение кнопки при наведении
                        transition={{ duration: 0.2 }} // Плавный переход
                    >
                        <img src={GitHubIcon} alt="GitHub" className={style.github_icon} />
                    </motion.button>
                    <motion.button 
                        className={style.connects_button} 
                        onClick={handleTelegramLogin}
                        whileHover={{ scale: 1.1 }} // Увеличение кнопки при наведении
                        transition={{ duration: 0.2 }} // Плавный переход
                    >
                        <img src={GoogleIcon} alt="Google" className={style.google_icon} />
                    </motion.button>
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
}

export { LoginBlock };
