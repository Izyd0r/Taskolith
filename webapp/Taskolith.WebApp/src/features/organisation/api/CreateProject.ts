import { apiClient } from '@/lib/axios'
import { type CreateProjectRequest } from '@/features/organisation/types/CreateProjectRequest'

export const CreateProject = async (
    organisationId: string,
    request: CreateProjectRequest
) => {
    const { data } = await apiClient.post(`/organisations/${organisationId}/projects`, request)
    return data
}
