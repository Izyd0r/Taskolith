import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
    CreateProject,
    GetAllProjects,
    GetMyProjects,
    UpdateProject,
    DeleteProject,
    AssignMembersToProject,
    RemoveMemberFromProject
} from '@/features/organisation/api/Projects'
import { type CreateProjectRequest } from '@/features/organisation/types/CreateProjectRequest'

const getProjectsQueryKey = (organisationId: string) => ['projects', organisationId]

export const useCreateProject = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (request: CreateProjectRequest) => CreateProject(organisationId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getProjectsQueryKey(organisationId) })
        },
    })
}

export const useGetAllProjects = (organisationId: string, options: { enabled: boolean }) => {
    return useQuery({
        queryKey: [...getProjectsQueryKey(organisationId), 'all'],
        queryFn: () => GetAllProjects(organisationId),
        enabled: !!organisationId && options.enabled,
    })
}

export const useGetMyProjects = (organisationId: string, options: { enabled: boolean }) => {
    return useQuery({
        queryKey: [...getProjectsQueryKey(organisationId), 'me'],
        queryFn: () => GetMyProjects(organisationId),
        enabled: !!organisationId && options.enabled,
    })
}

export const useUpdateProject = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ projectId, payload }: { projectId: string; payload: { name?: string; description?: string } }) =>
            UpdateProject(organisationId, projectId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getProjectsQueryKey(organisationId) })
        },
    })
}

export const useDeleteProject = (organisationId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (projectId: string) => DeleteProject(organisationId, projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getProjectsQueryKey(organisationId) })
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
