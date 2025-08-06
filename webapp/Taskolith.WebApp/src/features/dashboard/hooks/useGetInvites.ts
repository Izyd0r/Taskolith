import { useQuery } from '@tanstack/react-query'
import { GetInvites } from '@/features/dashboard/api/GetInvites'
import { type GetInvitesResponse } from '@/features/dashboard/types/GetInvitationResponse'

export const useGetInvites = () => {
    return useQuery({
        queryKey: ['invites'],
        queryFn: GetInvites,
        select: (data: GetInvitesResponse) => data.invites,
    })
}
