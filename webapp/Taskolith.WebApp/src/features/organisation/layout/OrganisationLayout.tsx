import React from 'react'
import { Outlet, useParams } from 'react-router-dom'
import OrganisationSidebar from '@/features/organisation/components/OrganisationSidebar'

const OrganisationLayout = () => {
    const { organisationId } = useParams()

    return (
        <div className="flex min-h-screen">
            <OrganisationSidebar />
            <main className="flex-1 bg-gray-100 p-6">
                <Outlet />
            </main>
        </div>
    )
}

export default OrganisationLayout
