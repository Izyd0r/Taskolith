import React from 'react'
import { Outlet } from 'react-router-dom'
import DashboardSidebar from '@/features/dashboard/components/Sidebar'

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <DashboardSidebar />
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout
