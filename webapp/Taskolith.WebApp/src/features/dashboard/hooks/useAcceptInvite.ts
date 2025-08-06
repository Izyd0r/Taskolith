import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AcceptInvite } from '@/features/dashboard/api/AcceptInvite'

export const useAcceptInvite = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (invitationId: string) => AcceptInvite(invitationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invites'] })
        },
    })
}
