import { type Member } from '@/features/organisation/types/Member'
import { type Role } from '@/features/organisation/types/Role'

export type GetOrganisationMembersResponse = {
    member: Member
    roles: Role[]
}
