import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/features/dashboard/components/Sidebar';

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <div className="ml-4 relative">
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
