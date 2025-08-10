import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type Role } from '@/features/organisation/types/Role'
import {
    getMemberRoles,
    addRoleToMember,
    removeRoleFromMember
} from '@/features/organisation/api/MemberRoles'

export const useGetMemberRoles = (organisationId: string, memberId: string) =>
    useQuery<Role[], Error>({
        queryKey: ['organisation', organisationId, 'members', memberId, 'roles'],
        queryFn: () => getMemberRoles(organisationId, memberId),
    })

export const useAddRoleToMember = (organisationId: string, memberId: string) => {
    const queryClient = useQueryClient()
    return useMutation<void, Error, string>({
        mutationFn: (roleId) => addRoleToMember(organisationId, memberId, roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organisation', organisationId, 'members', memberId, 'roles'],
            })
            queryClient.invalidateQueries({
                queryKey: ['organisation', organisationId, 'members'],
            })
        },
    })
}

export const useRemoveRoleFromMember = (organisationId: string, memberId: string) => {
    const queryClient = useQueryClient()
    return useMutation<void, Error, string>({
        mutationFn: (roleId) => removeRoleFromMember(organisationId, memberId, roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organisation', organisationId, 'members', memberId, 'roles'],
            })
            queryClient.invalidateQueries({
                queryKey: ['organisation', organisationId, 'members'],
            })
        },
    })
}
