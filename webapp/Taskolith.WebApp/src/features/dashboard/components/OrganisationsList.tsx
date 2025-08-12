import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useGetOrganisations } from '@/features/dashboard/hooks/useGetOrganisations'

type Organisation = {
    organisationId: string
    organisationName: string
}

const OrganisationsList = () => {
    const { data: orgs, isLoading, isError, error } = useGetOrganisations()
    const navigate = useNavigate()

    if (isLoading) {
        return <p className="p-4 text-gray-600">Loading organisations...</p>
    }

    if (isError) {
        return <p className="p-4 text-red-500">Error: {error.message}</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-sm max-w-2xl mx-auto mt-6">
            <h2 className="text-xl font-bold p-4 border-b">Your Organisations</h2>
            <ul className="divide-y divide-gray-200">
                {orgs?.map((org: Organisation) => (
                    <li
                        key={org.organisationId}
                        className="flex items-center justify-between p-4"
                    >
                        <span className="text-gray-800 font-medium">
                            {org.organisationName}
                        </span>
                        <Button
                            onClick={() => navigate(`/organisations/${org.organisationId}`)}
                        >
                            View
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OrganisationsList
