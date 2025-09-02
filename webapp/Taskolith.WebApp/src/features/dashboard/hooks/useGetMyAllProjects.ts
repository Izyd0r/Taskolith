import { useQuery } from '@tanstack/react-query'
import { useGetOrganisations } from './useGetOrganisations'
import { GetMyProjects } from '@/features/organisation/api/Projects'
import { type DashboardProject } from '@/features/dashboard/types/DashboardProject'

export const useGetMyAllProjects = () => {
    const { data: organisations } = useGetOrganisations()

    return useQuery<DashboardProject[]>({
        queryKey: ['my-all-projects', organisations?.map(o => o.organisationId)],
        queryFn: async () => {
            if (!organisations || organisations.length === 0) {
                return []
            }

            const orgNameMap = new Map(organisations.map(o => [o.organisationId, o.organisationName]))

            const projectPromises = organisations.map(org =>
                GetMyProjects(org.organisationId).then(projects =>
                    projects.map(p => ({ ...p, organisationId: org.organisationId }))
                )
            )

            const projectsByOrg = await Promise.all(projectPromises)
            const allProjectsFlat = projectsByOrg.flat()

            const dashboardProjects: DashboardProject[] = allProjectsFlat.map(p => ({
                ...p,
                organisationName: orgNameMap.get(p.organisationId) || 'Unknown Organisation',
            }))

            return dashboardProjects
        },
        enabled: !!organisations && organisations.length > 0,
    })
}
