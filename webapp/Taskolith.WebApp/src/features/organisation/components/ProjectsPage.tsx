import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { type Project } from '@/features/organisation/types/Project'
import { Permission, type TPermission } from '@/features/organisation/types/Permission'

import { ContentPage } from '@/components/layout/ContentPage'
import { ProjectTile } from '@/features/organisation/components/ProjectTile'
import { ManageMembersModal } from '@/features/organisation/components/ManageMembersModal'
import { ProjectFormModal } from '@/features/organisation/components/ProjectFormModal'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'
import { NotificationModal, type Notification } from '@/components/ui/NotificationModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useMembers'
import { useGetAllProjects, useGetMyProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/features/organisation/hooks/useProjects'

export default function ProjectsPage() {
    const { organisationId } = useParams<{ organisationId: string }>()
    const { user } = useAuth()
    const currentUserId = user?.userId
    const navigate = useNavigate()

    const [view, setView] = useState<'all' | 'my'>('my')
    const [isProjectModalOpen, setProjectModalOpen] = useState(false)
    const [isMemberModalOpen, setMemberModalOpen] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(null)
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    const [notification, setNotification] = useState<Notification>({
        open: false,
        variant: 'success',
        title: '',
        description: '',
    })

    const { data: members, isLoading: isLoadingMembers } = useGetMembersInsideOrganisation(organisationId!)

    const permissions = useMemo(() => {
        const defaultPermissions = { canGetAllProjects: false, canCreate: false, canUpdate: false, canDelete: false, canAssign: false, canRemove: false }
        if (!members || !currentUserId) return defaultPermissions

        const currentUserAsMember = members.find(m => m.userId === currentUserId)
        const userPermissions = currentUserAsMember?.roles.reduce((acc, role) => acc | role.permissions, 0) ?? 0
        const has = (p: TPermission) => (userPermissions & p) === p

        return {
            canGetAllProjects: has(Permission.GetAllProjects),
            canCreate: has(Permission.CreateProject),
            canUpdate: has(Permission.UpdateProject),
            canDelete: has(Permission.DeleteProject),
            canAssign: has(Permission.AssignProject),
            canRemove: has(Permission.RemoveFromProject),
        }
    }, [members, currentUserId])

    useEffect(() => {
        if (!isLoadingMembers) {
            setView(permissions.canGetAllProjects ? 'all' : 'my')
        }
    }, [isLoadingMembers, permissions.canGetAllProjects])

    const { data: allProjects, isLoading: isLoadingAll } = useGetAllProjects(organisationId!, { enabled: view === 'all' })
    const { data: myProjects, isLoading: isLoadingMy } = useGetMyProjects(organisationId!, { enabled: view === 'my' })

    const projects = view === 'all' ? allProjects : myProjects
    const isLoading = isLoadingMembers || isLoadingAll || isLoadingMy

    const createProjectMutation = useCreateProject(organisationId!)
    const updateProjectMutation = useUpdateProject(organisationId!)
    const deleteProjectMutation = useDeleteProject(organisationId!)

    const handleCreateOrUpdate = (form: { name: string, description: string }) => {
        const commonOptions = {
            onSuccess: (successMessage: string) => {
                setNotification({ open: true, variant: 'success', title: 'Success', description: successMessage })
                setProjectModalOpen(false)
                setEditingProject(null)
            },
            onError: (error: Error) => {
                setNotification({ open: true, variant: 'error', title: 'Error', description: error.message || "An unexpected error occurred." })
            },
        }

        if (editingProject) {
            updateProjectMutation.mutate({ projectId: editingProject.projectId, payload: form }, {
                onSuccess: () => commonOptions.onSuccess('The project was updated successfully.'),
                onError: commonOptions.onError,
            })
        } else {
            createProjectMutation.mutate(form, {
                onSuccess: () => commonOptions.onSuccess('The project was created successfully.'),
                onError: commonOptions.onError,
            })
        }
    }

    const handleConfirmDelete = () => {
        if (!projectIdToDelete) return

        deleteProjectMutation.mutate(projectIdToDelete, {
            onSuccess: () => {
                setNotification({
                    open: true,
                    variant: 'success',
                    title: 'Project Deleted',
                    description: 'The project has been successfully deleted.',
                })
            },
            onError: (error: Error) => {
                setNotification({
                    open: true,
                    variant: 'error',
                    title: 'Deletion Failed',
                    description: error.message || 'The project could not be deleted.',
                })
            },
            onSettled: () => {
                setDeleteModalOpen(false)
                setProjectIdToDelete(null)
            },
        })
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <>
            <ContentPage
                title="Projects"
                topContent={
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start md:justify-end gap-3 w-full">
                        {permissions.canGetAllProjects && (
                            <div className="flex items-center rounded-lg bg-gray-200 p-1 text-sm flex-shrink-0">
                                <button
                                    onClick={() => setView('all')}
                                    className={`px-3 py-1 rounded-md transition-colors duration-200 ${view === 'all'
                                        ? 'bg-white shadow-sm font-semibold text-gray-800'
                                        : 'bg-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    All Projects
                                </button>
                                <button
                                    onClick={() => setView('my')}
                                    className={`px-3 py-1 rounded-md transition-colors duration-200 ${view === 'my'
                                        ? 'bg-white shadow-sm font-semibold text-gray-800'
                                        : 'bg-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    My Projects
                                </button>
                            </div>
                        )}
                        {permissions.canCreate && (
                            <Button onClick={() => { setEditingProject(null); setProjectModalOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> New Project
                            </Button>
                        )}
                    </div>
                }
            >
                <div className="space-y-3">
                    {projects && projects.length > 0 ? (
                        projects.map((project: Project) => (
                            <ProjectTile
                                key={project.projectId}
                                project={project}
                                onEdit={() => { setEditingProject(project); setProjectModalOpen(true); }}
                                onDelete={() => {
                                    setProjectIdToDelete(project.projectId)
                                    setDeleteModalOpen(true)
                                }}
                                onManageMembers={() => { setSelectedProjectId(project.projectId); setMemberModalOpen(true); }}
                                onGoToKanban={() => navigate(`/organisations/${organisationId}/projects/${project.projectId}`)}
                                canUpdate={permissions.canUpdate}
                                canDelete={permissions.canDelete}
                                canManageMembers={permissions.canAssign || permissions.canRemove}
                            />
                        ))
                    ) : (
                        <div className="text-center p-10 text-gray-500">No projects found.</div>
                    )}
                </div>
            </ContentPage>

            <ProjectFormModal
                open={isProjectModalOpen}
                onOpenChange={setProjectModalOpen}
                onSubmit={handleCreateOrUpdate}
                isMutating={createProjectMutation.isPending || updateProjectMutation.isPending}
                editingProject={editingProject}
            />

            {selectedProjectId && (
                <ManageMembersModal
                    open={isMemberModalOpen}
                    onOpenChange={setMemberModalOpen}
                    organisationId={organisationId!}
                    projectId={selectedProjectId}
                    canAssign={permissions.canAssign}
                    canRemove={permissions.canRemove}
                />
            )}

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={deleteProjectMutation.isPending}
                title="Delete Project"
                description="Are you sure you want to delete this project? All associated tasks and data will be permanently removed. This action cannot be undone."
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
