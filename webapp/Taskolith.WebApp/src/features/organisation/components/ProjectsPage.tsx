import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { TextareaField } from '@/components/ui/TextareaField'
import {
    useGetProjects,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
    useAssignMembersToProject,
    useRemoveMemberFromProject,
} from '@/features/organisation/hooks/useProjects'
import { type Project } from '@/features/organisation/types/Project'
import { Plus, Trash, Users, ArrowRight } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useGetMembersInsideOrganisation'
import { Permission } from '@/features/organisation/types/Permission'

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
                onError: (error) => {
                    alert(`Failed to add member: ${error.message}`)
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
                onError: (error) => {
                    alert(`Failed to remove member: ${error.message}`)
                },
            }
        )
    }

    return (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Manage Members</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Please enter a user ID to add or remove them from the project
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
                            {assignMemberMutation.isPending ? 'Adding' : 'Add Member'}
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
                            {removeMemberMutation.isPending ? 'Removing' : 'Remove Member'}
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
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { userId: currentUserId } = useAuth()

    const { data: projects, isLoading: isLoadingProjects } = useGetProjects(organisationId ?? '')
    const { data: members, isLoading: isLoadingMembers } = useGetMembersInsideOrganisation(organisationId ?? '')
    const createProject = useCreateProject(organisationId ?? '')
    const updateProject = useUpdateProject(organisationId ?? '')
    const deleteProject = useDeleteProject(organisationId ?? '')

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
    const [openProjectModal, setOpenProjectModal] = useState(false)
    const [form, setForm] = useState({ name: '', description: '' })
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    const permissions = useMemo(() => {
        if (!members) return { canCreate: false, canUpdate: false, canDelete: false, canAssign: false, canRemove: false }

        const currentUserAsMember = members.find(m => m.userId === currentUserId)
        const currentUserPermissions = currentUserAsMember
            ? currentUserAsMember.roles.reduce((acc: number, role) => acc | role.permissions, Permission.Public)
            : Permission.Public

        const has = (p: number) => (currentUserPermissions & p) === p

        return {
            canCreate: has(Permission.CreateProject),
            canUpdate: has(Permission.UpdateProject),
            canDelete: has(Permission.DeleteProject),
            canAssign: has(Permission.AssignProject),
            canRemove: has(Permission.RemoveFromProject),
        }
    }, [members, currentUserId])

    const handleCreateOrUpdate = () => {
        if (!organisationId) return
        const mutationOptions = {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['projects', organisationId] })
                setOpenProjectModal(false)
                setEditingProject(null)
            },
        }

        if (editingProject) {
            updateProject.mutate(
                {
                    projectId: editingProject.projectId,
                    payload: { name: form.name, description: form.description },
                },
                mutationOptions
            )
        } else {
            createProject.mutate(
                { name: form.name, description: form.description },
                mutationOptions
            )
        }
    }

    const handleDeleteProject = (projectId: string) => {
        if (!organisationId) return
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject.mutate(projectId, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['projects', organisationId] })
                },
            })
        }
    }

    const handleGoToKanban = (projectId: string) => {
        navigate(`/organisations/${organisationId}/projects/${projectId}`)
    }
    
    const isLoading = isLoadingProjects || isLoadingMembers;
    if (isLoading) return <div>Loading...</div>

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Projects</h1>
                {permissions.canCreate && (
                    <Button
                        onClick={() => {
                            setEditingProject(null)
                            setForm({ name: '', description: '' })
                            setOpenProjectModal(true)
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                )}
            </div>

            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
                {projects?.map((project: Project) => (
                    <ProjectTile
                        key={project.projectId}
                        project={project}
                        onEdit={() => {
                            setEditingProject(project)
                            setForm({
                                name: project.projectName,
                                description: project.projectDescription,
                            })
                            setOpenProjectModal(true)
                        }}
                        onDelete={() => handleDeleteProject(project.projectId)}
                        onManageMembers={() => setSelectedProjectId(project.projectId)}
                        onGoToKanban={() => handleGoToKanban(project.projectId)}
                        canUpdate={permissions.canUpdate}
                        canDelete={permissions.canDelete}
                        canManageMembers={permissions.canAssign || permissions.canRemove}
                    />
                ))}
            </div>

            {openProjectModal && (
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
                            <Button variant="outline" onClick={() => setOpenProjectModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateOrUpdate} disabled={updateProject.isPending || createProject.isPending}>
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
