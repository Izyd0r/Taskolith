import apiClient from '@/lib/axios'
import { type Role } from '@/features/organisation/types/Role'

export const getMemberRoles = async (
    organisationId: string,
    memberId: string
): Promise<Role[]> => {
    const { data } = await apiClient.get<{ roles: Role[] }>(
        `/organisations/${organisationId}/members/${memberId}/roles`
    )
    return data.roles
}

export const addRoleToMember = async (
    organisationId: string,
    memberId: string,
    roleId: string
): Promise<void> => {
    await apiClient.post(`/organisations/${organisationId}/members/${memberId}/roles`, { roleId })
}

export const removeRoleFromMember = async (
    organisationId: string,
    memberId: string,
    roleId: string
): Promise<void> => {
    await apiClient.delete(`/organisations/${organisationId}/members/${memberId}/roles/${roleId}`)
}
