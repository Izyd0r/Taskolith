import { apiClient } from '@/lib/axios'

export const AcceptInvite = async (invitationId: string) => {
    const { data } = await apiClient.post(`/invitations/${invitationId}/accept`)
    return data
}
