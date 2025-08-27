import apiClient from '@/lib/axios'
import { type RoleRequest } from '@/features/organisation/types/RoleRequest'
import { type GetRolesResponse } from '@/features/organisation/types/Role'

export const GetRoles = async (organisationId: string): Promise<GetRolesResponse> => {
    const { data } = await apiClient.get(`/organisations/${organisationId}/roles`)
    return data
}

export const CreateRole = async (organisationId: string, request: RoleRequest) => {
    const { data } = await apiClient.post(`/organisations/${organisationId}/roles`, request)
    return data
}

export const UpdateRole = async (organisationId: string, roleId: string, request: RoleRequest) => {
    const { data } = await apiClient.put(`/organisations/${organisationId}/roles/${roleId}`, request)
    return data
}

export const DeleteRole = async (organisationId: string, roleId: string) => {
    await apiClient.delete(`/organisations/${organisationId}/roles/${roleId}`)
}
