import { createContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
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
    plan?: 'BASIC' | 'PRO';
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

    const { i18n } = useTranslation();

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem('user');
        const storedRestaurant = localStorage.getItem('restaurant');
        const token = localStorage.getItem('accessToken');

        if (storedUser && storedRestaurant && token) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            const restaurantData = JSON.parse(storedRestaurant);
            // Default to 'BASIC' if plan is missing (legacy sessions)
            if (!restaurantData.plan) {
                console.log('[AuthContext] Plan missing in stored restaurant, defaulting to BASIC');
                restaurantData.plan = 'BASIC';
            }
            setRestaurant(restaurantData);

            // Sync i18n
            if (userData.language && userData.language !== i18n.language) {
                i18n.changeLanguage(userData.language);
            }
        }

        setLoading(false);
    }, []);

    // Also sync when user state changes (e.g. after login/register)
    useEffect(() => {
        if (user?.language && user.language !== i18n.language) {
            i18n.changeLanguage(user.language);
        }
    }, [user, i18n]);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);

        // Ensure plan is set
        const restaurantWithPlan = {
            ...data.restaurant,
            plan: data.restaurant.plan || 'BASIC'
        };
        setRestaurant(restaurantWithPlan);
        localStorage.setItem('restaurant', JSON.stringify(restaurantWithPlan));
    };

    const register = async (registerData: any) => {
        const { data } = await api.post('/auth/signup-email', registerData); // Use new endpoint or keep /register alias
        // Do NOT set user/token. Return data for UI handling.
        return data;
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
