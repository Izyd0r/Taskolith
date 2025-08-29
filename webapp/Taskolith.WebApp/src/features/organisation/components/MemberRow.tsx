import React from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Settings, UserX } from 'lucide-react'
import { type Member } from '@/features/organisation/types/Member'
import { useRemoveMember } from '@/features/organisation/hooks/useRemoveMember'

export type MemberRowProps = {
    member: Member
    canKick: boolean
    isCurrentUser: boolean
    canManageRoles: boolean
    onManageRoles: () => void
    displayAs: 'row' | 'card'
}

export function MemberRow({ member, canKick, isCurrentUser, canManageRoles, onManageRoles, displayAs }: MemberRowProps) {
    const { organisationId } = useParams<{ organisationId: string }>()
    const queryClient = useQueryClient()
    const { mutate: kickThisMember, isPending: isKicking } = useRemoveMember(organisationId!, member.memberId)

    const handleKick = () => {
        if (window.confirm(`Are you sure you want to kick ${member.username}?`)) {
            kickThisMember(undefined, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'members'] })
                },
                onError: () => alert('Failed to remove member. Please try again.'),
            })
        }
    }

    if (displayAs === 'card') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-bold">{member.username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{member.username}</div>
                        <div className="text-sm text-gray-500">{member.email || 'No email'}</div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Roles</p>
                    <div className="flex flex-wrap gap-2">
                        {member.roles?.length > 0 ? (
                            member.roles.map((role) => (
                                <span key={role.id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {role.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400">No roles assigned</span>
                        )}
                    </div>
                </div>

                {(canManageRoles || (canKick && !isCurrentUser)) && (
                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                        {canManageRoles && (
                            <Button variant="outline" size="sm" onClick={onManageRoles} className="w-full justify-center">
                                <Settings size={16} className="mr-2" /> Manage Roles
                            </Button>
                        )}
                        {canKick && !isCurrentUser && (
                            <Button variant="destructive" size="sm" onClick={handleKick} disabled={isKicking} className="w-full justify-center">
                                <UserX size={16} className="mr-2" /> Kick Member
                            </Button>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <tr>
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
                    {member.roles?.map((role) => (
                        <span key={role.id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {role.name}
                        </span>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                    {canManageRoles && (
                        <Button variant="outline" size="sm" onClick={onManageRoles} aria-label="Manage Roles">
                            <Settings size={16} className="mr-2" /> Manage Roles
                        </Button>
                    )}
                    {canKick && !isCurrentUser && (
                        <Button variant="destructive" size="icon" onClick={handleKick} aria-label={`Kick ${member.username}`} disabled={isKicking}>
                            <UserX size={16} />
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    )
}
