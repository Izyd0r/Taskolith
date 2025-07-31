import { useMutation } from '@tanstack/react-query'
import { type CreateKanbanColumnRequest } from '@/features/project/types/CreateKanbanColumnRequest'
import { CreateKanbanColumn } from '@/features/project/api/CreateKanbanColumn'

export const useCreateKanbanColumn = (
    organisationId: string,
    projectId: string
) => {
    return useMutation<void, Error, CreateKanbanColumnRequest>({
        mutationFn: (request) => CreateKanbanColumn(organisationId, projectId, request),
    })
}

