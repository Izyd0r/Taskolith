import apiClient from '@/lib/axios'

export const RemoveMember = async (
    organisationId: string,
    memberId: string
) => {
    const { data } = await apiClient.delete(`/organisations/${organisationId}/members/${memberId}`)
    return data
}
