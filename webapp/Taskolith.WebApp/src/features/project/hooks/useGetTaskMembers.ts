import { useQuery } from '@tanstack/react-query'
import { GetTaskMembers } from '@/features/project/api/GetTaskMembers'
import { type TaskMember } from '@/features/project/types/TaskMember'

export const useGetTaskMembers = (organisationId: string | undefined, projectId: string | undefined, taskId: string | undefined) => {
    return useQuery<TaskMember[]>({
        queryKey: ['organisations', organisationId, 'projects', projectId, 'tasks', taskId, 'members'],
        queryFn: () => GetTaskMembers(organisationId!, projectId!, taskId!),
        enabled: !!organisationId && !!projectId && !!taskId,
    })
}
