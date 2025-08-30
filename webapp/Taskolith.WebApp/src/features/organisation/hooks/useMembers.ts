import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetMembersInsideOrganisation } from '@/features/organisation/api/Members'
import { type Member } from "@/features/organisation/types/Member"
import { RemoveMember } from '@/features/organisation/api/Members'

export const useGetMembersInsideOrganisation = (organisationId: string) => 
    useQuery<{ members: Member[] }, Error, Member[]>({
        queryKey: ["organisation", organisationId, "members"],
        queryFn: () => GetMembersInsideOrganisation(organisationId),
        enabled: !!organisationId,
        select: data => data.members ?? [],
    })


export const useRemoveMember = (organisationId: string, memberId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => RemoveMember(organisationId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'members'] })
        },
    })
}
