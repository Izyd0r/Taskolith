import React, { useState, useMemo } from 'react'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useMembers'
import { useAssignProjectMembers } from '@/features/project/hooks/useAssignProjectMembers'
import { type ProjectMember } from '@/features/project/types/ProjectMember'
import { Modal, ModalBody, ModalHeader } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface AddMembersModalProps {
    isOpen: boolean
    onClose: () => void
    organisationId: string
    projectId: string
    currentProjectMembers: ProjectMember[]
}

export const AddMembersModal: React.FC<AddMembersModalProps> = ({ isOpen, onClose, organisationId, projectId, currentProjectMembers }) => {
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set())
    const { data: orgMembers, isLoading: isLoadingOrgMembers } = useGetMembersInsideOrganisation(organisationId)
    const { mutate: assignMembers, isPending } = useAssignProjectMembers(organisationId, projectId)

    const projectMemberUserIds = useMemo(() =>
        new Set(currentProjectMembers.map(pm => pm.userId))
        , [currentProjectMembers])

    const assignableMembers = useMemo(() =>
        orgMembers?.filter(om => !projectMemberUserIds.has(om.userId)) || []
        , [orgMembers, projectMemberUserIds])

    const handleToggleMember = (memberId: string) => {
        const newSelection = new Set(selectedMemberIds)
        if (newSelection.has(memberId)) {
            newSelection.delete(memberId)
        } else {
            newSelection.add(memberId)
        }
        setSelectedMemberIds(newSelection)
    }

    const handleSave = () => {
        assignMembers({ membersId: Array.from(selectedMemberIds) }, {
            onSuccess: () => {
                setSelectedMemberIds(new Set())
                onClose()
            }
        })
    }

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalHeader title="Add Members to Project" description="Select members from the organisation to add to this project." />
            <ModalBody>
                <div className="max-h-80 overflow-y-auto rounded-lg border p-2 space-y-2">
                    {isLoadingOrgMembers ? <LoadingSpinner /> : assignableMembers.length > 0 ? (
                        assignableMembers.map(member => (
                            <div key={member.memberId} className="flex items-center rounded-md p-2 hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    id={`assign-member-${member.memberId}`}
                                    checked={selectedMemberIds.has(member.memberId)}
                                    onChange={() => handleToggleMember(member.memberId)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`assign-member-${member.memberId}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {member.username} <span className="text-gray-500">({member.email})</span>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500 py-4">All organisation members are already in this project.</p>
                    )}
                </div>
                <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isPending || selectedMemberIds.size === 0}>
                        {isPending ? 'Adding...' : `Add ${selectedMemberIds.size} Member(s)`}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )
}
