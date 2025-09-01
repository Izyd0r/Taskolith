import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import { type Project } from '@/features/organisation/types/Project'
import { Permission, type TPermission } from '@/features/organisation/types/Permission'

import { useUpdateProject, useDeleteProject } from '@/features/organisation/hooks/useProjects'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useMembers'

import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { NotificationModal, type Notification } from '@/components/ui/NotificationModal'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Users } from 'lucide-react'

export default function EditProjectPage() {
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [notification, setNotification] = useState<Notification | null>(null)

    const { data: members, isLoading: isLoadingMembers } = useGetMembersInsideOrganisation(organisationId!)

    const permissions = useMemo(() => {
        const defaultPermissions = { canUpdate: false, canDelete: false, canAssign: false, canRemove: false }
        if (!members || !user?.userId) return defaultPermissions

        const currentUserAsMember = members.find(m => m.userId === user.userId)
        const userPermissions = currentUserAsMember?.roles.reduce((acc, role) => acc | role.permissions, 0) ?? 0
        const has = (p: TPermission) => (userPermissions & p) === p

        return {
            canUpdate: has(Permission.UpdateProject),
            canDelete: has(Permission.DeleteProject),
            canAssign: has(Permission.AssignProject),
            canRemove: has(Permission.RemoveFromProject),
        }
    }, [members, user?.userId])

    const project = useMemo(() => {
        if (!projectId) return null
        const allProjects: Project[] | undefined = queryClient.getQueryData(['projects', organisationId, 'all'])
        const myProjects: Project[] | undefined = queryClient.getQueryData(['projects', organisationId, 'me'])
        return allProjects?.find(p => p.projectId === projectId) || myProjects?.find(p => p.projectId === projectId)
    }, [queryClient, organisationId, projectId])

    useEffect(() => {
        if (project) {
            setName(project.projectName)
            setDescription(project.projectDescription || '')
        }
    }, [project])

    const updateMutation = useUpdateProject(organisationId!)
    const deleteMutation = useDeleteProject(organisationId!)

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            setNotification({ open: true, variant: 'error', title: 'Validation Error', description: 'Project name cannot be empty.' })
            return
        }
        updateMutation.mutate({ projectId: projectId!, payload: { name, description } }, {
            onSuccess: () => {
                setNotification({ open: true, variant: 'success', title: 'Success', description: 'Project updated successfully!' })
            },
            onError: (err: any) => setNotification({ open: true, variant: 'error', title: 'Update Failed', description: err.message })
        })
    }

    const handleConfirmDelete = () => {
        deleteMutation.mutate(projectId!, {
            onSuccess: () => {
                setNotification({ open: true, variant: 'success', title: 'Success', description: 'Project has been deleted.' })
                setTimeout(() => navigate(`/organisations/${organisationId}/projects`), 1500)
            },
            onError: (err: any) => setNotification({ open: true, variant: 'error', title: 'Deletion Failed', description: err.message }),
            onSettled: () => setDeleteModalOpen(false)
        })
    }

    if (isLoadingMembers) {
        return <LoadingSpinner />
    }

    if (!project) {
        return <div className="p-6 text-center text-gray-600">Project not found or you do not have access.</div>
    }

    return (
        <>
            <div className="max-w-2xl mx-auto mt-6 space-y-8 p-4">

                {permissions.canUpdate && (
                    <div className="p-6 bg-white rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">General Settings</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <InputField
                                    id="projectName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter the project name"
                                />
                            </div>
                            <div>
                                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="projectDescription"
                                    rows={4}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="A short description of the project"
                                    className="w-full mt-1 p-2 border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</Button>
                        </form>
                    </div>
                )}

                {(permissions.canAssign || permissions.canRemove) && (
                    <div className="p-6 bg-white rounded-xl shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Manage Members</h2>
                                <p className="text-sm text-gray-500 mt-1">Add or remove members from this project.</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/organisations/${organisationId}/projects/${projectId}/members`)}
                                className="gap-2"
                            >
                                <Users size={16} /> Go to Members Page
                            </Button>
                        </div>
                    </div>
                )}

                {permissions.canDelete && (
                    <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-red-500">
                        <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-gray-600 mb-4">This will permanently delete the project and all its associated data.</p>
                        <Button variant="destructive" onClick={() => setDeleteModalOpen(true)} disabled={deleteMutation.isPending}>
                            Delete This Project
                        </Button>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={deleteMutation.isPending}
                title="Delete Project"
                description="Are you absolutely sure? This action will permanently delete the project and cannot be undone."
            />

            {notification && (
                <NotificationModal
                    open={notification.open}
                    onOpenChange={(open) => setNotification({ ...notification, open })}
                    variant={notification.variant}
                    title={notification.title}
                    description={notification.description}
                />
            )}
        </>
    )
}
