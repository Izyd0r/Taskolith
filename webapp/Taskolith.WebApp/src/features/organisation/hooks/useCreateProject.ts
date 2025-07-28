import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { type CreateProjectRequest } from '@/features/organisation/types/CreateProjectRequest'

export const useCreateProject = (organisationId: string) => {
    const createProject = async (request: CreateProjectRequest) => {
        const { data } = await apiClient.post(`/organisations/${organisationId}/projects`, request)
        return data
    }

    return useMutation<void, Error, CreateProjectRequest>({
        mutationFn: createProject,
    })
}
