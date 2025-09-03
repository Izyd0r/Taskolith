import apiClient from '@/lib/axios'
import { type Invite } from '@/features/organisation/types/Invite'
import { type InviteMemberRequest } from '@/features/organisation/types/InviteMemberRequest'

export const InviteMember = async (
    organisationId: string,
    request: InviteMemberRequest
) => {
    const { data } = await apiClient.post(`/organisations/${organisationId}/invitations`, request)
    return data
}

export const GetPendingInvites = async (organisationId: string): Promise<Invite[]> => {
    try {
        const res = await apiClient.get<{ invites: Invite[] }>(
            `/organisations/${organisationId}/invitations`
        );
        return res.data.invites ?? [];
    } catch (error) {
        console.error("Failed to fetch pending invites:", error);
        return [];
    }
};

export const RevokeInvite = async (organisationId: string, invitationId: string): Promise<void> => {
    try {
        await apiClient.delete(`/organisations/${organisationId}/invitations/${invitationId}`)
    } catch (error: any) {
        console.error('Failed to revoke invite:', error)
        const errorMessage = error.response?.data?.message || 'An error occurred while revoking the invitation.'
        throw new Error(errorMessage)
    }
}
