import React from 'react';
import { AppLogo } from '@/components/AppLogo';

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-main-background text-second-font-color p-4">
            <AppLogo />
            <main>
                {children}
            </main>
        </div>
    );
}
