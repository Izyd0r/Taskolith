import React from 'react'
import { Button } from '@/components/ui/Button'
import { Mail, X, AlertCircle, Clock } from 'lucide-react'
import { type Invite } from '@/features/organisation/types/Invite'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface InviteRowProps {
    invite: Invite
    onRevoke: (inviteId: string) => void
    isRevoking: boolean
}

const InviteRow: React.FC<InviteRowProps> = ({ invite, onRevoke, isRevoking }) => {
    const handleRevoke = () => {
        if (window.confirm(`Are you sure you want to revoke the invite for ${invite.invitedUserEmail}?`)) {
            onRevoke(invite.id)
        }
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Mail size={20} className="text-gray-600" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{invite.invitedUserEmail}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                    {(invite.initialRoles && invite.initialRoles.length > 0) ? (
                        invite.initialRoles.map(role => (
                            <span key={role.id} className="px-2 py-1 text-xs font-semibold leading-4 rounded-full bg-blue-100 text-blue-800">
                                {role.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-500 italic">No roles assigned</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    Expires on {new Date(invite.dueDate).toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="destructive" size="sm" onClick={handleRevoke} disabled={isRevoking}>
                    <X size={16} className="mr-2" />
                    {isRevoking ? 'Revoking...' : 'Revoke'}
                </Button>
            </td>
        </tr>
    )
}

interface InvitesListProps {
    isLoading: boolean
    isError: boolean
    filteredInvites: Invite[]
    isSearchActive: boolean
    onRevokeInvite: (inviteId: string) => void
    isRevoking: boolean
}

export const InvitesList: React.FC<InvitesListProps> = ({
    isLoading,
    isError,
    filteredInvites,
    isSearchActive,
    onRevokeInvite,
    isRevoking,
}) => {
    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        return (
            <div className="text-center p-10 text-red-600 flex justify-center items-center gap-2">
                <AlertCircle size={20} />
                <span>Failed to load invites.</span>
            </div>
        )
    }

    if (filteredInvites.length === 0) {
        const message = isSearchActive
            ? "No pending invites match your search."
            : "There are no pending invites for this organisation."
        return <div className="text-center p-10 text-gray-500">{message}</div>
    }

    return (
        <div className="bg-white rounded-lg shadow max-h-full flex flex-col">
            <div className="overflow-y-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Assigned Roles</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Expires</th>
                            <th scope="col" className="relative px-6 py-3 w-1/5"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInvites.map((invite) => (
                            <InviteRow
                                key={invite.id}
                                invite={invite}
                                onRevoke={onRevokeInvite}
                                isRevoking={isRevoking}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
