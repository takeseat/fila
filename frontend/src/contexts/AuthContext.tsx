import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

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
    countryCode: string;
    onboardingPending?: boolean;
}

interface AuthContextType {
    user: User | null;
    restaurant: Restaurant | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    restaurant: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateUser: () => { },
    refreshProfile: async () => { },
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
    };

    const register = async (registerData: any) => {
        const { data } = await api.post('/auth/register', registerData);

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('restaurant', JSON.stringify(data.restaurant));

        setUser(data.user);
        setRestaurant(data.restaurant);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('restaurant');

        setUser(null);
        setRestaurant(null);
    };

    const updateUser = (userData: Partial<User>) => {
        if (!user) return;

        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const refreshProfile = async () => {
        try {
            const { data } = await api.get('/users/me');
            if (data.user) {
                // Update local state and storage
                const updatedUser = {
                    ...user, // Keep existing fields
                    ...data.user, // Overwrite with new
                    // Ensure we preserve restaurantId if not returned? It is returned in getProfile.
                };

                // If the profile endpoint returns nested restaurant detail including onboardingPending
                // We need to make sure backend returns it. I added it to getting users list? No getProfile.
                if (data.user.restaurant) {
                    const updatedRestaurant = {
                        ...restaurant,
                        ...data.user.restaurant
                    };
                    setRestaurant(updatedRestaurant as Restaurant);
                    localStorage.setItem('restaurant', JSON.stringify(updatedRestaurant));
                }

                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error('Failed to refresh profile', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, restaurant, loading, login, register, logout, updateUser, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
