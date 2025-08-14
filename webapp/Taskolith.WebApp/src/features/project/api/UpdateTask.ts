import { apiClient } from '@/lib/axios'
import { type UpdateTaskRequest } from '@/features/project/types/UpdateTaskSchema'

export const UpdateTask = async (
    organisationId: string,
    projectId: string,
    columnId: string,
    taskId: string,
    request: UpdateTaskRequest
) => {
    const { data } = await apiClient.put(
        `/organisations/${organisationId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}`,
        request
    )
    return data
}
