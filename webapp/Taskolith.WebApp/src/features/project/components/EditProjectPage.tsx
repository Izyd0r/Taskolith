import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useUpdateProject, useDeleteProject, useAssignMembersToProject, useRemoveMemberFromProject } from '@/features/organisation/hooks/useProjects'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useMembers'
import { type Project } from '@/features/organisation/types/Project'
import { Permission, type TPermission } from '@/features/organisation/types/Permission'

export default function EditProjectPage() {
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { userId: currentUserId } = useAuth()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [memberIdToAdd, setMemberIdToAdd] = useState('')
    const [memberIdToRemove, setMemberIdToRemove] = useState('')

    const { data: members, isLoading: isLoadingMembers } = useGetMembersInsideOrganisation(organisationId!)

    const permissions = useMemo(() => {
        const defaultPermissions = { canUpdate: false, canDelete: false, canAssign: false, canRemove: false }
        if (!members) return defaultPermissions

        const currentUserAsMember = members.find(m => m.userId === currentUserId)
        const userPermissions = currentUserAsMember?.roles.reduce((acc, role) => acc | role.permissions, 0) ?? 0
        const has = (p: TPermission) => (userPermissions & p) === p

        return {
            canUpdate: has(Permission.UpdateProject),
            canDelete: has(Permission.DeleteProject),
            canAssign: has(Permission.AssignProject),
            canRemove: has(Permission.RemoveFromProject),
        }
    }, [members, currentUserId])

    const project = useMemo(() => {
        if (!projectId) return null
        const allProjects: Project[] | undefined = queryClient.getQueryData(['projects', 'all', organisationId])
        const myProjects: Project[] | undefined = queryClient.getQueryData(['projects', 'me', organisationId])
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
    const assignMemberMutation = useAssignMembersToProject(organisationId!)
    const removeMemberMutation = useRemoveMemberFromProject(organisationId!)

    const invalidateProjectQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['projects', 'all', organisationId] })
        queryClient.invalidateQueries({ queryKey: ['projects', 'me', organisationId] })
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return alert('Project name cannot be empty.')
        updateMutation.mutate({ projectId: projectId!, payload: { name, description } }, {
            onSuccess: () => {
                alert('Project updated successfully!')
                invalidateProjectQueries()
            }
        })
    }

    const handleDelete = () => {
        if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
            deleteMutation.mutate(projectId!, {
                onSuccess: () => {
                    alert('Project deleted.')
                    invalidateProjectQueries()
                    navigate(`/organisations/${organisationId}/projects`)
                }
            })
        }
    }

    const handleAssignMember = () => {
        if (!memberIdToAdd.trim()) return alert('Please enter a member ID.')
        assignMemberMutation.mutate({ projectId: projectId!, membersId: [memberIdToAdd] }, {
            onSuccess: () => {
                alert('Member assigned successfully.')
                setMemberIdToAdd('')
                invalidateProjectQueries()
            },
            onError: (err: any) => alert(`Error: ${err.response?.data?.message || err.message}`)
        })
    }

    const handleRemoveMember = () => {
        if (!memberIdToRemove.trim()) return alert('Please enter a member ID.')
        removeMemberMutation.mutate({ projectId: projectId!, memberId: memberIdToRemove }, {
            onSuccess: () => {
                alert('Member removed successfully.')
                setMemberIdToRemove('')
                invalidateProjectQueries()
            },
            onError: (err: any) => alert(`Error: ${err.response?.data?.message || err.message}`)
        })
    }

    if (!project && !isLoadingMembers) {
        return <div className="p-6 text-center text-gray-600">Project not found. Please navigate from the projects list.</div>
    }

    return (
        <div className="max-w-2xl mx-auto mt-6 space-y-8 p-4">
            <h1 className="text-2xl font-bold">Edit Project: {project?.projectName}</h1>

            {permissions.canUpdate && (
                <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4">General Settings</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                            <InputField id="projectName" placeholder="Enter the new project name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="projectDescription" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="A short description of the project" className="w-full mt-1 p-2 border bg-gray-200 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</Button>
                    </form>
                </div>
            )}

            {(permissions.canAssign || permissions.canRemove) && (
                <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Manage Members</h2>
                    {permissions.canAssign && (
                        <div className="space-y-2 mb-4">
                            <label htmlFor="add-member" className="block text-sm font-medium text-gray-700">Add Member by ID</label>
                            <div className="flex items-center gap-2">
                                <InputField id="add-member" placeholder="Enter User ID to add" value={memberIdToAdd} onChange={e => setMemberIdToAdd(e.target.value)} className="flex-grow" />
                                <Button onClick={handleAssignMember} disabled={assignMemberMutation.isPending}>{assignMemberMutation.isPending ? 'Adding...' : 'Add'}</Button>
                            </div>
                        </div>
                    )}
                    {permissions.canRemove && (
                        <div className="space-y-2">
                            <label htmlFor="remove-member" className="block text-sm font-medium text-gray-700">Remove Member by ID</label>
                            <div className="flex items-center gap-2">
                                <InputField id="remove-member" placeholder="Enter User ID to remove" value={memberIdToRemove} onChange={e => setMemberIdToRemove(e.target.value)} className="flex-grow" />
                                <Button variant="destructive" onClick={handleRemoveMember} disabled={removeMemberMutation.isPending}>{removeMemberMutation.isPending ? 'Removing...' : 'Remove'}</Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {permissions.canDelete && (
                <div className="p-6 bg-white rounded-xl shadow-sm border-2 border-red-500">
                    <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
                    <p className="text-gray-600 mb-4">This will permanently delete the project and all its associated data.</p>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete This Project'}</Button>
                </div>
            )}
        </div>
    )
}
