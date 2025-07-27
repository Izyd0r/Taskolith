import React from 'react'
import { Outlet, useParams } from 'react-router-dom'
import OrganisationSidebar from '@/features/organisation/components/OrganisationSidebar'

const OrganisationLayout = () => {
    const { organisationId } = useParams()

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <OrganisationSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default OrganisationLayout
