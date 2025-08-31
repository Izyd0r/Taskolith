export type TaskMember = {
    memberId: string
    userId: string
    organisationId: string
    username: string
    email: string
}

export type TaskMembersResponse = {
    members: TaskMember[]
}
