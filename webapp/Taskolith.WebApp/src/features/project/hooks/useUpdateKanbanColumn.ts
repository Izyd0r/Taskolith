import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateKanbanColumn, type UpdateKanbanColumnRequest } from '@/features/project/api/UpdateKanbanColumn'

export const useUpdateKanbanColumn = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: { kanbanColumnId: string, request: UpdateKanbanColumnRequest }) =>
            UpdateKanbanColumn(organisationId, projectId, variables.kanbanColumnId, variables.request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kanban-columns', organisationId, projectId] })
        }
    })
}
