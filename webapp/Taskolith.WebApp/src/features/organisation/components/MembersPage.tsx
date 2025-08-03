import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useGetMembersInsideOrganisation'
import { Permission } from '@/features/organisation/types/Permission'
import { type Member } from '@/features/organisation/types/Member'
import { Search, UserPlus, UserX, AlertCircle } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/components/ui/Button'

const MembersPage = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const { userId: currentUserId } = useAuth()

    const { data: members, isLoading, isError } = useGetMembersInsideOrganisation(organisationId!)

    const currentUserPermissions = useMemo(() => {
        if (!members || !currentUserId) return Permission.Public
        const currentUserAsMember = members.find(member => member.userId === currentUserId)
        if (!currentUserAsMember) return Permission.Public
        return currentUserAsMember.roles.reduce((acc, role) => acc | role.permissions, Permission.Public)
    }, [members, currentUserId])

    const [query, setQuery] = useState('')
    const hasPermission = (permission: number) => (currentUserPermissions & permission) === permission

    const filteredMembers = useMemo(() => {
        if (!members) return []
        const lowerCaseQuery = query.toLowerCase()
        return members.filter(member =>
            member.username?.toLowerCase().includes(lowerCaseQuery) ||
            member.email?.toLowerCase().includes(lowerCaseQuery) ||
            member.roles?.some(role => role.name?.toLowerCase().includes(lowerCaseQuery))
        )
    }, [members, query])

    const handleInvite = () => alert('Opening invite member modal...')
    const handleKick = (member: Member) => alert(`Kicking member: ${member.username}`)

    const renderTableBody = () => {
        if (isLoading) return <tr><td colSpan={3} className="text-center p-6 text-gray-500">Loading members...</td></tr>
        if (isError) return <tr><td colSpan={3} className="text-center p-6 text-red-600"><div className="flex justify-center items-center gap-2"><AlertCircle size={20} /><span>Failed to load members.</span></div></td></tr>

        if (filteredMembers.length > 0) {
            return filteredMembers.map(member => (
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
                        {hasPermission(Permission.KickMember) && member.userId !== currentUserId && (
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleKick(member)}
                                aria-label={`Kick ${member.username}`} // Important for accessibility
                            >
                                <UserX size={16} />
                            </Button>
                        )}
                    </td>
                </tr>
            ))
        }

        return <tr><td colSpan={3} className="text-center p-6 text-gray-500">No members found.</td></tr>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 h-full">
            <div className="max-w-4xl mx-auto flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Organisation Members</h1>
                        <p className="text-sm text-gray-500">Manage who has access to this organisation.</p>
                    </div>
                    {hasPermission(Permission.InviteMember) && (
                        <Button onClick={handleInvite} className="gap-2">
                            <UserPlus size={18} />
                            Invite Member
                        </Button>
                    )}
                </div>
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by username, email, or role..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isLoading || isError} />
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
                            <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MembersPage
