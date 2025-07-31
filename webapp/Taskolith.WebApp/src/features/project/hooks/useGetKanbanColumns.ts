import { useQuery } from '@tanstack/react-query'
import { GetKanbanColumns } from '@/features/project/api/GetKanbanColumns'
import { type KanbanColumn } from '@/features/project/types/KanbanColumn'

export const useGetKanbanColumns = (
    organisationId: string,
    projectId: string
) => {
    return useQuery<KanbanColumn[]>({
        queryKey: ['kanban-columns', organisationId, projectId],
        queryFn: () => GetKanbanColumns(organisationId, projectId),
        enabled: !!organisationId && !!projectId,
    })
}


