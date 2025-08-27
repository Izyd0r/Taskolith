import apiClient from '@/lib/axios'
import { type CreateOrganisationRequest } from '@/features/dashboard/types/CreateOrganisationRequest'

export const CreateOrganisation = async (request: CreateOrganisationRequest) => {
    const { data } = await apiClient.post('/organisations', request)
    return data
}
