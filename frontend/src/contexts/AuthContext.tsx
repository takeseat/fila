import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import { initializeSocket, disconnectSocket } from '../lib/socket';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    restaurantId: string;
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
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    restaurant: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
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
            setUser(JSON.parse(storedUser));
            setRestaurant(JSON.parse(storedRestaurant));
            initializeSocket(token);
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

    return (
        <AuthContext.Provider value={{ user, restaurant, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
