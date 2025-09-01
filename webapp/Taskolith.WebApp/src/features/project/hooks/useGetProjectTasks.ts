import { useQuery } from '@tanstack/react-query'
import { GetProjectTasks } from '@/features/project/api/GetProjectTasks'
import { type Task } from '@/features/project/types/Task'

export const useGetProjectTasks = (organisationId: string | undefined, projectId: string | undefined) => {
    return useQuery<Task[]>({
        queryKey: ['organisations', organisationId, 'projects', projectId, 'tasks'],
        queryFn: () => GetProjectTasks(organisationId!, projectId!),
        enabled: !!organisationId && !!projectId,
    })
}
