import apiClient from '@/lib/axios'
import { type CreateProjectRequest } from '@/features/organisation/types/CreateProjectRequest'
import { type Project } from '@/features/organisation/types/Project'

export const CreateProject = async (
    organisationId: string,
    request: CreateProjectRequest
) => {
    const { data } = await apiClient.post(`/organisations/${organisationId}/projects`, request)
    return data
}

export const GetAllProjects = async (organisationId: string): Promise<Project[]> => {
    const { data } = await apiClient.get(`/organisations/${organisationId}/projects`)
    return data
}

export const GetMyProjects = async (organisationId: string): Promise<Project[]> => {
    const { data } = await apiClient.get(`/organisations/${organisationId}/projects/me`)
    return data
}

export const UpdateProject = async (
    organisationId: string,
    projectId: string,
    payload: { name?: string; description?: string }
) => {
    try {
        const { data } = await apiClient.put(
            `/organisations/${organisationId}/projects/${projectId}`,
            payload
        )
        return data
    } catch (error: any) {
        if (error.response && error.response.status === 204) {
            return { success: true }
        }
        throw error
    }
}

export const DeleteProject = async (
    organisationId: string,
    projectId: string
) => {
    await apiClient.delete(`/organisations/${organisationId}/projects/${projectId}`)
}

export const AssignMembersToProject = async (
    organisationId: string,
    projectId: string,
    membersId: string[]
) => {
    await apiClient.post(
        `/organisations/${organisationId}/projects/${projectId}/members`,
        { membersId }
    )
}

export const RemoveMemberFromProject = async (
    organisationId: string,
    projectId: string,
    memberId: string
) => {
    await apiClient.delete(
        `/organisations/${organisationId}/projects/${projectId}/members/${memberId}`
    )
}

