import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { useUpdateOrganisation, useDeleteOrganisation } from '@/features/organisation/hooks/useOrganisations'

const OrganisationSettingsPage = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const [name, setName] = useState('')

    const updateMutation = useUpdateOrganisation()
    const deleteMutation = useDeleteOrganisation()

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !organisationId) {
            alert('Organisation name cannot be empty.')
            return
        }
        updateMutation.mutate({ organisationId, organisationName: name })
    }

    const handleDelete = () => {
        if (!organisationId) return
        if (window.confirm(`Are you absolutely sure? Deleting this organisation will also delete all of its projects, roles, and members. This action cannot be undone.`)) {
            deleteMutation.mutate(organisationId)
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-6 space-y-8">
            <div className="p-6 bg-white rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">General Settings</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                            Organisation Name
                        </label>
                        <InputField
                            id="orgName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter the new organisation name"
                        />
                    </div>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-red-500">
                <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-gray-600 mb-4">
                    This is a permanent action. Once the organisation is deleted, it cannot be recovered.
                </p>
                <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete This Organisation'}
                </Button>
            </div>
        </div>
    )
}

export default OrganisationSettingsPage
