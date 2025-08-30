import { type Role } from './Role'

export interface Invite {
    id: string;
    invitedUserEmail: string;
    invitedAt: string;
    dueDate: string;
    initialRoles: Role[];
}
