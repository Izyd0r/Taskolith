import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RemoveTaskMember } from '@/features/project/api/RemoveTaskMember'

export const useRemoveTaskMember = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (variables: { taskId: string, memberId: string }) =>
            RemoveTaskMember(organisationId, projectId, variables.taskId, variables.memberId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['organisations', organisationId, 'projects', projectId, 'tasks']
            })
            queryClient.invalidateQueries({ queryKey: ['kanbanColumns', organisationId, projectId] })
            queryClient.invalidateQueries({ queryKey: ['organisations', organisationId, 'projects', projectId, 'tasks', variables.taskId, 'members'] })
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskId] })
        }
    })
}
