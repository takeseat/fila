import { ReactNode } from 'react';

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

            {/* Right side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
