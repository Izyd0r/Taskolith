import apiClient from '@/lib/axios'
import { type AssignMembersRequest } from '@/features/project/types/AssignMembersSchema'

export const AssignTaskToMembers = async (
    organisationId: string,
    projectId: string,
    taskId: string,
    request: AssignMembersRequest
) => {
    const { data } = await apiClient.put(
        `/organisations/${organisationId}/projects/${projectId}/tasks/${taskId}/members`,
        request
    )
    return data
}
