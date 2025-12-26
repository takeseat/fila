import { ReactNode } from 'react';
import restaurantLoungeImg from '../../assets/images/restaurant-lounge.png';

interface AuthLayoutProps {
    children: ReactNode;
    branding: ReactNode;
}

export function AuthLayout({ children, branding }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left side - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-white">
                {branding}
            </div>

            {/* Right side - Auth Form with Background Image */}
            <div
                className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${restaurantLoungeImg})` }}
            >
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50"></div>

                {/* Content */}
                <div className="w-full max-w-md relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
