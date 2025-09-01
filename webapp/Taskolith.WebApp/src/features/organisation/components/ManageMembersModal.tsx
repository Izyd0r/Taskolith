import React, { useState, useMemo } from 'react'
import { useGetMembersInsideOrganisation } from '@/features/organisation/hooks/useMembers'
import { useAssignProjectMembers } from '@/features/project/hooks/useAssignProjectMembers'
import { useRemoveProjectMember } from '@/features/project/hooks/useRemoveProjectMember'
import { type ProjectMember } from '@/features/project/types/ProjectMember'

import { Modal, ModalBody, ModalHeader } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

type DisplayMember = {
    memberId: string
    username: string
    email: string
}

interface ManageProjectMembersModalProps {
    isOpen: boolean
    onClose: () => void
    organisationId: string
    projectId: string
    currentProjectMembers: ProjectMember[]
    isLoadingProjectMembers: boolean
}

type ActiveTab = 'add' | 'remove'

export const ManageMembersModal: React.FC<ManageProjectMembersModalProps> = ({
    isOpen,
    onClose,
    organisationId,
    projectId,
    currentProjectMembers = [],
    isLoadingProjectMembers
}) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('add')
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set())

    const { data: orgMembers, isLoading: isLoadingOrgMembers } = useGetMembersInsideOrganisation(organisationId)
    const { mutate: assignMembers, isPending: isAssigning } = useAssignProjectMembers(organisationId, projectId)
    const { mutate: removeMember, isPending: isRemoving } = useRemoveProjectMember(organisationId, projectId)

    const projectMemberUserIds = useMemo(() =>
        new Set(currentProjectMembers.map(pm => pm.userId))
        , [currentProjectMembers])

    const assignableMembers = useMemo(() =>
        orgMembers?.filter(om => !projectMemberUserIds.has(om.userId)) || []
        , [orgMembers, projectMemberUserIds])

    const handleToggleMember = (memberId: string) => {
        const newSelection = new Set(selectedMemberIds)
        if (newSelection.has(memberId)) newSelection.delete(memberId)
        else newSelection.add(memberId)
        setSelectedMemberIds(newSelection)
    }

    const handleTabChange = (tab: ActiveTab) => {
        setActiveTab(tab);
        setSelectedMemberIds(new Set());
    }

    const handleSaveChanges = () => {
        const memberIds = Array.from(selectedMemberIds)
        const onSettled = () => {
            setSelectedMemberIds(new Set())
            onClose()
        }

        if (activeTab === 'add') {
            assignMembers({ membersId: memberIds }, { onSettled })
        } else {
            Promise.all(memberIds.map(memberId => removeMember(memberId))).finally(onSettled)
        }
    }

    const isLoading = isLoadingOrgMembers || isLoadingProjectMembers
    const isPending = isAssigning || isRemoving

    const renderMemberList = (members: DisplayMember[]) => {
        if (members.length === 0) {
            const message = activeTab === 'add' ? "All members are already in this project." : "No members to remove."
            return <p className="text-center text-sm text-gray-500 py-4">{message}</p>
        }
        return members.map(member => (
            <div key={member.memberId} className="flex items-center rounded-md p-2 hover:bg-gray-100">
                <input
                    type="checkbox" id={`member-${member.memberId}`}
                    checked={selectedMemberIds.has(member.memberId)}
                    onChange={() => handleToggleMember(member.memberId)}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor={`member-${member.memberId}`} className="ml-3 block text-sm">
                    {member.username} <span className="text-gray-500">({member.email})</span>
                </label>
            </div>
        ))
    }

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalHeader title="Manage Project Members" />
            <ModalBody>
                <div className="flex border-b mb-4">
                    <button onClick={() => handleTabChange('add')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'add' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>
                        Add Members
                    </button>
                    <button onClick={() => handleTabChange('remove')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'remove' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>
                        Remove Members
                    </button>
                </div>

                <div className="max-h-80 min-h-[10rem] overflow-y-auto rounded-lg border p-2 space-y-2">
                    {isLoading ? <LoadingSpinner /> : renderMemberList(activeTab === 'add' ? assignableMembers : currentProjectMembers)}
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                    <Button variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleSaveChanges} disabled={isPending || selectedMemberIds.size === 0}>
                        {isPending ? 'Saving...' : `Confirm ${selectedMemberIds.size} Changes`}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )
}
