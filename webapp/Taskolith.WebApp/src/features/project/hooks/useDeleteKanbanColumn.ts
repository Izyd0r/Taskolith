import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeleteKanbanColumn } from '@/features/project/api/DeleteKanbanColumn'

export const useDeleteKanbanColumn = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (kanbanColumnId: string) =>
            DeleteKanbanColumn(organisationId, projectId, kanbanColumnId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kanban-columns', organisationId, projectId] })
        }
    })
}
