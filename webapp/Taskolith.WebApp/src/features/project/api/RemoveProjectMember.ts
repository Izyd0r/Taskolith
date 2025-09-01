import apiClient from '@/lib/axios'

export const RemoveProjectMember = async (
    organisationId: string,
    projectId: string,
    memberId: string
) => {
    await apiClient.delete(
        `/organisations/${organisationId}/projects/${projectId}/members/${memberId}`
    )
}
