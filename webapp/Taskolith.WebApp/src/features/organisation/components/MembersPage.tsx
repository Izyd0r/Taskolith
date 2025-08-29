import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { UserPlus } from 'lucide-react'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useGetMembersInsideOrganisation'
import { Permission } from '@/features/organisation/types/Permission'
import { type Member } from '@/features/organisation/types/Member'
import { type Role } from '@/features/organisation/types/Role'
import { ListPageLayout } from '@/components/layout/ListPageLayout'
import { MemberList } from '@/features/organisation/components/MembersList'
import { InviteMemberModal } from '@/features/organisation/components/InviteMemberModal'
import { ManageRolesModal } from '@/features/organisation/components/ManageRolesModal'

export default function MembersPage() {
    const { organisationId } = useParams<{ organisationId: string }>()
    const { user: currentUser } = useAuth()
    const currentUserId = currentUser?.userId
    const { data: members, isLoading, isError } = useGetMembersInsideOrganisation(organisationId!)

    const [query, setQuery] = useState('')
    const [isInviteModalOpen, setInviteModalOpen] = useState(false)
    const [memberToEditRoles, setMemberToEditRoles] = useState<Member | null>(null)

    useEffect(() => {
        if (memberToEditRoles && members) {
            const updatedMember = members.find((m) => m.memberId === memberToEditRoles.memberId)
            setMemberToEditRoles(updatedMember || null)
        }
    }, [members, memberToEditRoles])

    const pageState = useMemo(() => {
        if (!members) return { canInvite: false, canKick: false, canAddRole: false, canRemoveRole: false, filteredMembers: [] }

        const currentUserAsMember = members.find((member) => member.userId === currentUserId)
        const currentUserPermissions = currentUserAsMember?.roles.reduce((acc: number, role: Role) => acc | role.permissions, 0) ?? 0
        const hasPermission = (permission: number) => (currentUserPermissions & permission) === permission

        const lowerCaseQuery = query.toLowerCase()
        const filteredMembers = members.filter(member =>
            member.username?.toLowerCase().includes(lowerCaseQuery) ||
            member.email?.toLowerCase().includes(lowerCaseQuery) ||
            member.roles?.some(role => role.name?.toLowerCase().includes(lowerCaseQuery))
        )

        return {
            canInvite: hasPermission(Permission.InviteMember),
            canKick: hasPermission(Permission.KickMember),
            canAddRole: hasPermission(Permission.AddRole),
            canRemoveRole: hasPermission(Permission.RemoveRole),
            filteredMembers,
        }
    }, [members, currentUserId, query])

    return (
        <>
            <ListPageLayout
                title="Organisation Members"
                description="Manage who has access to this organisation."
                searchQuery={query}
                onSearchChange={setQuery}
                searchPlaceholder="Filter by username, email, or role..."
                isSearchDisabled={isLoading || isError}
                actionButton={
                    pageState.canInvite && (
                        <Button onClick={() => setInviteModalOpen(true)} className="gap-2">
                            <UserPlus size={18} /> Invite Member
                        </Button>
                    )
                }
            >
                <MemberList
                    members={pageState.filteredMembers}
                    isLoading={isLoading}
                    isError={isError}
                    currentUserId={currentUserId}
                    canKick={pageState.canKick}
                    canManageRoles={pageState.canAddRole || pageState.canRemoveRole}
                    onManageRoles={(member) => setMemberToEditRoles(member)}
                />
            </ListPageLayout>

            {organisationId && (
                <>
                    <InviteMemberModal
                        open={isInviteModalOpen}
                        onOpenChange={setInviteModalOpen}
                        organisationId={organisationId}
                    />
                    <ManageRolesModal
                        open={!!memberToEditRoles}
                        onOpenChange={() => setMemberToEditRoles(null)}
                        member={memberToEditRoles}
                        organisationId={organisationId}
                        canAddRole={pageState.canAddRole}
                        canRemoveRole={pageState.canRemoveRole}
                    />
                </>
            )}
        </>
    )
}
