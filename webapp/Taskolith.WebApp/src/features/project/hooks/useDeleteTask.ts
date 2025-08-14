import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeleteTask } from '@/features/project/api/DeleteTask'

export const useDeleteTask = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: { columnId: string, taskId: string }) =>
            DeleteTask(organisationId, projectId, variables.columnId, variables.taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kanbanColumns', organisationId, projectId] })
        }
    })
}
