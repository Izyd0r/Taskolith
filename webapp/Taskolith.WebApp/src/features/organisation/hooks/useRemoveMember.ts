import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RemoveMember } from '@/features/organisation/api/RemoveMember'

export const useRemoveMember = (organisationId: string, memberId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => RemoveMember(organisationId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'members'] })
        },
    })
}
