import apiClient from '@/lib/axios'

export type AssignProjectMembersRequest = {
    membersId: string[]
}

export const AssignProjectMembers = async (
    organisationId: string,
    projectId: string,
    request: AssignProjectMembersRequest
) => {
    const { data } = await apiClient.post(
        `/organisations/${organisationId}/projects/${projectId}/members`,
        request
    )
    return data
}
