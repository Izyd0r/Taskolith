import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useGetMembersInsideOrganisation } from './useMembers'
import { type Member } from '@/features/organisation/types/Member'
import { type Role } from '@/features/organisation/types/Role'
import { Permission } from '@/features/organisation/types/Permission'
import { useGetPendingInvites, useRevokeInvite } from './useInvite'

export const useOrganisationAccess = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    if (!organisationId) throw new Error("Organisation ID is required")

    const { user: currentUser } = useAuth()
    const currentUserId = currentUser?.userId?.toLowerCase()

    const [view, setView] = useState<"members" | "invites">("members")
    const [query, setQuery] = useState("")
    const [isInviteModalOpen, setInviteModalOpen] = useState(false)
    const [memberToEditRoles, setMemberToEditRoles] = useState<Member | null>(null)

    const { data: members = [], isLoading: isLoadingMembers, isError: isErrorMembers } =
        useGetMembersInsideOrganisation(organisationId)

    const { data: invites = [], isLoading: isLoadingInvites, isError: isErrorInvites } =
        useGetPendingInvites(organisationId, view === "invites")

    const revokeInviteMutation = useRevokeInvite(organisationId)

    const permissions = useMemo(() => {
        const defaultPermissions = { canInvite: false, canKick: false, canAddRole: false, canRemoveRole: false, canManageInvites: false }
        if (!members || !currentUserId) return defaultPermissions

        const currentUserAsMember = members.find(m => m.userId.toLowerCase() === currentUserId)
        const currentUserPermissions =
            currentUserAsMember?.roles.reduce((acc: number, role: Role) => acc | role.permissions, 0) ?? 0

        const has = (p: number) => (currentUserPermissions & p) === p
        const canInvite = has(Permission.InviteMember)

        return {
            canInvite,
            canKick: has(Permission.KickMember),
            canAddRole: has(Permission.AddRole),
            canRemoveRole: has(Permission.RemoveRole),
            canManageInvites: canInvite,
        }
    }, [members, currentUserId])

    const lowerCaseQuery = query.toLowerCase()

    const filteredMembers = useMemo(() => {
        return members.filter(
            m =>
                m.username?.toLowerCase().includes(lowerCaseQuery) ||
                m.email?.toLowerCase().includes(lowerCaseQuery) ||
                m.roles?.some(r => r.name.toLowerCase().includes(lowerCaseQuery))
        )
    }, [members, lowerCaseQuery])

    const filteredInvites = useMemo(() => {
        if (!invites) return []
        if (!lowerCaseQuery) return invites
        return invites.filter(
            i =>
                i.invitedUserEmail?.toLowerCase().includes(lowerCaseQuery) ||
                i.initialRoles?.some(r => r.name.toLowerCase().includes(lowerCaseQuery))
        )
    }, [invites, lowerCaseQuery])

    useEffect(() => {
        if (memberToEditRoles) {
            const updatedMember = members.find(m => m.memberId === memberToEditRoles.memberId)
            setMemberToEditRoles(updatedMember || null)
        }
    }, [members, memberToEditRoles])

    return {
        organisationId,
        currentUserId,
        view,
        query,
        isInviteModalOpen,
        memberToEditRoles,
        permissions,
        filteredMembers,
        filteredInvites,
        members,
        isLoadingMembers,
        isErrorMembers,
        isLoadingInvites,
        isErrorInvites,
        revokeInvite: revokeInviteMutation,
        setView,
        setQuery,
        setInviteModalOpen,
        setMemberToEditRoles,
    }
}
