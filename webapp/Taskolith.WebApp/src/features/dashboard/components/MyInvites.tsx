import React, { useMemo } from 'react'
import { useGetInvites } from '@/features/dashboard/hooks/useGetInvites'
import { useAcceptInvite } from '@/features/dashboard/hooks/useAcceptInvite'
import { useRejectInvite } from '@/features/dashboard/hooks/useRejectInvite'
import { type Invitation } from '@/features/dashboard/types/GetInvitationResponse'
import { Mail, Clock, Check, X, UserCheck, Inbox } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'

const InviteCard: React.FC<{
    invite: Invitation
    onAccept: (id: string) => void
    onReject: (id: string) => void
    isProcessing: boolean
}> = ({ invite, onAccept, onReject, isProcessing }) => {
    const isExpired = new Date(invite.dueDate) < new Date()
    const roleNames = useMemo(() => invite.initialRoles.map(r => r.name).join(', ') || 'Member', [invite.initialRoles])

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">Invitation to join</p>
                    <h3 className="font-bold text-lg text-gray-800">{invite.organisationName}</h3>
                </div>
                {isExpired || invite.status !== 'Pending' ? (
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isExpired ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {isExpired ? 'Expired' : invite.status}
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReject(invite.id)}
                            disabled={isProcessing}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onAccept(invite.id)}
                            disabled={isProcessing}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
                        >
                            <Check className="w-4 h-4" />
                            <span className="ml-2">Accept</span>
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
                <span>You're invited as a: <span className="font-medium">{roleNames}</span></span>
            </div>

            <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                <Clock className="w-3 h-3 mr-1.5" />
                <span>
                    {isExpired ? 'Expired on' : 'Expires on'}: {new Date(invite.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>
        </div>
    )
}

const MyInvites: React.FC = () => {
    const { data: invites, isLoading, isError, isSuccess } = useGetInvites()
    const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite()
    const { mutate: rejectInvite, isPending: isRejecting } = useRejectInvite()

    const isProcessing = isAccepting || isRejecting

    const sortedInvites = useMemo(() => {
        if (!invites) return { pending: [], other: [] }
        const pending: Invitation[] = []
        const other: Invitation[] = []
        invites.forEach(inv => {
            if (inv.status === 'Pending' && new Date(inv.dueDate) >= new Date()) {
                pending.push(inv)
            } else {
                other.push(inv)
            }
        })
        return { pending, other }
    }, [invites])

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>
        }

        if (isError) {
            return <p className="text-red-500 text-center p-6">Error loading invitations.</p>
        }

        if (isSuccess && (!invites || invites.length === 0)) {
            return (
                <div className="text-center py-10 text-gray-500 flex flex-col justify-center items-center bg-white rounded-lg border border-dashed h-48">
                    <Inbox className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="font-medium text-gray-800">No Invitations</p>
                    <p className="text-sm">You have no pending or past invitations.</p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                {sortedInvites.pending.map((invite) => (
                    <InviteCard
                        key={invite.id}
                        invite={invite}
                        onAccept={acceptInvite}
                        onReject={rejectInvite}
                        isProcessing={isProcessing}
                    />
                ))}

                {sortedInvites.pending.length > 0 && sortedInvites.other.length > 0 && (
                    <div className="py-4">
                        <div className="border-t border-gray-200" />
                    </div>
                )}

                {sortedInvites.other.map((invite) => (
                    <InviteCard
                        key={invite.id}
                        invite={invite}
                        onAccept={acceptInvite}
                        onReject={rejectInvite}
                        isProcessing={isProcessing}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="h-full bg-gray-50 p-4 sm:p-6 flex flex-col">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Invitations</h1>
            </div>

            <div className="relative flex-grow min-h-0">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="h-full overflow-y-auto pr-2 pl-1 pt-2 pb-2">
                    <div className="max-w-4xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    )
}

export default MyInvites
