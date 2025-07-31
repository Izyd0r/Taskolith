import { apiClient } from '@/lib/axios'
import { type CreateKanbanColumnRequest } from '@/features/project/types/CreateKanbanColumnRequest'

export const CreateKanbanColumn = async (
    organisationId: string,
    projectId: string,
    request: CreateKanbanColumnRequest
) => {
    const { data } = await apiClient.post(`/organisations/${organisationId}/projects/${projectId}/columns`, request)
    return data
}

