import { useQuery } from '@tanstack/react-query'
import { GetProjectMembers } from '@/features/project/api/GetProjectMembers'
import { type ProjectMember } from '@/features/project/types/ProjectMember'

export const useGetProjectMembers = (organisationId: string | undefined, projectId: string | undefined) => {
    return useQuery<ProjectMember[]>({
        queryKey: ['organisations', organisationId, 'projects', projectId, 'members'],
        queryFn: () => GetProjectMembers(organisationId!, projectId!),
        enabled: !!organisationId && !!projectId,
    })
}
