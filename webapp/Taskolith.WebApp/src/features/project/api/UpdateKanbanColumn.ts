import { apiClient } from '@/lib/axios'

export interface UpdateKanbanColumnRequest {
    name: string
}

export const UpdateKanbanColumn = async (
    organisationId: string,
    projectId: string,
    kanbanColumnId: string,
    request: UpdateKanbanColumnRequest
) => {
    const { data } = await apiClient.put(
        `/organisations/${organisationId}/projects/${projectId}/columns/${kanbanColumnId}`,
        request
    )
    return data
}
