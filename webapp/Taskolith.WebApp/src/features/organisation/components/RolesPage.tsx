import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useMembers'
import { Permission } from '@/features/organisation/types/Permission'
import { useGetRoles, useCreateRole, useUpdateRole, useDeleteRole } from '@/features/organisation/hooks/useRoles'
import RoleModal from '@/features/organisation/components/RoleModal'
import { Button } from '@/components/ui/Button'
import { AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react'
import { type Role } from '@/features/organisation/types/Role'
import { RoleSchema } from '@/features/organisation/types/RoleRequest'

const RolesPage: React.FC = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const { user: currentUser } = useAuth()
    const currentUserId = currentUser?.userId

    const { data: rolesResponse, isLoading: isRolesLoading, isError: isRolesError } = useGetRoles(organisationId!)
    const { data: members } = useGetMembersInsideOrganisation(organisationId!)

    const createMutation = useCreateRole(organisationId!)
    const updateMutation = useUpdateRole(organisationId!)
    const deleteMutation = useDeleteRole(organisationId!)

    const [isModalOpen, setModalOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)

    const pageState = useMemo(() => {
        if (!members) return { canCreate: false, canEdit: false, canDelete: false }

        const currentUserAsMember = members.find(m => m.userId === currentUserId)
        const currentUserPermissions = currentUserAsMember
            ? currentUserAsMember.roles.reduce((acc: number, role) => acc | role.permissions, Permission.Public)
            : Permission.Public

        const has = (p: number) => (currentUserPermissions & p) === p

        return {
            canCreate: has(Permission.CreateRole),
            canEdit: has(Permission.UpdateRole),
            canDelete: has(Permission.DeleteRole),
        }
    }, [members, currentUserId])

    const openCreate = () => {
        setEditingRole(null)
        setModalOpen(true)
    }

    const openEdit = (role: Role) => {
        setEditingRole(role)
        setModalOpen(true)
    }

    const handleDelete = (roleId: string) => {
        if (!window.confirm('Are you sure you want to delete this role?')) return
        deleteMutation.mutate(roleId)
    }

    const handleSubmit = (payload: { name: string; permissions: number }) => {
        const parsed = RoleSchema.safeParse({ name: payload.name, permissions: payload.permissions })
        if (!parsed.success) {
            alert(parsed.error.issues.map(e => e.message).join('\n'))
            return
        }

        if (editingRole) {
            updateMutation.mutate({ roleId: editingRole.id, request: { name: payload.name, permissions: payload.permissions } })
        } else {
            createMutation.mutate({ name: payload.name, permissions: payload.permissions })
        }
        setModalOpen(false)
    }

    return (
        <div className="p-6 bg-gray-50 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Roles</h1>
                    <p className="text-sm text-gray-500">Manage organisation roles and permissions.</p>
                </div>
                {pageState.canCreate && (
                    <Button onClick={openCreate} className="gap-2" aria-label="New role">
                        <Plus size={16} /> New Role
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isRolesLoading ? (
                    <div className="p-6 text-gray-500">Loading roles...</div>
                ) : isRolesError ? (
                    <div className="p-6 text-red-600 flex gap-2 items-center">
                        <AlertCircle size={18} /> Failed to load roles.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(rolesResponse?.roles ?? []).map((role) => (
                                <tr key={role.id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {role.permissions > 0
                                            ? (() => {
                                                const count = role.permissions
                                                    .toString(2)
                                                    .split('0')
                                                    .join('')
                                                    .length;
                                                return `${count} permission${count !== 1 ? 's' : ''}`;
                                            })()
                                            : 'No permissions'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            {pageState.canEdit && (
                                                <Button size="icon" variant="outline" onClick={() => openEdit(role)} aria-label="Edit role">
                                                    <Pencil size={16} />
                                                </Button>
                                            )}
                                            {pageState.canDelete && (
                                                <Button size="icon" variant="destructive" onClick={() => handleDelete(role.id)} aria-label="Delete role">
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(rolesResponse?.roles ?? []).length === 0 && (
                                <tr><td colSpan={3} className="text-center p-6 text-gray-500">No roles yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <RoleModal
                open={isModalOpen}
                onOpenChange={setModalOpen}
                onSubmit={(payload) => handleSubmit(payload)}
                initialData={editingRole ? { name: editingRole.name, permissions: editingRole.permissions } : null}
                isPending={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    )
}

export default RolesPage
