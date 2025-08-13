import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { Search, Mail, X, AlertCircle, Clock, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { InviteMemberModal } from '@/features/organisation/components/InviteMemberModal'

interface Invite {
    id: string
    email: string
    role: string
    invitedAt: string
    expiresAt: string
}

const getPendingInvites = async (organisationId: string): Promise<Invite[]> => {
    console.log(`Fetching pending invites for organisation: ${organisationId}`)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', email: 'test1@example.com', role: 'Developer', invitedAt: '2023-08-10T10:00:00Z', expiresAt: '2023-08-17T10:00:00Z' },
                { id: '2', email: 'another-user@example.com', role: 'Admin', invitedAt: '2023-08-09T14:30:00Z', expiresAt: '2023-08-16T14:30:00Z' },
                { id: '3', email: 'test3@example.com', role: 'Viewer', invitedAt: '2023-08-11T12:00:00Z', expiresAt: '2023-08-18T12:00:00Z' },
            ])
        }, 500)
    })
}

const revokeInvite = async (organisationId: string, inviteId: string): Promise<void> => {
    console.log(`Revoking invite ${inviteId} for organisation ${organisationId}`)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 300)
    })
}

const useGetPendingInvites = (organisationId: string) => {
    return useQuery({
        queryKey: ['organisation', organisationId, 'invites'],
        queryFn: () => getPendingInvites(organisationId),
    })
}

const useRevokeInvite = (organisationId: string, inviteId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => revokeInvite(organisationId, inviteId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organisation', organisationId, 'invites']
            })
        },
    })
}

const InviteRow = ({ invite }: { invite: Invite }) => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const { mutate: revoke, isPending: isRevoking } = useRevokeInvite(organisationId!, invite.id)

    const handleRevoke = () => {
        if (window.confirm(`Are you sure you want to revoke the invite for ${invite.email}?`)) {
            revoke()
        }
    }

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Mail size={20} className="text-gray-600" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{invite.email}</div>
                        <div className="text-sm text-gray-500">
                            Invited on {new Date(invite.invitedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {invite.role}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    Expires on {new Date(invite.expiresAt).toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRevoke}
                    disabled={isRevoking}
                    aria-label={`Revoke invite for ${invite.email}`}
                >
                    <X size={16} className="mr-2" />
                    {isRevoking ? 'Revoking...' : 'Revoke'}
                </Button>
            </td>
        </tr>
    )
}

const InvitesPage = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const { data: invites, isLoading, isError } = useGetPendingInvites(organisationId!)
    const [query, setQuery] = useState('')
    const [isInviteModalOpen, setInviteModalOpen] = useState(false)

    const filteredInvites = useMemo(() => {
        if (!invites) return []
        const lowerCaseQuery = query.toLowerCase()
        return invites.filter(
            (invite) =>
                invite.email.toLowerCase().includes(lowerCaseQuery) ||
                invite.role.toLowerCase().includes(lowerCaseQuery)
        )
    }, [invites, query])

    const handleInvite = () => setInviteModalOpen(true)

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 h-full">
            <div className="max-w-4xl mx-auto flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Pending Invites</h1>
                        <p className="text-sm text-gray-500">Manage pending invitations for this organisation.</p>
                    </div>
                    <Button onClick={handleInvite} className="gap-2">
                        <UserPlus size={18} />
                        Invite Member
                    </Button>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Filter by email or role..."
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                        Expires
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 w-1/5">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center p-6 text-gray-500">
                                            Loading invites...
                                        </td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={4} className="text-center p-6 text-red-600">
                                            <div className="flex justify-center items-center gap-2">
                                                <AlertCircle size={20} />
                                                <span>Failed to load invites.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredInvites.length > 0 ? (
                                    filteredInvites.map((invite) => (
                                        <InviteRow key={invite.id} invite={invite} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center p-6 text-gray-500">
                                            No pending invites found.
                                        </td>
                                    </tr>
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

export default InvitesPage
