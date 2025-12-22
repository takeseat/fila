import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import { initializeSocket, disconnectSocket } from '../lib/socket';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    restaurantId: string;
    language: string;
}

interface Restaurant {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
}

interface AuthContextType {
    user: User | null;
    restaurant: Restaurant | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    restaurant: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateUser: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem('user');
        const storedRestaurant = localStorage.getItem('restaurant');
        const token = localStorage.getItem('accessToken');

        if (storedUser && storedRestaurant && token) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setRestaurant(JSON.parse(storedRestaurant));
            initializeSocket(token);

            // Note: Language is now handled by LanguageProvider
            // LanguageProvider observes user.language and applies it
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('restaurant', JSON.stringify(data.restaurant));

        setUser(data.user);
        setRestaurant(data.restaurant);
        initializeSocket(data.accessToken);

        // Note: Language is now handled by LanguageProvider
        // LanguageProvider will observe the user change and apply language
    };

    const register = async (registerData: any) => {
        const { data } = await api.post('/auth/register', registerData);

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('restaurant', JSON.stringify(data.restaurant));

        setUser(data.user);
        setRestaurant(data.restaurant);
        initializeSocket(data.accessToken);

        // Note: Language is now handled by LanguageProvider
        // LanguageProvider will observe the user change and apply language
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('restaurant');

        setUser(null);
        setRestaurant(null);
        disconnectSocket();
    };

    const updateUser = (userData: Partial<User>) => {
        if (!user) return;

        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Note: Language is now handled by LanguageProvider
        // LanguageProvider observes user.language changes and applies them
    };

    return (
        <AuthContext.Provider value={{ user, restaurant, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
