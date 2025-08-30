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
import { RoleSelectionList } from './RoleSelectionList'

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
    const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRoles(organisationId, { enabled: open })

    const { mutate: addRole, isPending: isAddingRole } = useAddRoleToMember(
        organisationId,
        member?.memberId ?? ''
    )
    const { mutate: removeRole, isPending: isRemovingRole } = useRemoveRoleFromMember(
        organisationId,
        member?.memberId ?? ''
    )

    if (!member) return null

    const handleRoleToggle = (role: { id: string }) => {
        const hasRole = member.roles?.some((r) => r.id === role.id) ?? false

        const mutationOptions = {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'members'] })
            },
            onError: (error: any) => {
                alert(`Failed to update role: ${error.message}`)
                queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'members'] })
            }
        }

        if (hasRole) {
            if (!canRemoveRole) return
            removeRole(role.id, mutationOptions)
        } else {
            if (!canAddRole) return
            addRole(role.id, mutationOptions)
        }
    }

    const isPending = isAddingRole || isRemovingRole

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Manage Roles for {member.username}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Select the roles this member should have.
                        </p>
                    </div>

                    <RoleSelectionList
                        availableRoles={rolesResponse?.roles ?? []}
                        isLoading={isLoadingRoles}
                        isDisabled={isPending}
                        activeRoles={member.roles ?? []}
                        onRoleChange={handleRoleToggle}
                    />

                    <div className="flex justify-end pt-4">
                        <Button onClick={() => onOpenChange(false)} disabled={isPending}>
                            Done
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
