import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { GetPendingInvites, RevokeInvite } from '@/features/organisation/api/Invites'
import { type Invite } from '@/features/organisation/types/Invite'
import { InviteMember } from '@/features/organisation/api/Invites'
import { type InviteMemberRequest } from '@/features/organisation/types/InviteMemberRequest'

export const useInviteMember = (organisationId: string) => {
    return useMutation<void, Error, InviteMemberRequest>({
        mutationFn: (request) => InviteMember(organisationId, request),
    })
}

export const useGetPendingInvites = (organisationId: string, enabled = true) => 
    useQuery<Invite[], Error>({
        queryKey: ["organisation", organisationId, "invites"],
        queryFn: () => GetPendingInvites(organisationId),
        enabled: !!organisationId && enabled,
    })


export const useRevokeInvite = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (inviteId: string) => RevokeInvite(organisationId, inviteId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organisation', organisationId, 'invites'],
            })
        },
    })
}
