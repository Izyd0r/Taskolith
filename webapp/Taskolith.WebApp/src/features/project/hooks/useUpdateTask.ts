import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateTask } from '@/features/project/api/UpdateTask'
import { type UpdateTaskRequest } from '@/features/project/types/UpdateTaskSchema'

export const useUpdateTask = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: { taskId: string, columnId: string, request: UpdateTaskRequest }) =>
            UpdateTask(organisationId, projectId, variables.columnId, variables.taskId, variables.request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kanbanColumns', organisationId, projectId] })
        }
    })
}
