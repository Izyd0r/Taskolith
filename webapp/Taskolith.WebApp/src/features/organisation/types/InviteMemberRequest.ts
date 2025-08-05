import { z } from 'zod'
import { InviteMemberScheme } from '@/features/organisation/validators/InviteMemberScheme'

export type InviteMemberRequest = z.infer<typeof InviteMemberScheme>
