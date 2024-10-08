import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const isLogin = false; // Здесь должен быть ваш логин-статус, возможно, из состояния или контекста.

    useEffect(() => {
        // Перенаправление на страницу логина, если пользователь не авторизован
        if (!isLogin) {
            navigate('/login-app');
        }
    }, [isLogin, navigate]); // Эффект будет выполняться, когда изменится isLogin или navigate

    return (
        <div className="Test">
            {/* Здесь может быть содержимое вашей домашней страницы */}
            <h1>Добро пожаловать на домашнюю страницу!</h1>
        </div>
    );
}

export { HomePage };