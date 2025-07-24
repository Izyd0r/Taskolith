import { useMutation } from '@tanstack/react-query'
import { CreateOrganisation } from '@/features/dashboard/api/CreateOrganisation'
import { type CreateOrganisationRequest } from '@/features/dashboard/types/CreateOrganisationRequest'

export const useCreateOrganisation = () => {
    return useMutation<void, Error, CreateOrganisationRequest>({
        mutationFn: CreateOrganisation,
    })
}
