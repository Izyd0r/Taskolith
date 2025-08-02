import { apiClient } from '@/lib/axios'
import { type CreateTaskRequest } from '@/features/project/types/CreateTaskRequest'

export const CreateTask = async (
    organisationId: string,
    projectId: string,
    kanbanColumnId: string,
    request: CreateTaskRequest
) => {
    const { data } = await apiClient.post(`/organisations/${organisationId}/projects/${projectId}/columns/${kanbanColumnId}/tasks`, request)
    return data
}
