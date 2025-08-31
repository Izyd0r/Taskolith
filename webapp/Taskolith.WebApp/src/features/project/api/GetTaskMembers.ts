import apiClient from '@/lib/axios'
import { type TaskMember, type TaskMembersResponse } from '@/features/project/types/TaskMember'

export const GetTaskMembers = async (organisationId: string, projectId: string, taskId: string): Promise<TaskMember[]> => {
    if (!organisationId || !projectId || !taskId) {
        return []
    }
    
    try {
        const res = await apiClient.get<TaskMembersResponse>(
            `/organisations/${organisationId}/projects/${projectId}/tasks/${taskId}/members`
        )
        return res.data.members ?? []
    } catch (error) {
        console.error("Failed to fetch task members:", error)
        throw new Error('Failed to fetch task members')
    }
}
