import apiClient from '@/lib/axios'

export const DeleteKanbanColumn = async (
    organisationId: string,
    projectId: string,
    kanbanColumnId: string
) => {
    const { data } = await apiClient.delete(
        `/organisations/${organisationId}/projects/${projectId}/columns/${kanbanColumnId}`
    )
    return data
}
