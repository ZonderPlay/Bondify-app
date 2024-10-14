import { MotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import style from './SocialAuthButton.module.scss';
interface SocialLoginButtonProps extends MotionProps {
    icon: string; // Тип для иконки (URL-адрес изображения)
    altText: string; // Тип для текста альтернативы
    onClick: () => void; // Тип для обработчика клика
}
const SocialAuthButton: React.FC<SocialLoginButtonProps> = ({ icon, altText, onClick }) => (
    <motion.button 
        className={style.connects_button} 
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
    >
        <img src={icon} alt={altText} className={`${style[`${altText.toLowerCase()}_icon`]}`} />
    </motion.button>
);
export {SocialAuthButton};