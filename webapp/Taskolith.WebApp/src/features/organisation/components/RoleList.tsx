import React from 'react'
import { AlertCircle, Pencil, Trash2 } from 'lucide-react'
import { type Role } from '@/features/organisation/types/Role'
import { Button } from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface RoleRowProps {
    role: Role
    canEdit: boolean
    canDelete: boolean
    onEdit: () => void
    onDelete: () => void
}

const RoleRow: React.FC<RoleRowProps> = ({ role, canEdit, canDelete, onEdit, onDelete }) => {
    const permissionCount = role.permissions > 0 ? (role.permissions.toString(2).match(/1/g) || []).length : 0

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-900">{role.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{permissionCount} permission{permissionCount !== 1 ? 's' : ''}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex gap-2 justify-end">
                    {canEdit && <Button size="icon" variant="outline" onClick={onEdit}><Pencil size={16} /></Button>}
                    {canDelete && <Button size="icon" variant="destructive" onClick={onDelete}><Trash2 size={16} /></Button>}
                </div>
            </td>
        </tr>
    )
}


interface RoleListProps {
    roles: Role[]
    isLoading: boolean
    isError: boolean
    canEdit: boolean
    canDelete: boolean
    onEditRole: (role: Role) => void
    onDeleteRole: (role: Role) => void
}

export const RoleList: React.FC<RoleListProps> = ({ roles, isLoading, isError, canEdit, canDelete, onEditRole, onDeleteRole }) => {
    if (isLoading) return <div className="bg-white rounded-lg shadow h-full"><LoadingSpinner /></div>
    if (isError) return (
        <div className="bg-white rounded-lg shadow h-full flex justify-center items-center text-red-600 gap-2">
            <AlertCircle size={20} /> Failed to load roles.
        </div>
    )

    return (
        <div className="bg-white rounded-lg shadow max-h-full flex flex-col">
            <div className="overflow-y-auto rounded-lg">
                <table className="min-w-full rounded-lg divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                            <th className="px-6 py-3" />
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {roles.length > 0 ? (
                            roles.map((role) => (
                                <RoleRow
                                    key={role.id}
                                    role={role}
                                    canEdit={canEdit}
                                    canDelete={canDelete}
                                    onEdit={() => onEditRole(role)}
                                    onDelete={() => onDeleteRole(role)}
                                />
                            ))
                        ) : (
                            <tr><td colSpan={3} className="text-center p-6 text-gray-500">No roles found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
