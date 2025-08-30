import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useMembers'
import { useGetRoles, useCreateRole, useUpdateRole, useDeleteRole } from '@/features/organisation/hooks/useRoles'
import { Permission } from '@/features/organisation/types/Permission'
import { type Role } from '@/features/organisation/types/Role'
import { RoleSchema } from '@/features/organisation/types/RoleRequest'

export const useRolesPage = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    if (!organisationId) throw new Error("Organisation ID required")

    const { user: currentUser } = useAuth()
    const currentUserId = currentUser?.userId

    const [query, setQuery] = useState('')
    const [isRoleModalOpen, setRoleModalOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
    const [notification, setNotification] = useState({ open: false, title: '', description: '', variant: 'success' as 'success' | 'error' })

    const { data: rolesResponse, isLoading: isLoadingRoles, isError: isErrorRoles } = useGetRoles(organisationId)
    const { data: members } = useGetMembersInsideOrganisation(organisationId)

    const mutationErrorHandler = (error: any) => {
        const apiMessage = error.response?.data?.message || error.response?.data?.title
        const fallbackMessage = `An unexpected error occurred. (Status: ${error.response?.status || 'unknown'})`
        setNotification({
            open: true,
            variant: 'error',
            title: 'Action Failed',
            description: apiMessage || fallbackMessage,
        })
    }

    const createMutation = useCreateRole(organisationId)
    const updateMutation = useUpdateRole(organisationId)
    const deleteMutation = useDeleteRole(organisationId)

    const permissions = useMemo(() => {
        const defaultPerms = { canCreate: false, canEdit: false, canDelete: false }
        if (!members || !currentUserId) return defaultPerms
        const currentUserAsMember = members.find(m => m.userId.toLowerCase() === currentUserId.toLowerCase())
        const userPermissions = currentUserAsMember?.roles.reduce((acc, role) => acc | role.permissions, 0) ?? 0
        const has = (p: number) => (userPermissions & p) === p
        return {
            canCreate: has(Permission.CreateRole),
            canEdit: has(Permission.UpdateRole),
            canDelete: has(Permission.DeleteRole),
        }
    }, [members, currentUserId])

    const filteredRoles = useMemo(() => {
        const allRoles = rolesResponse?.roles ?? []
        if (!query) return allRoles
        return allRoles.filter(role => role.name.toLowerCase().includes(query.toLowerCase()))
    }, [rolesResponse, query])

    const openCreateRoleModal = () => {
        setEditingRole(null)
        setRoleModalOpen(true)
    }

    const openEditRoleModal = (role: Role) => {
        setEditingRole(role)
        setRoleModalOpen(true)
    }

    const openDeleteRoleModal = (role: Role) => {
        setRoleToDelete(role)
    }

    const handleConfirmDelete = () => {
        if (!roleToDelete) return

        deleteMutation.mutate(roleToDelete.id, {
            onSuccess: () => {
                setRoleToDelete(null)
                setNotification({
                    open: true,
                    variant: 'success',
                    title: 'Role Deleted',
                    description: `The role "${roleToDelete.name}" has been successfully deleted.`,
                })
            },
            onError: mutationErrorHandler,
        })
    }

    const handleSubmitRole = (payload: { name: string; permissions: number }) => {
        const parsed = RoleSchema.safeParse(payload)
        if (!parsed.success) {
            setNotification({ open: true, variant: 'error', title: 'Validation Error', description: parsed.error.issues.map(e => e.message).join('\n') })
            return
        }
        const mutationOptions = {
            onSuccess: () => {
                setRoleModalOpen(false)
                setNotification({ open: true, variant: 'success', title: 'Success', description: `Role has been successfully ${editingRole ? 'updated' : 'created'}.` })
            },
            onError: mutationErrorHandler,
        }
        if (editingRole) {
            updateMutation.mutate({ roleId: editingRole.id, request: payload }, mutationOptions)
        } else {
            createMutation.mutate(payload, mutationOptions)
        }
    }

    return {
        query, setQuery, permissions, isLoadingRoles, isErrorRoles, filteredRoles,
        isRoleModalOpen, setRoleModalOpen, editingRole, openCreateRoleModal, openEditRoleModal, handleSubmitRole,
        roleToDelete, setRoleToDelete, openDeleteRoleModal, handleConfirmDelete,
        notification, setNotification,
        isSubmitting: createMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}
