import apiClient from '@/lib/axios'

export const RejectInvite = async (invitationId: string) => {
    const { data } = await apiClient.post(`/invitations/${invitationId}/reject`)
    return data
}
