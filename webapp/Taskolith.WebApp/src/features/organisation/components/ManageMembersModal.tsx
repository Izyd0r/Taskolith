import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { useAssignMembersToProject, useRemoveMemberFromProject } from '@/features/organisation/hooks/useProjects'

type ManageMembersModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    organisationId: string
    projectId: string
    canAssign: boolean
    canRemove: boolean
}

export function ManageMembersModal({
    open,
    onOpenChange,
    organisationId,
    projectId,
    canAssign,
    canRemove,
}: ManageMembersModalProps) {
    const [memberIdToAdd, setMemberIdToAdd] = useState('')
    const [memberIdToRemove, setMemberIdToRemove] = useState('')

    const assignMemberMutation = useAssignMembersToProject(organisationId)
    const removeMemberMutation = useRemoveMemberFromProject(organisationId)

    const handleAssignMember = () => {
        if (!memberIdToAdd.trim()) return
        assignMemberMutation.mutate({ projectId, membersId: [memberIdToAdd] }, {
            onSuccess: () => {
                alert(`Successfully initiated request to add '${memberIdToAdd}'`)
                setMemberIdToAdd('')
            },
            onError: (error: any) => alert(`Failed to add member: ${error.response?.data?.message || error.message}`),
        })
    }

    const handleRemoveMember = () => {
        if (!memberIdToRemove.trim()) return
        removeMemberMutation.mutate({ projectId, memberId: memberIdToRemove }, {
            onSuccess: () => {
                alert(`Successfully initiated request to remove '${memberIdToRemove}'`)
                setMemberIdToRemove('')
            },
            onError: (error: any) => alert(`Failed to remove member: ${error.response?.data?.message || error.message}`),
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <h2 id="dialog-title" className="text-xl font-bold">Manage Members</h2>
            <DialogContent>
                <p className="text-sm text-gray-600 mb-4">Enter a user's ID to add or remove them from this project.</p>
                {canAssign && (
                    <div className="space-y-2">
                        <InputField id="member-to-add" placeholder="Enter Member ID to Add" value={memberIdToAdd} onChange={(e) => setMemberIdToAdd(e.target.value)} />
                        <Button onClick={handleAssignMember} disabled={assignMemberMutation.isPending}>{assignMemberMutation.isPending ? 'Adding...' : 'Add Member'}</Button>
                    </div>
                )}
                {canAssign && canRemove && <hr className="my-6" />}
                {canRemove && (
                    <div className="space-y-2">
                        <InputField id="member-to-remove" placeholder="Enter Member ID to Remove" value={memberIdToRemove} onChange={(e) => setMemberIdToRemove(e.target.value)} />
                        <Button variant="destructive" onClick={handleRemoveMember} disabled={removeMemberMutation.isPending}>{removeMemberMutation.isPending ? 'Removing...' : 'Remove Member'}</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
