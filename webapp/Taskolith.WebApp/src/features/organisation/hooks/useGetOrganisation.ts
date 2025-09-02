import { useMemo } from 'react'
import { useGetOrganisations } from '@/features/dashboard/hooks/useGetOrganisations'

export const useGetOrganisation = (organisationId: string) => {
    const { data: organisations, isLoading, isError } = useGetOrganisations()

    const organisation = useMemo(() => {
        if (!organisations || !organisationId) {
            return undefined
        }

        return organisations.find(org => org.organisationId === organisationId)

    }, [organisations, organisationId])

    return {
        data: organisation,
        isLoading,
        isError,
    }
}
