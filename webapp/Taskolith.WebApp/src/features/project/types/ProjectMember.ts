export type ProjectMember = {
    memberId: string
    userId: string
    organisationId: string
    username: string
    email: string
}

export type ProjectMembersResponse = {
    members: ProjectMember[]
}
