import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
    useAddRoleToMember,
    useRemoveRoleFromMember,
} from '@/features/organisation/hooks/useMemberRoles'
import { useGetRoles } from '@/features/organisation/hooks/useRoles'
import { type Member } from '@/features/organisation/types/Member'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

interface ManageRolesModalProps {
    member: Member | null
    open: boolean
    onOpenChange: (open: boolean) => void
    organisationId: string
    canAddRole: boolean
    canRemoveRole: boolean
}

export const ManageRolesModal: React.FC<ManageRolesModalProps> = ({
    member,
    open,
    onOpenChange,
    organisationId,
    canAddRole,
    canRemoveRole,
}) => {
    const queryClient = useQueryClient()
    const { data: allRoles, isLoading: isLoadingRoles } = useGetRoles(organisationId)

    const { mutate: addRole, isPending: isAddingRole } = useAddRoleToMember(
        organisationId,
        member?.memberId ?? ''
    )
    const { mutate: removeRole, isPending: isRemovingRole } = useRemoveRoleFromMember(
        organisationId,
        member?.memberId ?? ''
    )

    if (!member) return null

    const handleRoleToggle = (roleId: string, hasRole: boolean) => {
        const queryKey = ['organisation', organisationId, 'members']
        const roleToUpdate = allRoles?.roles.find((r) => r.id === roleId)
        if (!roleToUpdate) return

        const mutationOptions = {
            onSuccess: () => {
                queryClient.setQueryData<Member[]>(queryKey, (oldData = []) =>
                    oldData.map((m) => {
                        if (m.memberId === member.memberId) {
                            const newRoles = hasRole
                                ? m.roles?.filter((r) => r.id !== roleId)
                                : [...(m.roles || []), roleToUpdate]
                            return { ...m, roles: newRoles }
                        }
                        return m
                    })
                )
            },
        }

        if (hasRole) {
            removeRole(roleId, mutationOptions)
        } else {
            addRole(roleId, mutationOptions)
        }
    }

    const isPending = isAddingRole || isRemovingRole

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                        Manage Roles for {member.username}
                    </h3>
                </div>

                {isLoadingRoles ? (
                    <p>Loading roles...</p>
                ) : !allRoles || allRoles.roles.length === 0 ? (
                    <div className="flex items-center gap-2 text-gray-500">
                        <AlertCircle size={16} />
                        <span>No roles available in this organisation.</span>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {allRoles.roles.map((role) => {
                            const hasRole = member.roles?.some((r) => r.id === role.id) ?? false
                            const canChange = (hasRole && canRemoveRole) || (!hasRole && canAddRole)

                            return (
                                <div key={role.id} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id={`role-${role.id}`}
                                        checked={hasRole}
                                        onChange={() => handleRoleToggle(role.id, hasRole)}
                                        disabled={!canChange || isPending}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <label
                                        htmlFor={`role-${role.id}`}
                                        className={`text-sm font-medium leading-none ${!canChange || isPending
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                        {role.name}
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="flex justify-end pt-4 mt-4 border-t">
                    <Button onClick={() => onOpenChange(false)} disabled={isPending}>
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
