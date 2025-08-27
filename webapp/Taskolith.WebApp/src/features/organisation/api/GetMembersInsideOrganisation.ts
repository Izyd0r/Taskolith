import apiClient from '@/lib/axios'
import { type GetOrganisationMembersResponse } from '@/features/organisation/types/GetOrganisationMembersResponse'

export const GetMembersInsideOrganisation = async (organisationId: string): Promise<GetOrganisationMembersResponse[]> => {
    const { data } = await apiClient.get(`/organisations/${organisationId}/members`)
    return data
}

