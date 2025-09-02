import React from 'react'
import { Outlet } from 'react-router-dom'
import AppSidebar from '@/components/sidebar/AppSidebar'

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout
