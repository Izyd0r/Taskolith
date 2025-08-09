
export type Role = {
    id: string
    organisationId: string
    name: string
    permissions: number
}

export interface GetRolesResponse {
    roles: Role[]
}
