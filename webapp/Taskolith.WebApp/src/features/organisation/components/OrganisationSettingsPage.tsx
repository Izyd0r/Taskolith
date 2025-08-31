import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { useUpdateOrganisation, useDeleteOrganisation } from '@/features/organisation/hooks/useOrganisations'
import { ContentPage } from '@/components/layout/ContentPage'
import { AlertTriangle } from 'lucide-react'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'
import { NotificationModal, type Notification } from '@/components/ui/NotificationModal'

const OrganisationSettingsPage = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const [name, setName] = useState('')
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [notification, setNotification] = useState<Notification>({
        open: false,
        variant: 'success',
        title: '',
        description: '',
    })

    const updateMutation = useUpdateOrganisation()
    const deleteMutation = useDeleteOrganisation()

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !organisationId) {
            setNotification({
                open: true,
                variant: 'error',
                title: 'Validation Error',
                description: 'Organisation name cannot be empty.',
            })
            return
        }

        updateMutation.mutate({ organisationId, organisationName: name }, {
            onSuccess: () => {
                setNotification({
                    open: true,
                    variant: 'success',
                    title: 'Changes Saved',
                    description: "Your organisation's name has been updated successfully.",
                })
            },
            onError: (error) => {
                setNotification({
                    open: true,
                    variant: 'error',
                    title: 'Update Failed',
                    description: error.message || 'An unexpected error occurred.',
                })
            },
        })
    }

    const handleConfirmDelete = () => {
        if (!organisationId) return

        deleteMutation.mutate(organisationId, {
            onSuccess: () => {
                setNotification({
                    open: true,
                    variant: 'success',
                    title: 'Organisation Deleted',
                    description: 'The organisation has been successfully deleted.',
                })
            },
            onError: (error) => {
                setNotification({
                    open: true,
                    variant: 'error',
                    title: 'Deletion Failed',
                    description: error.message || 'The organisation could not be deleted.',
                })
            },
            onSettled: () => {
                setDeleteModalOpen(false)
            },
        })
    }

    return (
        <>
            <ContentPage title="Organisation Settings" titleAlignment="center">
                <div className="space-y-6 max-w-2xl mx-auto">
                    {/* General Settings Section */}
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Update your organisation's name.
                        </p>
                        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
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

                    {/* Danger Zone Section */}
                    <div className="p-6 bg-white rounded-lg shadow-sm border border-red-300">
                        <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                            <AlertTriangle size={20} />
                            Danger Zone
                        </h3>
                        <p className="text-gray-600 mt-2 mb-4">
                            This is a permanent action. Once the organisation is deleted, it cannot be recovered.
                        </p>
                        <Button variant="destructive" onClick={() => setDeleteModalOpen(true)} disabled={deleteMutation.isPending}>
                            Delete This Organisation
                        </Button>
                    </div>
                </div>
            </ContentPage>

            {/* --- Modals --- */}
            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={deleteMutation.isPending}
                title="Delete Organisation"
                description="Are you absolutely sure? This will permanently delete the organisation and all its data. This action cannot be undone."
            />

            <NotificationModal
                open={notification.open}
                onOpenChange={() => setNotification({ ...notification, open: false })}
                variant={notification.variant}
                title={notification.title}
                description={notification.description}
            />
        </>
    )
}

export default OrganisationSettingsPage
