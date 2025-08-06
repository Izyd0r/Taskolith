import React from 'react'
import { useGetInvites } from '@/features/dashboard/hooks/useGetInvites'
import { useAcceptInvite } from '@/features/dashboard/hooks/useAcceptInvite'
import { useRejectInvite } from '@/features/dashboard/hooks/useRejectInvite'
import { type Invitation } from '@/features/dashboard/types/GetInvitationResponse'
import { Mail, Clock, Check, X } from 'lucide-react'

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    </div>
)

const InviteCard: React.FC<{
    invite: Invitation
    onAccept: (id: string) => void
    onReject: (id: string) => void
    isProcessing: boolean
}> = ({ invite, onAccept, onReject, isProcessing }) => {
    const isExpired = new Date(invite.dueDate) < new Date()

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Invitation to an Organisation</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>
                                {isExpired ? 'Expired on' : 'Expires on'}: {new Date(invite.dueDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 flex-shrink-0">
                    {isExpired || invite.status !== 'Pending' ? (
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            isExpired ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                            {isExpired ? 'Expired' : invite.status}
                        </span>
                    ) : (
                        <>
                            <button
                                onClick={() => onReject(invite.id)}
                                disabled={isProcessing}
                                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
                                aria-label="Decline Invitation"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onAccept(invite.id)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                            >
                                <Check className="w-5 h-5" />
                                <span>Accept</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

const MyInvites: React.FC = () => {
    const { data: invites, isLoading, isError, isSuccess } = useGetInvites()
    const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite()
    const { mutate: rejectInvite, isPending: isRejecting } = useRejectInvite()

    const isProcessing = isAccepting || isRejecting

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner />
        }

        if (isError) {
            return <div className="text-center p-10 bg-red-50 text-red-600 rounded-lg">Failed to load invites. Please try again later.</div>
        }

        if (isSuccess && invites && invites.length > 0) {
            const pendingInvites = invites.filter(inv => inv.status === 'Pending' && new Date(inv.dueDate) >= new Date())
            const otherInvites = invites.filter(inv => inv.status !== 'Pending' || new Date(inv.dueDate) < new Date())

            return (
                 <div className="space-y-4">
                    {pendingInvites.map((invite) => (
                        <InviteCard
                            key={invite.id}
                            invite={invite}
                            onAccept={acceptInvite}
                            onReject={rejectInvite}
                            isProcessing={isProcessing}
                        />
                    ))}
                    {pendingInvites.length > 0 && otherInvites.length > 0 && <hr className="my-6"/>}
                    {otherInvites.map((invite) => (
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

        return <div className="text-center p-10 bg-gray-50 text-gray-500 rounded-lg">You have no pending invitations.</div>
    }

    return (
        <div className="p-4 sm:p-6 h-full bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 flex-shrink-0">My Invitations</h1>
                {renderContent()}
            </div>
        </div>
    )
}

export default MyInvites
