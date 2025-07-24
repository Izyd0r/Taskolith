import React, { useState } from 'react';
import { useCreateOrganisation } from '@/features/dashboard/hooks/useCreateOrganisation'

const DashboardOrganisation: React.FC = () => {
    const [name, setOrganisationName] = useState('')
    const { mutate: createOrganisation, isPending, error, isSuccess } = useCreateOrganisation()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        createOrganisation({ name })
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Organisation</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Organisation Name"
                    className="w-full p-2 border rounded"
                    value={name}
                    onChange={(e) => setOrganisationName(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={isPending}
                >
                    {isPending ? 'Creating...' : 'Create'}
                </button>
                {error && <p className="text-red-500 text-sm">{error.message}</p>}
                {isSuccess && <p className="text-green-500 text-sm">Organisation created!</p>}
            </form>
        </div>
    )
}

export default DashboardOrganisation;
