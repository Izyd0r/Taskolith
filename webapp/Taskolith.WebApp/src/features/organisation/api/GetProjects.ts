import { apiClient } from '@/lib/axios'
import { type Project } from '@/features/organisation/types/Project'

export const GetProjects = async (organisationId: string): Promise<Project[]> => {
    const { data } = await apiClient.get(`/organisations/${organisationId}/projects`)
    return data
}
