import { useQuery } from '@tanstack/react-query'
import { GetMembersInsideOrganisation } from '@/features/organisation/api/GetMembersInsideOrganisation'
import { type Member } from '@/features/organisation/types/Member'
import { type GetOrganisationMembersResponse } from '@/features/organisation/types/GetOrganisationMembersResponse'

export const useGetMembersInsideOrganisation = (organisationId: string) => {
    return useQuery<GetOrganisationMembersResponse[], Error, Member[]>({
        queryKey: ['organisation', organisationId, 'members'], // undo
        queryFn: () => GetMembersInsideOrganisation(organisationId),
        enabled: !!organisationId,
        select: (data: GetOrganisationMembersResponse[]): Member[] => {
            if (!data) return []
            return data.map(responseItem => {
                return {
                    ...responseItem.member,
                    roles: responseItem.roles,
                }
            })
        },
    })
}

