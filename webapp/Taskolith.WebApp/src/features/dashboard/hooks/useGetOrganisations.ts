import { useQuery } from '@tanstack/react-query'
import { GetOrganisations } from '@/features/dashboard/api/GetOrganisations'

export const useGetOrganisations = () => {
    return useQuery({
        queryKey: ['organisations'],
        queryFn: GetOrganisations,
    })
}
