import { type Permission } from '@/features/organisation/types/Permission'

export type Role = {
    id: string
    organisationId: string
    name: string
    permissions: typeof Permission
}
