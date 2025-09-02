import { useMemo } from 'react'
import { useGetAllProjects } from '@/features/organisation/hooks/useProjects'
import { useGetMyProjects } from '@/features/organisation/hooks/useProjects'
import { type Project } from '@/features/organisation/types/Project'

export const useGetProject = (organisationId: string, projectId: string) => {
    const { data: allProjects, isLoading: isLoadingAll } = useGetAllProjects(organisationId!, { enabled: !!organisationId })
    const { data: myProjects, isLoading: isLoadingMy, isError: isErrorMy } = useGetMyProjects(organisationId!, { enabled: !!organisationId })
    const project = useMemo(() => {
        if (!projectId) {
            return undefined
        }
        if (allProjects) {
            const foundProject = allProjects.find((proj: Project) => proj.projectId === projectId)
            if (foundProject) {
                return foundProject
            }
        }
        if (myProjects) {
            const foundProject = myProjects.find((proj: Project) => proj.projectId === projectId)
            if (foundProject) {
                return foundProject
            }
        }
        return undefined
    }, [allProjects, myProjects, projectId])
    return {
        data: project,
        isLoading: isLoadingAll || isLoadingMy,
        isError: isErrorMy,
    }
}
