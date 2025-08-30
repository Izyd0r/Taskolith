import React from 'react'
import { AlertCircle } from 'lucide-react'
import { type Member } from '@/features/organisation/types/Member'
import { MemberRow } from './MemberRow'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

type MemberListProps = {
    members: Member[]
    isLoading: boolean
    isError: boolean
    currentUserId?: string
    canKick: boolean
    canManageRoles: boolean
    onManageRoles: (member: Member) => void
}

export function MemberList({
    members,
    isLoading,
    isError,
    currentUserId,
    canKick,
    canManageRoles,
    onManageRoles,
}: MemberListProps) {
    if (isLoading) {
        return <div className="bg-white rounded-lg shadow h-full"><LoadingSpinner /></div>
    }

    if (isError) {
        return (
            <div className="bg-white rounded-lg shadow h-full flex justify-center items-center text-red-600 gap-2">
                <AlertCircle size={20} />
                <span>Failed to load members.</span>
            </div>
        )
    }

    if (members.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="text-center p-6 text-gray-500">No members found.</div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow max-h-full flex flex-col">
            <div className="overflow-y-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Roles</th>
                            <th className="relative px-6 py-3 w-1/5"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map(member => (
                            <MemberRow
                                key={member.memberId}
                                member={member}
                                canKick={canKick}
                                isCurrentUser={member.userId.toLowerCase() === currentUserId}
                                canManageRoles={canManageRoles}
                                onManageRoles={() => onManageRoles(member)}
                                displayAs="row"
                            />
                        ))}
                    </tbody>
                </table>

                <div className="md:hidden space-y-3">
                    {members.map(member => (
                        <MemberRow
                            key={member.memberId}
                            member={member}
                            canKick={canKick}
                            isCurrentUser={member.userId.toLowerCase() === currentUserId}
                            canManageRoles={canManageRoles}
                            onManageRoles={() => onManageRoles(member)}
                            displayAs="card"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
