import apiClient from '@/lib/axios'

export const DeleteTask = async (
    organisationId: string,
    projectId: string,
    columnId: string,
    taskId: string
) => {
    await apiClient.delete(
        `/organisations/${organisationId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}`
    )
}
