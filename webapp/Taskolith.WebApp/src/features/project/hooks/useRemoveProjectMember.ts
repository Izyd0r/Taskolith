import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RemoveProjectMember } from '@/features/project/api/RemoveProjectMember'

export const useRemoveProjectMember = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (memberId: string) =>
            RemoveProjectMember(organisationId, projectId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organisations', organisationId, 'projects', projectId, 'members']
            })
            queryClient.invalidateQueries({
                queryKey: ['organisations', organisationId, 'projects', projectId, 'tasks']
            })
        }
    })
}
