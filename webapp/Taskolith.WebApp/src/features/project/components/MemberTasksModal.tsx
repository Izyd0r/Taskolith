import React, { useState, useMemo } from 'react'
import { type ProjectMember } from '@/features/project/types/ProjectMember'
import { type Task } from '@/features/project/types/Task'
import { useAssignTaskToMembers } from '@/features/project/hooks/useAssignTaskToMembers'
import { useRemoveTaskMember } from '@/features/project/hooks/useRemoveTaskMember'

import { Modal, ModalBody, ModalHeader } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { type Notification } from '@/components/ui/NotificationModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface MemberTasksModalProps {
    isOpen: boolean
    onClose: () => void
    member: ProjectMember | null
    allProjectTasks: Task[]
    organisationId: string
    projectId: string
    setNotification: (notification: Notification) => void
}

export const MemberTasksModal: React.FC<MemberTasksModalProps> = ({
    isOpen, onClose, member, allProjectTasks, organisationId, projectId, setNotification
}) => {
    const initialTaskIds = useMemo(() => {
        if (!member) return new Set<string>()
        return new Set(
            allProjectTasks
                .filter(task => task.assignedMembers.some(am => am.userId === member.userId))
                .map(task => task.taskId)
        )
    }, [member, allProjectTasks])

    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(initialTaskIds)

    React.useEffect(() => {
        if (isOpen) {
            setSelectedTaskIds(initialTaskIds)
        }
    }, [isOpen, initialTaskIds])

    const { mutateAsync: assignMemberToTask, isPending: isAssigning } = useAssignTaskToMembers(organisationId, projectId)
    const { mutateAsync: removeMemberFromTask, isPending: isRemoving } = useRemoveTaskMember(organisationId, projectId)

    const handleToggleTask = (taskId: string) => {
        const newSelection = new Set(selectedTaskIds)
        if (newSelection.has(taskId)) {
            newSelection.delete(taskId)
        } else {
            newSelection.add(taskId)
        }
        setSelectedTaskIds(newSelection)
    }

    const handleSave = async () => {
        if (!member) return

        const tasksToAssign = [...selectedTaskIds].filter(id => !initialTaskIds.has(id))
        const tasksToRemove = [...initialTaskIds].filter(id => !selectedTaskIds.has(id))

        const promises = []

        tasksToAssign.forEach(taskId => {
            promises.push(assignMemberToTask({ taskId, request: { memberIds: [member.memberId] } }))
        })

        tasksToRemove.forEach(taskId => {
            promises.push(removeMemberFromTask({ taskId, memberId: member.memberId }))
        })

        if (promises.length === 0) {
            onClose()
            return
        }

        try {
            await Promise.all(promises)
            setNotification({ open: true, variant: 'success', title: 'Tasks Updated', description: `Assignments for ${member.username} have been saved.` })
            onClose()
        } catch (error: any) {
            setNotification({ open: true, variant: 'error', title: 'Update Failed', description: error.message || 'An error occurred.' })
        }
    }

    const isProcessing = isAssigning || isRemoving

    if (!member) return null

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalHeader title={`Manage Tasks for ${member.username}`} description="Select the tasks assigned to this member." />
            <ModalBody>
                <div className="max-h-80 overflow-y-auto rounded-lg border p-2 space-y-2">
                    {allProjectTasks.length > 0 ? (
                        allProjectTasks.map(task => (
                            <div key={task.taskId} className="flex items-center rounded-md p-2 hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    id={`task-assign-${task.taskId}`}
                                    checked={selectedTaskIds.has(task.taskId)}
                                    onChange={() => handleToggleTask(task.taskId)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`task-assign-${task.taskId}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {task.title}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500 py-4">There are no tasks in this project.</p>
                    )}
                </div>
                <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isProcessing}>
                        {isProcessing ? (
                            <>
                                <LoadingSpinner />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )
}
