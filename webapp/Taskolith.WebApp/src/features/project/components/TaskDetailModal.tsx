import React, { useState, useEffect, useMemo } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router-dom'
import { type Task } from '@/features/project/types/Task'
import { UpdateTaskSchema, type UpdateTaskRequest } from '@/features/project/types/UpdateTaskSchema'

import { useUpdateTask } from '@/features/project/hooks/useUpdateTask'
import { useDeleteTask } from '@/features/project/hooks/useDeleteTask'
import { useGetProjectMembers } from '@/features/project/hooks/useGetProjectMembers'
import { type ProjectMember } from '@/features/project/types/ProjectMember'
import { useAssignTaskToMembers } from '@/features/project/hooks/useAssignTaskToMembers'
import { useRemoveTaskMember } from '@/features/project/hooks/useRemoveTaskMember'
import { useGetTaskMembers } from '@/features/project/hooks/useGetTaskMembers'

import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { NotificationModal, type Notification } from '@/components/ui/NotificationModal'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'
import { Switch } from '@/components/ui/Switch'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { AlignLeft, Trash2, Pencil, Search, Users, UserPlus, FileText } from 'lucide-react'

interface PriorityOption {
    name: string
    value: number
}

interface TaskDetailModalProps {
    isOpen: boolean
    onClose: () => void
    task: Task
    priorityOptions: readonly PriorityOption[]
}

