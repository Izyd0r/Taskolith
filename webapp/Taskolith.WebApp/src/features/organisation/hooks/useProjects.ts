import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { CreateProject, GetProjects, UpdateProject, DeleteProject, AssignMembersToProject, RemoveMemberFromProject } from '@/features/organisation/api/Projects'
import { type CreateProjectRequest } from '@/features/organisation/types/CreateProjectRequest'
import { type Project } from '@/features/organisation/types/Project'

export const useCreateProject = (organisationId: string) => {
    return useMutation<void, Error, CreateProjectRequest>({
        mutationFn: (request) => CreateProject(organisationId, request),
    })
}

export const useGetProjects = (organisationId: string) => {
    return useQuery<Project[], Error>({
        queryKey: ['projects', organisationId],
        queryFn: () => GetProjects(organisationId),
        enabled: !!organisationId,
    })
}

export const useUpdateProject = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ projectId, payload }: { projectId: string; payload: { name?: string; description?: string } }) =>
            UpdateProject(organisationId, projectId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', organisationId] })
        },
    })
}

export const useDeleteProject = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (projectId: string) => DeleteProject(organisationId, projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', organisationId] })
        },
    })
}

export const useAssignMembersToProject = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: { projectId: string; membersId: string[] }) =>
            AssignMembersToProject(organisationId, payload.projectId, payload.membersId),
        onSuccess: () => {
            // todo
        },
        onError: () => {
            // todo
        },
    })
}

export const useRemoveMemberFromProject = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: { projectId: string; memberId: string }) =>
            RemoveMemberFromProject(organisationId, payload.projectId, payload.memberId),
        onSuccess: () => {
            // todo
        },
        onError: () => {
            // todo
        },
    })
}
