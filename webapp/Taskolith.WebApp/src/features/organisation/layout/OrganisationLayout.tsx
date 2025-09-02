import React from 'react'
import { Outlet } from 'react-router-dom'
import AppSidebar from '@/components/sidebar/AppSidebar'

const OrganisationLayout = () => {
    return (
        <div className="flex bg-gray-100 h-screen">
            <AppSidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default OrganisationLayout
