import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '@/features/auth/context/AuthContext'
import { Permission, type TPermission } from '@/features/organisation/types/Permission'

import { useGetProjectMembers } from '@/features/project/hooks/useGetProjectMembers'
import { useGetProjectTasks } from '@/features/project/hooks/useGetProjectTasks'
import { useRemoveProjectMember } from '@/features/project/hooks/useRemoveProjectMember'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useMembers'

import { type ProjectMember } from '@/features/project/types/ProjectMember'
import { type Task } from '@/features/project/types/Task'

import { ListPageLayout } from '@/components/layout/ListPageLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { NotificationModal, type Notification } from '@/components/ui/NotificationModal'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'
import { AddMembersModal } from '@/features/project/components/AddMembersModal'
import { MemberTasksModal } from '@/features/project/components/MemberTasksModal'

import { UserPlus, UserX, ListTodo } from 'lucide-react'

const ProjectMemberRow = ({
    member,
    taskCount,
    onManageTasks,
    onRemove,
    canManageTasks,
    canRemoveMember,
}: {
    member: ProjectMember
    taskCount: number
    onManageTasks: () => void
    onRemove: () => void
    canManageTasks: boolean
    canRemoveMember: boolean
}) => {
    return (
        <tr className="bg-white hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{member.username}</div>
                <div className="text-sm text-gray-500">{member.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                {taskCount} task{taskCount !== 1 ? 's' : ''}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                    {canManageTasks && (
                        <Button variant="outline" size="sm" onClick={onManageTasks} className="gap-2">
                            <ListTodo size={16} /> Manage Tasks
                        </Button>
                    )}
                    {canRemoveMember && (
                        <Button variant="destructive" size="icon" onClick={onRemove} title="Remove from project">
                            <UserX size={16} />
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    )
}

export default function ProjectMembersPage() {
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()
    const { user } = useAuth()

    const [query, setQuery] = useState('')
    const [isAddModalOpen, setAddModalOpen] = useState(false)
    const [notification, setNotification] = useState<Notification | null>(null)
    const [memberToRemove, setMemberToRemove] = useState<ProjectMember | null>(null)
    const [managingTasksForMember, setManagingTasksForMember] = useState<ProjectMember | null>(null)

    const { data: orgMembers, isLoading: isLoadingOrgMembers } = useGetMembersInsideOrganisation(organisationId!)
    const { data: projectMembers = [], isLoading: isLoadingProjectMembers } = useGetProjectMembers(organisationId, projectId)
    const { data: tasks = [], isLoading: isLoadingTasks } = useGetProjectTasks(organisationId, projectId)
    const { mutate: removeMember, isPending: isRemoving } = useRemoveProjectMember(organisationId!, projectId!)

    const permissions = useMemo(() => {
        const defaultPermissions = { canAssign: false, canRemove: false, canAssignTask: false, canRemoveFromTask: false }
        if (!orgMembers || !user?.userId) return defaultPermissions

        const currentUserAsMember = orgMembers.find(m => m.userId === user.userId)
        const userPermissions = currentUserAsMember?.roles.reduce((acc, role) => acc | role.permissions, 0) ?? 0
        const has = (p: TPermission) => (userPermissions & p) === p

        return {
            canAssign: has(Permission.AssignProject),
            canRemove: has(Permission.RemoveFromProject),
            canAssignTask: has(Permission.AssignTask),
            canRemoveFromTask: has(Permission.RemoveFromTask),
        }
    }, [orgMembers, user?.userId])

    const filteredMembers = useMemo(() => {
        if (!query) return projectMembers
        return projectMembers.filter(member =>
            member.username.toLowerCase().includes(query.toLowerCase()) ||
            member.email.toLowerCase().includes(query.toLowerCase())
        )
    }, [projectMembers, query])

    const tasksByMember = useMemo(() => {
        const map = new Map<string, Task[]>()
        if (projectMembers.length > 0) {
            projectMembers.forEach(member => {
                const memberTasks = tasks.filter(task =>
                    task.assignedMembers.some(assigned => assigned.userId === member.userId)
                )
                map.set(member.memberId, memberTasks)
            })
        }
        return map
    }, [projectMembers, tasks])

    const handleConfirmRemove = () => {
        if (!memberToRemove) return
        removeMember(memberToRemove.memberId, {
            onSuccess: () => {
                setNotification({ open: true, variant: 'success', title: 'Member Removed', description: `${memberToRemove.username} has been removed from the project.` })
                setMemberToRemove(null)
            },
            onError: (error: any) => {
                setNotification({ open: true, variant: 'error', title: 'Removal Failed', description: error.message || 'An unexpected error occurred.' })
                setMemberToRemove(null)
            }
        })
    }

    const isLoading = isLoadingOrgMembers || isLoadingProjectMembers || isLoadingTasks;

    return (
        <>
            <ListPageLayout
                title="Project Members"
                description="Manage who has access to this project and their assigned tasks."
                searchQuery={query}
                onSearchChange={setQuery}
                searchPlaceholder="Filter members by name or email..."
                actionButton={
                    permissions.canAssign && (
                        <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                            <UserPlus size={16} /> Add Member
                        </Button>
                    )
                }
            >
                <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                    <div className="max-h-[70vh] overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Assignments</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr><td colSpan={3} className="text-center p-10"><LoadingSpinner /></td></tr>
                                ) : filteredMembers.length > 0 ? (
                                    filteredMembers.map(member => (
                                        <ProjectMemberRow
                                            key={member.memberId}
                                            member={member}
                                            taskCount={tasksByMember.get(member.memberId)?.length || 0}
                                            onManageTasks={() => setManagingTasksForMember(member)}
                                            onRemove={() => setMemberToRemove(member)}
                                            canManageTasks={permissions.canAssignTask || permissions.canRemoveFromTask}
                                            canRemoveMember={permissions.canRemove}
                                        />
                                    ))
                                ) : (
                                    <tr><td colSpan={3} className="text-center p-6 text-gray-500">No members found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ListPageLayout>

            <AddMembersModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                organisationId={organisationId!}
                projectId={projectId!}
                currentProjectMembers={projectMembers}
            />

            <MemberTasksModal
                isOpen={!!managingTasksForMember}
                onClose={() => setManagingTasksForMember(null)}
                member={managingTasksForMember}
                allProjectTasks={tasks}
                organisationId={organisationId!}
                projectId={projectId!}
                setNotification={setNotification}
            />

            <DeleteConfirmationModal
                open={!!memberToRemove}
                onOpenChange={() => setMemberToRemove(null)}
                onConfirm={handleConfirmRemove}
                isDeleting={isRemoving}
                title="Remove Member"
                description={`Are you sure you want to remove ${memberToRemove?.username} from this project?`}
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
