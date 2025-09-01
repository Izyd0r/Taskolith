import apiClient from '@/lib/axios'
import { type Task, type GetTasksResponse } from '@/features/project/types/Task'

export const GetProjectTasks = async (organisationId: string, projectId: string): Promise<Task[]> => {
    if (!organisationId || !projectId) {
        return []
    }

    try {
        const res = await apiClient.get<GetTasksResponse>(
            `/organisations/${organisationId}/projects/${projectId}/tasks`
        )
        return res.data.tasks ?? []
    } catch (error) {
        console.error("Failed to fetch project tasks:", error)
        throw new Error('Failed to fetch project tasks')
    }
}
