import { useMutation } from '@tanstack/react-query'
import { DeleteTask } from '@/features/project/api/DeleteTask'

export const useDeleteTask = (organisationId: string, projectId: string) => {
    return useMutation({
        mutationFn: (variables: { columnId: string, taskId: string }) =>
            DeleteTask(organisationId, projectId, variables.columnId, variables.taskId)
    })
}
