import { useMutation } from '@tanstack/react-query'
import { type CreateProjectRequest } from '@/features/organisation/types/CreateProjectRequest'
import { CreateProject } from '@/features/organisation/api/CreateProject'

export const useCreateProject = (organisationId: string) => {
    return useMutation<void, Error, CreateProjectRequest>({
        mutationFn: (request) => CreateProject(organisationId, request),
    })
}
