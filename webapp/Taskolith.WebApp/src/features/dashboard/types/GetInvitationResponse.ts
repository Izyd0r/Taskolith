export interface Invitation {
    id: string
    organisationId: string
    status: string
    dueDate: string
    expired: boolean
}

export interface GetInvitesResponse {
    invites: Invitation[]
}
