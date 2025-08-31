import apiClient from '@/lib/axios'
import { type ProjectMember, type ProjectMembersResponse } from '@/features/project/types/ProjectMember'

export const GetProjectMembers = async (organisationId: string, projectId: string): Promise<ProjectMember[]> => {
    if (!organisationId || !projectId) {
        return [];
    }
    
    try {
        const res = await apiClient.get<ProjectMembersResponse>(
            `/organisations/${organisationId}/projects/${projectId}/members`
        )
        return res.data.members ?? []
    } catch (error) {
        console.error("Failed to fetch project members:", error)
        throw new Error('Failed to fetch project members')
    }
}
