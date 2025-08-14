import { apiClient } from '@/lib/axios'

export const RemoveTaskMember = async (
    organisationId: string,
    projectId: string,
    taskId: string,
    memberId: string
) => {
    await apiClient.delete(
        `/organisations/${organisationId}/projects/${projectId}/tasks/${taskId}/members/${memberId}`
    )
}
