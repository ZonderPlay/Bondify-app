import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { invoke } from '@tauri-apps/api/core';

import './style/index.scss';
import App from './App';
import { UserProvider } from './modules/user-context/UserContext';

// Функция для создания или получения данных пользователя
const createUser = async (): Promise<void> => {
  try {
    await invoke('create_user_data_command');
  } catch (error) {
    console.error('Error loading or creating user data:', error);
  }
};

const Main: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      await createUser();
      setLoading(false); // Устанавливаем статус загрузки только после получения данных
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Можно добавить индикатор загрузки
  }

  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Main />
    </HelmetProvider>
  </StrictMode>
);
