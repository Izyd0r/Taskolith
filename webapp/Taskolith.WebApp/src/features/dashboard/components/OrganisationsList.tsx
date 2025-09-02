import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useGetOrganisations } from '@/features/dashboard/hooks/useGetOrganisations'
import { useCreateOrganisation } from '@/features/dashboard/hooks/useCreateOrganisation'
import { type Organisation } from '@/features/dashboard/types/Organisation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Plus, ArrowRight, Building } from 'lucide-react'

const OrganisationsList: React.FC = () => {
    const { data: orgs, isLoading, isError, error } = useGetOrganisations()
    const { mutate: createOrganisation, isPending, error: createError } = useCreateOrganisation()
    const [name, setOrganisationName] = useState('')
    const navigate = useNavigate()

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        createOrganisation({ name }, {
            onSuccess: () => { setOrganisationName('') },
        })
    }

    const renderList = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>
        }
        if (isError) {
            return <p className="p-4 text-red-500 text-center">Error: {(error as Error).message}</p>
        }
        if (!orgs || orgs.length === 0) {
            return (
                <div className="text-center py-10 text-gray-500 flex flex-col justify-center items-center bg-white rounded-lg border border-dashed h-48">
                    <Building className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="font-medium text-gray-800">No Organisations Found</p>
                    <p className="text-sm">Use the form above to create one.</p>
                </div>
            )
        }
        return (
            <div className="space-y-3">
                {orgs.map((org: Organisation) => (
                    <div
                        key={org.organisationId}
                        className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer"
                        onClick={() => navigate(`/organisations/${org.organisationId}`)}
                    >
                        <span className="text-gray-900 font-semibold">{org.organisationName}</span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <section className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Organisations</h2>
                <form onSubmit={handleCreate} className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Create a new organisation..."
                            className="w-full p-3 pl-4 pr-28 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            value={name}
                            onChange={(e) => setOrganisationName(e.target.value)}
                            disabled={isPending}
                        />
                        <Button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="absolute right-1.5 top-1.5"
                            size="sm"
                        >
                            <Plus className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Create</span>
                        </Button>
                    </div>
                    {createError && <p className="text-red-500 text-sm mt-2">{(createError as Error).message}</p>}
                </form>
            </div>

            <div className="relative flex-grow min-h-0">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="h-full overflow-y-auto pr-1 pt-2 pb-2">
                    {renderList()}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    )
}

export default OrganisationsList
