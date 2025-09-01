import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AssignTaskToMembers } from '@/features/project/api/AssignTaskToMembers'
import { type AssignMembersRequest } from '@/features/project/types/AssignMembersSchema'

export const useUpdateTaskMembers = (organisationId: string, projectId: string, taskId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (request: AssignMembersRequest) =>
            AssignTaskToMembers(organisationId, projectId, taskId, request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organisations', organisationId, 'projects', projectId, 'tasks']
            })
        },

        onError: (error) => {
            console.error("Failed to update task members:", error)
        }
    })
}
