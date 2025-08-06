import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RejectInvite } from '@/features/dashboard/api/RejectInvite'

export const useRejectInvite = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (invitationId: string) => RejectInvite(invitationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invites'] })
        },
    })
}
