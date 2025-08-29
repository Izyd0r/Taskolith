import React from 'react'
import { Outlet, useParams } from 'react-router-dom'
import OrganisationSidebar from '@/features/organisation/components/OrganisationSidebar'

const OrganisationLayout = () => {
    const { organisationId } = useParams()

    return (
        <div className="flex bg-gray-100 h-screen">
            
            <OrganisationSidebar />
            
            <main className="flex-1 flex flex-col overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default OrganisationLayout
