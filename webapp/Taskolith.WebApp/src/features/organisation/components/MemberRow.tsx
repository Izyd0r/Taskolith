import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Settings, UserX } from 'lucide-react'
import { type Member } from '@/features/organisation/types/Member'
import { useRemoveMember } from '@/features/organisation/hooks/useMembers'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'
import { NotificationModal } from '@/components/ui/NotificationModal'

export type MemberRowProps = {
    member: Member
    canKick: boolean
    isCurrentUser: boolean
    canManageRoles: boolean
    onManageRoles: () => void
    displayAs: 'row' | 'card'
}

interface NotificationState {
    open: boolean
    title: string
    description: string
    variant: 'success' | 'error'
}

export function MemberRow({ member, canKick, isCurrentUser, canManageRoles, onManageRoles, displayAs }: MemberRowProps) {
    const { organisationId } = useParams<{ organisationId: string }>()
    const queryClient = useQueryClient()
    const [isKickConfirmOpen, setKickConfirmOpen] = useState(false)
    const [notification, setNotification] = useState<NotificationState>({
        open: false, title: '', description: '', variant: 'error'
    })

    const { mutate: kickThisMember, isPending: isKicking } = useRemoveMember(organisationId!, member.memberId)

    const handleConfirmKick = () => {
        kickThisMember(undefined, {
            onSuccess: () => {
                setKickConfirmOpen(false)
                queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'members'] })
            },
            onError: (error: any) => {
                setKickConfirmOpen(false)
                setNotification({
                    open: true,
                    variant: 'error',
                    title: 'Failed to Remove Member',
                    description: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
                })
            },
        })
    }

    const userInitial = member.username?.charAt(0).toUpperCase() || '?'

    const ActionButtons = () => (
        <div className={displayAs === 'card' ? 'flex flex-col gap-2 pt-4 border-t border-gray-100' : 'flex justify-end gap-2'}>
            {canManageRoles && (
                <Button variant="outline" size={displayAs === 'card' ? 'sm' : 'icon'} onClick={onManageRoles} className={displayAs === 'card' ? 'w-full justify-center' : ''}>
                    <Settings size={16} className={displayAs === 'card' ? 'mr-2' : ''} />
                    {displayAs === 'card' ? 'Manage Roles' : ''}
                </Button>
            )}
            {canKick && !isCurrentUser && (
                <Button variant="destructive" size={displayAs === 'card' ? 'sm' : 'icon'} onClick={() => setKickConfirmOpen(true)} className={displayAs === 'card' ? 'w-full justify-center' : ''} disabled={isKicking}>
                    <UserX size={16} className={displayAs === 'card' ? 'mr-2' : ''} />
                    {displayAs === 'card' ? 'Kick Member' : ''}
                </Button>
            )}
        </div>
    )

    if (displayAs === 'card') {
        return (
            <>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-bold">{userInitial}</span>
                        </div>
                        <div className="ml-4 truncate">
                            <div className="text-sm font-semibold text-gray-900 truncate">{member.username}</div>
                            <div className="text-sm text-gray-500 truncate">{member.email || 'No email'}</div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Roles</p>
                        <div className="flex flex-wrap gap-2">
                            {member.roles?.length > 0 ? (
                                member.roles.map(role => (
                                    <span key={role.id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {role.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400">No roles assigned</span>
                            )}
                        </div>
                    </div>

                    <ActionButtons />
                </div>

                <DeleteConfirmationModal
                    open={isKickConfirmOpen}
                    onOpenChange={setKickConfirmOpen}
                    onConfirm={handleConfirmKick}
                    isDeleting={isKicking}
                    title="Kick Member"
                    description={`Are you sure you want to kick ${member.username}? They will be permanently removed from this organisation.`}
                />
                <NotificationModal
                    open={notification.open}
                    onOpenChange={() => setNotification({ ...notification, open: false })}
                    {...notification}
                />
            </>
        )
    }

    return (
        <>
            <tr className="bg-white hover:bg-gray-50 transition-colors duration-150 rounded-lg">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-bold">{userInitial}</span>
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
                            <span key={role.id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {role.name}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionButtons />
                </td>
            </tr>

            <DeleteConfirmationModal
                open={isKickConfirmOpen}
                onOpenChange={setKickConfirmOpen}
                onConfirm={handleConfirmKick}
                isDeleting={isKicking}
                title="Kick Member"
                description={`Are you sure you want to kick ${member.username}? They will be permanently removed from this organisation.`}
            />
            <NotificationModal
                open={notification.open}
                onOpenChange={() => setNotification({ ...notification, open: false })}
                {...notification}
            />
        </>
    )
}

