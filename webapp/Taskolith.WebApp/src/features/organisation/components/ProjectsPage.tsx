import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { TextareaField } from '@/components/ui/TextareaField'
import { Plus, Trash, Users, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { type Project } from '@/features/organisation/types/Project'
import { Permission, type TPermission } from '@/features/organisation/types/Permission'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useGetMembersInsideOrganisation'
import {
    useGetAllProjects,
    useGetMyProjects,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
    useAssignMembersToProject,
    useRemoveMemberFromProject,
} from '@/features/organisation/hooks/useProjects'

function ManageMembersModal({
    organisationId,
    projectId,
    onClose,
    canAssign,
    canRemove,
}: {
    organisationId: string
    projectId: string
    onClose: () => void
    canAssign: boolean
    canRemove: boolean
}) {
    const [memberIdToAdd, setMemberIdToAdd] = useState('')
    const [memberIdToRemove, setMemberIdToRemove] = useState('')

    const assignMemberMutation = useAssignMembersToProject(organisationId)
    const removeMemberMutation = useRemoveMemberFromProject(organisationId)

    const handleAssignMember = () => {
        if (!memberIdToAdd.trim()) {
            alert('Please enter a member ID or username to add')
            return
        }
        assignMemberMutation.mutate(
            { projectId, membersId: [memberIdToAdd] },
            {
                onSuccess: () => {
                    alert(`Successfully initiated request to add '${memberIdToAdd}'`)
                    setMemberIdToAdd('')
                },
                onError: (error: any) => {
                    const message = error.response?.data?.message || error.message
                    alert(`Failed to add member: ${message}`)
                },
            }
        )
    }

    const handleRemoveMember = () => {
        if (!memberIdToRemove.trim()) {
            alert('Please enter a member ID or username to remove')
            return
        }
        removeMemberMutation.mutate(
            { projectId, memberId: memberIdToRemove },
            {
                onSuccess: () => {
                    alert(`Successfully initiated request to remove '${memberIdToRemove}'`)
                    setMemberIdToRemove('')
                },
                onError: (error: any) => {
                    const message = error.response?.data?.message || error.message
                    alert(`Failed to remove member: ${message}`)
                },
            }
        )
    }

    return (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Manage Members</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Enter a user's ID to add or remove them from this project.
                </p>
                {canAssign && (
                    <div className="space-y-2">
                        <InputField
                            id="member-to-add"
                            placeholder="Enter Member ID to Add"
                            value={memberIdToAdd}
                            onChange={(e) => setMemberIdToAdd(e.target.value)}
                        />
                        <Button onClick={handleAssignMember} disabled={assignMemberMutation.isPending}>
                            {assignMemberMutation.isPending ? 'Adding...' : 'Add Member'}
                        </Button>
                    </div>
                )}
                {canAssign && canRemove && <hr className="my-6" />}
                {canRemove && (
                    <div className="space-y-2">
                        <InputField
                            id="member-to-remove"
                            placeholder="Enter Member ID to Remove"
                            value={memberIdToRemove}
                            onChange={(e) => setMemberIdToRemove(e.target.value)}
                        />
                        <Button variant="destructive" onClick={handleRemoveMember} disabled={removeMemberMutation.isPending}>
                            {removeMemberMutation.isPending ? 'Removing...' : 'Remove Member'}
                        </Button>
                    </div>
                )}
                <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}

function ProjectTile({
    project,
    onEdit,
    onDelete,
    onManageMembers,
    onGoToKanban,
    canUpdate,
    canDelete,
    canManageMembers,
}: {
    project: Project
    onEdit: () => void
    onDelete: () => void
    onManageMembers: () => void
    onGoToKanban: () => void
    canUpdate: boolean
    canDelete: boolean
    canManageMembers: boolean
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg">{project.projectName}</h3>
                <p className="text-gray-600 text-sm">{project.projectDescription}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
                {canUpdate && (
                    <Button size="sm" variant="outline" onClick={onEdit}>
                        Edit
                    </Button>
                )}
                {canDelete && (
                    <Button size="sm" variant="destructive" onClick={onDelete} aria-label="Delete Project">
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
                {canManageMembers && (
                    <Button size="sm" onClick={onManageMembers} aria-label="Manage Members">
                        <Users className="h-4 w-4" />
                    </Button>
                )}
                <Button size="sm" variant="default" onClick={onGoToKanban}>
                    Go to Kanban
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default function ProjectsPage() {
    const { organisationId } = useParams<{ organisationId: string }>()
    const { userId: currentUserId } = useAuth()
    const navigate = useNavigate()

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const [isProjectModalOpen, setProjectModalOpen] = useState(false)
    const [form, setForm] = useState({ name: '', description: '' })
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    const { data: members, isLoading: isLoadingMembers } = useGetMembersInsideOrganisation(organisationId!)

    const permissions = useMemo(() => {
        const defaultPermissions = {
            canGetAllProjects: false, canCreate: false, canUpdate: false,
            canDelete: false, canAssign: false, canRemove: false,
        }
        if (!members) return defaultPermissions

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

    const { data: allProjects, isLoading: isLoadingAll, isError: isErrorAll } = useGetAllProjects(organisationId!, {
        enabled: !isLoadingMembers && permissions.canGetAllProjects,
    })

    const { data: myProjects, isLoading: isLoadingMy, isError: isErrorMy } = useGetMyProjects(organisationId!, {
        enabled: !isLoadingMembers && !permissions.canGetAllProjects,
    })

    const projects = permissions.canGetAllProjects ? allProjects : myProjects
    const isLoading = isLoadingMembers || (permissions.canGetAllProjects ? isLoadingAll : isLoadingMy)
    const isError = permissions.canGetAllProjects ? isErrorAll : isErrorMy

    const createProjectMutation = useCreateProject(organisationId!)
    const updateProjectMutation = useUpdateProject(organisationId!)
    const deleteProjectMutation = useDeleteProject(organisationId!)

    const handleCreateOrUpdate = () => {
        if (!organisationId) return

        const mutationOptions = {
            onSuccess: () => {
                setProjectModalOpen(false)
                setEditingProject(null)
            },
        }

        if (editingProject) {
            updateProjectMutation.mutate({
                projectId: editingProject.projectId,
                payload: { name: form.name, description: form.description },
            }, mutationOptions)
        } else {
            createProjectMutation.mutate({ name: form.name, description: form.description }, mutationOptions)
        }
    }

    const handleDeleteProject = (projectId: string) => {
        if (!organisationId) return
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProjectMutation.mutate(projectId)
        }
    }

    const handleGoToKanban = (projectId: string) => {
        navigate(`/organisations/${organisationId}/projects/${projectId}`)
    }

    if (isLoading) {
        return <div className="p-6 text-gray-500">Loading projects...</div>
    }

    if (isError) {
        return (
            <div className="p-6 text-red-600 flex gap-2 items-center">
                <AlertCircle size={18} /> Failed to load projects. You may not have the required permissions.
            </div>
        )
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Projects</h1>
                {permissions.canCreate && (
                    <Button
                        onClick={() => {
                            setEditingProject(null)
                            setForm({ name: '', description: '' })
                            setProjectModalOpen(true)
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                )}
            </div>

            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
                {projects && projects.length > 0 ? (
                    projects.map((project: Project) => (
                        <ProjectTile
                            key={project.projectId}
                            project={project}
                            onEdit={() => {
                                setEditingProject(project)
                                setForm({ name: project.projectName, description: project.projectDescription })
                                setProjectModalOpen(true)
                            }}
                            onDelete={() => handleDeleteProject(project.projectId)}
                            onManageMembers={() => setSelectedProjectId(project.projectId)}
                            onGoToKanban={() => handleGoToKanban(project.projectId)}
                            canUpdate={permissions.canUpdate}
                            canDelete={permissions.canDelete}
                            canManageMembers={permissions.canAssign || permissions.canRemove}
                        />
                    ))
                ) : (
                    <div className="text-center p-10 text-gray-500">No projects found.</div>
                )}
            </div>

            {isProjectModalOpen && (
                <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProject ? 'Edit Project' : 'Create New Project'}
                        </h2>
                        <div className="space-y-4">
                            <InputField
                                id="projectName"
                                placeholder="Project Name"
                                value={form.name}
                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <TextareaField
                                id="projectDescription"
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="mt-6 flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setProjectModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateOrUpdate} disabled={updateProjectMutation.isPending || createProjectMutation.isPending}>
                                {editingProject ? 'Update Project' : 'Create Project'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {selectedProjectId && (
                <ManageMembersModal
                    organisationId={organisationId!}
                    projectId={selectedProjectId}
                    onClose={() => setSelectedProjectId(null)}
                    canAssign={permissions.canAssign}
                    canRemove={permissions.canRemove}
                />
            )}
        </div>
    )
}
