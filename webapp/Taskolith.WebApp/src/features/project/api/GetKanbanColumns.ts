import apiClient from '@/lib/axios'

export const GetKanbanColumns = async (
    organisationId: string,
    projectId: string,
) => {
    const { data } = await apiClient.get(`/organisations/${organisationId}/projects/${projectId}/columns`)
    return data
}
