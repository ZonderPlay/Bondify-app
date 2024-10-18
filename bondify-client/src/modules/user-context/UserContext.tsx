import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { UserData } from '../../scripts/types'; // Импортируйте ваш тип UserData

// Создание контекста
const UserContext = createContext<{
    userData: UserData | null;
    setUserData: Dispatch<SetStateAction<UserData | null>>;
} | undefined>(undefined);

// Провайдер контекста
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(null);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

// Хук для использования контекста
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
