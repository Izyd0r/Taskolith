import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RemoveTaskMember } from '@/features/project/api/RemoveTaskMember'

export const useRemoveTaskMember = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: { taskId: string, memberId: string }) =>
            RemoveTaskMember(organisationId, projectId, variables.taskId, variables.memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kanbanColumns', organisationId, projectId] })
        }
    })
}
