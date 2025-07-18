import React from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            Dashboard
            <main>{children}</main>
        </div>
    );
}
