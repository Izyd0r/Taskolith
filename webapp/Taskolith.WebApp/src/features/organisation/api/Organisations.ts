import { apiClient } from '@/lib/axios'

export const UpdateOrganisation = async (payload: { organisationId: string, organisationName: string }) => {
    const { data } = await apiClient.put(`/organisations/`, {
        organisationId: payload.organisationId,
        organisationName: payload.organisationName
    })
    return data
}

export const DeleteOrganisation = async (organisationId: string) => {
    await apiClient.delete(`/organisations/${organisationId}`)
    return { success: true }
}
