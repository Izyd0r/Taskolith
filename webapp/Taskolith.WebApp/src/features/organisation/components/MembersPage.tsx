import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useGetMembersInsideOrganisation'
import { useRemoveMember } from '@/features/organisation/hooks/useRemoveMember'
import { Permission } from '@/features/organisation/types/Permission'
import { type Member } from '@/features/organisation/types/Member'
import { type Role } from '@/features/organisation/types/Role'
import { Search, UserPlus, UserX, AlertCircle } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { InviteMemberModal } from '@/features/organisation/components/InviteMemberModal'

const MemberRow = ({ member, canKick, isCurrentUser }: { member: Member, canKick: boolean, isCurrentUser: boolean }) => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const queryClient = useQueryClient()
    const { mutate: kickThisMember, isPending } = useRemoveMember(organisationId!, member.memberId)

    const handleKick = () => {
        if (window.confirm(`Are you sure you want to kick ${member.username}?`)) {
            kickThisMember(undefined, {
                onSuccess: () => {
                    const queryKey = ['organisation', organisationId, 'members']

                    queryClient.setQueryData<Member[]>(queryKey, (oldData) => {
                        if (!oldData) return []
                        return oldData.filter(m => m.memberId !== member.memberId)
                    })
                },
                onError: () => {
                    alert('Failed to remove member. Please try again.')
                }
            })
        }
    }

    return (
        <tr key={member.memberId}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-bold">{member.username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.username}</div>
                        <div className="text-sm text-gray-500">{member.email || 'No email'}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-2">
                    {member.roles?.map(role => (
                        <span key={role.id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{role.name}</span>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {canKick && !isCurrentUser && (
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleKick}
                        aria-label={`Kick ${member.username}`}
                        disabled={isPending}
                    >
                        <UserX size={16} />
                    </Button>
                )}
            </td>
        </tr>
    )
}

const MembersPage = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const { userId: currentUserId } = useAuth()
    const { data: members, isLoading, isError } = useGetMembersInsideOrganisation(organisationId!)
    const [query, setQuery] = useState('')
    const [isInviteModalOpen, setInviteModalOpen] = useState(false)

    const pageState = useMemo(() => {
        if (!members) {
            return {
                canInvite: false,
                canKick: false,
                filteredMembers: []
            }
        }

        const currentUserAsMember = members.find(member => member.userId === currentUserId)
        const currentUserPermissions = currentUserAsMember
            ? currentUserAsMember.roles.reduce((acc: number, role: Role) => acc | role.permissions, Permission.Public)
            : Permission.Public

        const hasPermission = (permission: number) => (currentUserPermissions & permission) === permission

        const lowerCaseQuery = query.toLowerCase()
        const filteredMembers = members.filter(member =>
            member.username?.toLowerCase().includes(lowerCaseQuery) ||
            member.email?.toLowerCase().includes(lowerCaseQuery) ||
            member.roles?.some(role => role.name?.toLowerCase().includes(lowerCaseQuery))
        )

        return {
            canInvite: hasPermission(Permission.InviteMember),
            canKick: hasPermission(Permission.KickMember),
            filteredMembers,
        }
    }, [members, currentUserId, query])

    const handleInvite = () => setInviteModalOpen(true)

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 h-full">
            <div className="max-w-4xl mx-auto flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Organisation Members</h1>
                        <p className="text-sm text-gray-500">Manage who has access to this organisation.</p>
                    </div>
                    {pageState.canInvite && (
                        <Button onClick={handleInvite} className="gap-2">
                            <UserPlus size={18} />
                            Invite Member
                        </Button>
                    )}
                </div>
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Filter by username, email, or role..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading || isError}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden flex-1 overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Roles</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr><td colSpan={3} className="text-center p-6 text-gray-500">Loading members...</td></tr>
                                ) : isError ? (
                                    <tr><td colSpan={3} className="text-center p-6 text-red-600"><div className="flex justify-center items-center gap-2"><AlertCircle size={20} /><span>Failed to load members.</span></div></td></tr>
                                ) : pageState.filteredMembers.length > 0 ? (
                                    pageState.filteredMembers.map(member => (
                                        <MemberRow
                                            key={member.memberId}
                                            member={member}
                                            canKick={pageState.canKick}
                                            isCurrentUser={member.userId === currentUserId}
                                        />
                                    ))
                                ) : (
                                    <tr><td colSpan={3} className="text-center p-6 text-gray-500">No members found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {organisationId && (
                <InviteMemberModal
                    open={isInviteModalOpen}
                    onOpenChange={setInviteModalOpen}
                    organisationId={organisationId}
                />
            )}
        </div>
    )
}

export default MembersPage
