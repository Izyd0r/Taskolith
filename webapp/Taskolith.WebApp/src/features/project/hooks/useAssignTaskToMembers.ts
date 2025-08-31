import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AssignTaskToMembers } from '@/features/project/api/AssignTaskToMembers'
import { type AssignMembersRequest } from '@/features/project/types/AssignMembersSchema'

export const useAssignTaskToMembers = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (variables: { taskId: string, request: AssignMembersRequest }) =>
            AssignTaskToMembers(organisationId, projectId, variables.taskId, variables.request),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['organisations', organisationId, 'projects', projectId, 'tasks', variables.taskId, 'members'] })
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskId] })
            queryClient.invalidateQueries({ queryKey: ['kanbanColumns', organisationId, projectId] })
        }
    })
}
