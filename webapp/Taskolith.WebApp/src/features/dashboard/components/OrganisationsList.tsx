import React from 'react'
import { useGetOrganisations } from '@/features/dashboard/hooks/useGetOrganisations'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const OrganisationsList = () => {
  const { data, isLoading, isError, error } = useGetOrganisations()
  const navigate = useNavigate()

  if (isLoading) return <p className="p-4 text-gray-600">Loading...</p>
  if (isError) return <p className="p-4 text-red-500">Error: {error.message}</p>

  return (
    <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow-sm max-w-2xl mx-auto mt-6">
      {data.map((org: any) => (
        <li
          key={org.organisationId}
          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-800 text-lg font-medium">
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
  )
}

export default OrganisationsList
