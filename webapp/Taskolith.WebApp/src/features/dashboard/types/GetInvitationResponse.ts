
export interface InviteRole {
    id: string
    name: string
}

export interface Invitation {
    id: string
    organisationId: string
    organisationName: string
    status: string
    dueDate: string
    expired: boolean
    initialRoles: InviteRole[]
}

export interface GetInvitesResponse {
    invites: Invitation[]
}
