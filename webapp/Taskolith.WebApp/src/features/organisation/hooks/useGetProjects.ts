import { useQuery } from '@tanstack/react-query'
import { GetProjects } from '@/features/organisation/api/GetProjects'
import { type Project } from '@/features/organisation/types/Project'

export const useGetProjects = (organisationId: string) => {
    return useQuery<Project[], Error>({
        queryKey: ['projects', organisationId],
        queryFn: () => GetProjects(organisationId),
        enabled: !!organisationId,
    })
}
