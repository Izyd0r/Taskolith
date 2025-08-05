import { useMutation } from '@tanstack/react-query'
import { InviteMember } from '@/features/organisation/api/InviteMember'
import { type InviteMemberRequest } from '@/features/organisation/types/InviteMemberRequest'

export const useInviteMember = (organisationId: string) => {
    return useMutation<void, Error, InviteMemberRequest>({
        mutationFn: (request) => InviteMember(organisationId, request),
    })
}
