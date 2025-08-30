import apiClient from '@/lib/axios'
import { type Member } from '@/features/organisation/types/Member'
import { type GetOrganisationMembersResponse } from '@/features/organisation/types/GetOrganisationMembersResponse'

export const GetMembersInsideOrganisation = async (
    organisationId: string
): Promise<{ members: Member[] }> => {
    const res = await apiClient.get<{ members: GetOrganisationMembersResponse[] }>(
        `/organisations/${organisationId}/members`
    );

    const members: Member[] = res.data.members.map(item => ({
        ...item.member,
        roles: item.roles ?? [],
    }));

    return { members };
};


export const RemoveMember = async (
    organisationId: string,
    memberId: string
) => {
    const { data } = await apiClient.delete(`/organisations/${organisationId}/members/${memberId}`)
    return data
}
