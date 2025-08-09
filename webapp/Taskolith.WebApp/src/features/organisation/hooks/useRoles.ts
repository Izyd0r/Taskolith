import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetRoles, CreateRole, UpdateRole, DeleteRole } from '@/features/organisation/api/Roles'
import { type RoleRequest } from '@/features/organisation/types/RoleRequest'
import { type GetRolesResponse } from '@/features/organisation/types/Role'

export const useGetRoles = (organisationId: string) =>
    useQuery<GetRolesResponse>({
        queryKey: ['organisation', organisationId, 'roles'],
        queryFn: () => GetRoles(organisationId)
    })

export const useCreateRole = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (request: RoleRequest) => CreateRole(organisationId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'roles'] })
        }
    })
}

export const useUpdateRole = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ roleId, request }: { roleId: string; request: RoleRequest }) =>
            UpdateRole(organisationId, roleId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'roles'] })
        }
    })
}

export const useDeleteRole = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (roleId: string) => DeleteRole(organisationId, roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'roles'] })
        }
    })
}
