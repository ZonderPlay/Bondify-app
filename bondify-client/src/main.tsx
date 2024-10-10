import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { UserData } from './scripts/types'; 
import { invoke } from '@tauri-apps/api/core';

import './style/index.scss';
import App from './App';



// Функция для создания или получения данных пользователя
const createUser = async (): Promise<UserData | null> => {
  try {
    const userData: UserData = await invoke('create_user_command'); // Вызываем команду Rust
    console.log('User data:', userData);
    return userData;
  } catch (error) {
    console.error('Error loading or creating user data:', error);
    return null;
  }
};

const Main: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await createUser();
      setUserData(data);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Можно добавить индикатор загрузки
  }

  return (
    <Router>
      <App userData={userData} />
    </Router>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Main />
    </HelmetProvider>
  </StrictMode>
);




