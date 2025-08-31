import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type CreateKanbanColumnRequest } from '@/features/project/types/CreateKanbanColumnRequest'
import { CreateKanbanColumn } from '@/features/project/api/CreateKanbanColumn'


export const useCreateKanbanColumn = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (request: CreateKanbanColumnRequest) =>
            CreateKanbanColumn(organisationId, projectId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kanban-columns', organisationId, projectId] })
        }
    })
}