type ActiveTab = 'details' | 'assignments'
type AssigneeTab = 'view' | 'assign'

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task, priorityOptions }) => {
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()

    const [isTitleEditing, setIsTitleEditing] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [notification, setNotification] = useState<Notification>({ open: false, variant: 'success', title: '', description: '' })
    const [activeTab, setActiveTab] = useState<ActiveTab>('details')

    const { data: liveTaskMembers } = useGetTaskMembers(organisationId, projectId, task?.taskId)
    const { data: allProjectMembers, isLoading: isLoadingProjectMembers } = useGetProjectMembers(organisationId, projectId)

    const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask(organisationId!, projectId!)
    const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask(organisationId!, projectId!)
    const { mutateAsync: assignMembers, isPending: isAssigning } = useAssignTaskToMembers(organisationId!, projectId!)
    const { mutateAsync: removeMember, isPending: isRemoving } = useRemoveTaskMember(organisationId!, projectId!)

    const { register, handleSubmit, reset, formState: { errors, isDirty, dirtyFields }, control, getValues } = useForm<UpdateTaskRequest>({
        resolver: zodResolver(UpdateTaskSchema)
    })

    useEffect(() => {
        if (isOpen) {
            setActiveTab('details')
            setIsTitleEditing(false)
        }
    }, [isOpen])

    useEffect(() => {
        const currentMembers = liveTaskMembers || task.assignedMembers || [];

        if (isOpen) {
            reset({
                title: task.title,
                description: task.description || '',
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                priority: task.priority,
                isCompleted: task.completed,
                assignedMembers: currentMembers.map(m => m.memberId)
            })
        }
    }, [isOpen, liveTaskMembers, reset, task])


    const onSubmit = async (data: UpdateTaskRequest) => {
        const promises = []

        const taskDetailFields: (keyof UpdateTaskRequest)[] = ['title', 'description', 'dueDate', 'priority', 'isCompleted']
        const hasTaskDetailChanges = taskDetailFields.some(field => dirtyFields[field])

        if (hasTaskDetailChanges) {
            const taskDataPayload = {
                title: data.title,
                description: data.description,
                dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : new Date().toISOString(),
                priority: data.priority,
                isCompleted: data.isCompleted,
            }
            promises.push(updateTask({ taskId: task.taskId, columnId: task.kanbanColumnId, request: taskDataPayload }))
        }

        if (dirtyFields.assignedMembers) {
            const originalMembers = liveTaskMembers || task.assignedMembers || [];
            const originalMemberIds = new Set(originalMembers.map(m => m.memberId));
            const newMemberIds = new Set(data.assignedMembers || [])

            const membersToRemove = [...originalMemberIds].filter(id => !newMemberIds.has(id))
            membersToRemove.forEach(memberId => {
                promises.push(removeMember({ taskId: task.taskId, memberId }))
            })

            const membersToAdd = [...newMemberIds].filter(id => !originalMemberIds.has(id))
            if (membersToAdd.length > 0) {
                promises.push(assignMembers({ taskId: task.taskId, request: { memberIds: membersToAdd } }))
            }
        }

        if (promises.length === 0) return

        try {
            await Promise.all(promises)
            setNotification({ open: true, variant: 'success', title: 'Task Updated', description: 'Your changes have been saved successfully.' })
        } catch (error: any) {
            setNotification({ open: true, variant: 'error', title: 'Update Failed', description: error.message || 'An unexpected error occurred.' })
        }
    }

    const handleConfirmDelete = () => {
        deleteTask({ columnId: task.kanbanColumnId, taskId: task.taskId }, {
            onSuccess: () => {
                setNotification({ open: true, variant: 'success', title: 'Task Deleted', description: 'The task has been permanently removed.' })
                onClose()
            },
            onError: (error) => setNotification({ open: true, variant: 'error', title: 'Deletion Failed', description: error.message }),
            onSettled: () => setDeleteModalOpen(false)
        })
    }

    const isProcessing = isUpdating || isAssigning || isRemoving;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose} className="max-w-4xl">
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[90vh]">
                        <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b flex-shrink-0">
                            <div className="flex-1">
                                {isTitleEditing ? (
                                    <input
                                        {...register('title')}
                                        className="text-2xl font-bold text-gray-800 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md py-1 px-2"
                                        onBlur={() => setIsTitleEditing(false)}
                                        autoFocus
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-bold text-gray-800 break-words">{getValues('title')}</h2>
                                        <button type="button" onClick={() => setIsTitleEditing(true)} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                            </div>
                            <button type="button" onClick={() => setDeleteModalOpen(true)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="border-b border-gray-200 mb-6 flex-shrink-0">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button type="button" onClick={() => setActiveTab('details')} className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    <FileText size={16} /> Details
                                </button>
                                <button type="button" onClick={() => setActiveTab('assignments')} className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    <Users size={16} /> Assignments
                                </button>
                            </nav>
                        </div>

                        <div className="flex-grow overflow-y-auto px-2 pb-2">
                            {activeTab === 'details' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                                            <AlignLeft className="w-4 h-4" />Description
                                        </label>
                                        <textarea id="description" {...register('description')} rows={15} className="w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>
                                    <div className="md:col-span-1 space-y-6 mt-6 md:mt-0">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Status</h3>
                                            <Controller name="isCompleted" control={control} render={({ field }) => (
                                                <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-md">
                                                    <Switch id="task-status" checked={field.value ?? false} onCheckedChange={field.onChange} />
                                                    <label htmlFor="task-status" className="font-medium text-sm">{field.value ? 'Completed' : 'In Progress'}</label>
                                                </div>
                                            )} />
                                        </div>
                                        <div>
                                            <label htmlFor="priority-detail" className="text-sm font-semibold text-gray-600 mb-2 block">Priority</label>
                                            <select id="priority-detail" {...register('priority', { valueAsNumber: true })} className="w-full block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3">
                                                {priorityOptions.map(option => (<option key={option.name} value={option.value}>{option.name}</option>))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="dueDate-detail" className="text-sm font-semibold text-gray-600 mb-2 block">Due Date</label>
                                            <input id="dueDate-detail" type="date" {...register('dueDate')} className="w-full block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'assignments' && (
                                <div>
                                    <AssigneesManager allMembers={allProjectMembers} isLoading={isLoadingProjectMembers} control={control} register={register} />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center gap-4 pt-4 mt-4 border-t flex-shrink-0">
                            <span className="text-xs text-gray-400">Created on {new Date(task.createdDate).toLocaleDateString()}</span>
                            <div className="flex items-center gap-3">
                                <Button type="button" variant="outline" onClick={onClose}>Close</Button>
                                <Button type="submit" disabled={!isDirty || isProcessing}>
                                    {isProcessing ? <LoadingSpinner /> : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteConfirmationModal open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={handleConfirmDelete} isDeleting={isDeleting} title="Delete Task" description="Are you sure you want to delete this task? This action cannot be undone." />

            <NotificationModal
                open={notification.open}
                onOpenChange={() => setNotification({ ...notification, open: false })}
                variant={notification.variant}
                title={notification.title}
                description={notification.description}
            />
        </>
    )
}

const AssigneesManager = ({ allMembers, isLoading, control, register }: any) => {
    const [activeTab, setActiveTab] = useState<AssigneeTab>('view')
    const [searchQuery, setSearchQuery] = useState('')
    const assignedMemberIds = useWatch({ control, name: 'assignedMembers' }) || []
    const assignedIdsSet = useMemo(() => new Set(assignedMemberIds), [assignedMemberIds])

    const { assigned, unassigned } = useMemo(() => {
        if (!allMembers) return { assigned: [], unassigned: [] }
        const assignedList: ProjectMember[] = []
        const unassignedList: ProjectMember[] = []
        for (const member of allMembers) {
            if (assignedIdsSet.has(member.memberId)) {
                assignedList.push(member)
            } else {
                unassignedList.push(member)
            }
        }
        return { assigned: assignedList, unassigned: unassignedList }
    }, [allMembers, assignedIdsSet])

    const displayedMembers = useMemo(() => {
        const listToFilter = activeTab === 'view' ? assigned : unassigned
        if (!searchQuery) return listToFilter
        return listToFilter.filter(m => m.username.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [searchQuery, assigned, unassigned, activeTab])

    useEffect(() => {
        setSearchQuery('')
    }, [activeTab])

    return (
        <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Manage Assignees</label>
            <div className="flex items-center rounded-lg bg-gray-100 p-1 text-sm mb-2">
                <button type="button" onClick={() => setActiveTab('view')} className={`flex-1 flex items-center justify-center gap-2 px-2 py-1 rounded-md transition-colors ${activeTab === 'view' ? 'bg-white shadow font-semibold' : 'hover:bg-gray-200'}`}>
                    <Users size={14} /> Assigned ({assigned.length})
                </button>
                <button type="button" onClick={() => setActiveTab('assign')} className={`flex-1 flex items-center justify-center gap-2 px-2 py-1 rounded-md transition-colors ${activeTab === 'assign' ? 'bg-white shadow font-semibold' : 'hover:bg-gray-200'}`}>
                    <UserPlus size={14} /> Assign New
                </button>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Search members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="mt-2 p-2 border border-gray-200 bg-white rounded-md max-h-56 overflow-y-auto space-y-2">
                {isLoading ? <LoadingSpinner /> : displayedMembers.length > 0 ? (
                    displayedMembers.map((member: ProjectMember) => (
                        <div key={member.memberId} className="flex items-center">
                            <input
                                id={`detail-member-${member.memberId}`}
                                type="checkbox"
                                value={member.memberId}
                                {...register('assignedMembers')}
                                defaultChecked={assignedIdsSet.has(member.memberId)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`detail-member-${member.memberId}`} className="ml-3 block text-sm text-gray-900">{member.username}</label>
                        </div>
                    ))
                ) : <p className="text-sm text-gray-500 text-center py-2">{activeTab === 'view' ? 'No members assigned.' : 'No available members.'}</p>}
            </div>
        </div>
    )
}
