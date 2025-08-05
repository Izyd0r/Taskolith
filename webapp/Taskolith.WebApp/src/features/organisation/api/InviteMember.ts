import { apiClient } from '@/lib/axios'
import { type InviteMemberRequest } from '@/features/organisation/types/InviteMemberRequest'

export const InviteMember = async (
    organisationId: string,
    request: InviteMemberRequest
) => {
    const { data } = await apiClient.post(`/organisations/${organisationId}/invitations`, request)
    return data
}
