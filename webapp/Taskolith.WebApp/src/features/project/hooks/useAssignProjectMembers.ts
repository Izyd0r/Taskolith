import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AssignProjectMembers } from '@/features/project/api/AssignProjectMembers'
import { type AssignProjectMembersRequest } from '@/features/project/api/AssignProjectMembers'

export const useAssignProjectMembers = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (request: AssignProjectMembersRequest) =>
            AssignProjectMembers(organisationId, projectId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organisations', organisationId, 'projects', projectId, 'members']
            })
        }
    })
}
