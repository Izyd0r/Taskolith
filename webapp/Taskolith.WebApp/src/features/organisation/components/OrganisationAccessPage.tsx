import React from 'react'
import { Button } from '@/components/ui/Button'
import { UserPlus } from 'lucide-react'
import { ListPageLayout } from '@/components/layout/ListPageLayout'
import { MemberList } from '@/features/organisation/components/MembersList'
import { InvitesList } from '@/features/organisation/components/InvitesList'
import { InviteMemberModal } from '@/features/organisation/components/InviteMemberModal'
import { ManageRolesModal } from '@/features/organisation/components/ManageRolesModal'
import { useOrganisationAccess } from '@/features/organisation/hooks/useOrganisationAccess'

export default function OrganisationAccessPage() {
    const {
        organisationId, view, query, isInviteModalOpen, memberToEditRoles,
        permissions, filteredMembers, filteredInvites,
        isLoadingMembers, isErrorMembers, isLoadingInvites, isErrorInvites,
        revokeInvite, setView, setQuery, setInviteModalOpen, setMemberToEditRoles, currentUserId,
    } = useOrganisationAccess()

    const searchPlaceholder = view === 'members'
        ? "Filter by username, email, or role..."
        : "Filter by email or role..."

    return (
        <>
            <ListPageLayout
                title="Access Management"
                description="Manage members and pending invitations for this organisation."
                searchQuery={query} onSearchChange={setQuery}
                searchPlaceholder={searchPlaceholder}
                isSearchDisabled={isLoadingMembers || (view === 'invites' && isLoadingInvites)}
                actionButton={
                    permissions.canInvite && (
                        <Button onClick={() => setInviteModalOpen(true)} className="gap-2">
                            <UserPlus size={18} /> Invite Member
                        </Button>
                    )
                }
            >
                <div className="flex items-center rounded-lg bg-gray-200 p-1 text-sm self-start mb-4">
                    <button
                        onClick={() => setView('members')}
                        className={`px-3 py-1 rounded-md transition-colors duration-200 ${view === 'members' ? 'bg-white shadow-sm font-semibold text-gray-800' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Members
                    </button>
                    {permissions.canManageInvites && (
                        <button
                            onClick={() => setView('invites')}
                            className={`px-3 py-1 rounded-md transition-colors duration-200 ${view === 'invites' ? 'bg-white shadow-sm font-semibold text-gray-800' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Pending Invites
                        </button>
                    )}
                </div>

                {view === 'members' && (
                    <MemberList
                        members={filteredMembers} isLoading={isLoadingMembers} isError={isErrorMembers}
                        currentUserId={currentUserId} canKick={permissions.canKick}
                        canManageRoles={permissions.canAddRole || permissions.canRemoveRole}
                        onManageRoles={setMemberToEditRoles}
                    />
                )}

                {view === 'invites' && (
                    <InvitesList
                        isLoading={isLoadingInvites}
                        isError={isErrorInvites}
                        filteredInvites={filteredInvites}
                        isSearchActive={query.length > 0}
                        onRevokeInvite={revokeInvite.mutate}
                        isRevoking={revokeInvite.isPending}
                    />
                )}
            </ListPageLayout>

            <InviteMemberModal open={isInviteModalOpen} onOpenChange={setInviteModalOpen} organisationId={organisationId} />
            {memberToEditRoles && (
                <ManageRolesModal
                    open={!!memberToEditRoles} onOpenChange={() => setMemberToEditRoles(null)}
                    member={memberToEditRoles} organisationId={organisationId}
                    canAddRole={permissions.canAddRole} canRemoveRole={permissions.canRemoveRole}
                />
            )}
        </>
    )
}
