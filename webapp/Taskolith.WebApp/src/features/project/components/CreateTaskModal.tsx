import React, { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Search, FileText, Settings2 } from 'lucide-react'

import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useCreateTask } from '@/features/project/hooks/useCreateTask'
import { CreateTaskSchema } from '@/features/project/validators/CreateTaskScheme'
import { priorityOptions } from '@/features/project/types/Priority'
import { useGetProjectMembers } from '@/features/project/hooks/useGetProjectMembers'
import { type ProjectMember } from '@/features/project/types/ProjectMember'

import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { NotificationModal, type Notification } from '@/components/ui/NotificationModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

type CreateTaskFormValues = z.infer<typeof CreateTaskSchema>
type ActiveTab = 'details' | 'assignments'

interface CreateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    organisationId: string
    projectId: string
    kanbanColumnId: string
}

const DesktopLayout = ({ register, errors, filteredMembers, isLoadingMembers, memberSearchQuery, setMemberSearchQuery }: any) => (
    <div className="flex flex-row space-x-6">
        <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    id="title"
                    type="text"
                    {...register('title')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    {...register('description')}
                    rows={12}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
        </div>

        <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        id="dueDate"
                        type="date"
                        {...register('dueDate')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                    />
                    {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                        id="priority"
                        {...register('priority', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                    >
                        {priorityOptions.map((option) => (
                            <option key={option.name} value={option.value}>{option.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Assign Members</label>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div className="mt-2 p-3 border border-gray-200 bg-white rounded-md max-h-48 overflow-y-auto space-y-2">
                    {isLoadingMembers ? <LoadingSpinner /> : filteredMembers.map((member: ProjectMember) => (
                        <div key={member.memberId} className="flex items-center">
                            <input
                                id={`member-desktop-${member.memberId}`}
                                type="checkbox"
                                value={member.memberId}
                                {...register('assignedMembers')}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`member-desktop-${member.memberId}`} className="ml-3 block text-sm text-gray-900">{member.username}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

const MobileLayout = ({ register, errors, filteredMembers, isLoadingMembers, memberSearchQuery, setMemberSearchQuery, activeTab, setActiveTab }: any) => (
    <>
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <FileText size={16} /> Details
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('assignments')}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <Settings2 size={16} /> Assignments & Options
                </button>
            </nav>
        </div>
        <div className="space-y-4">
            {activeTab === 'details' && (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title-mobile" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            id="title-mobile"
                            type="text"
                            {...register('title')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description-mobile" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description-mobile"
                            {...register('description')}
                            rows={12}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
            )}
            {activeTab === 'assignments' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dueDate-mobile" className="block text-sm font-medium text-gray-700">Due Date</label>
                            <input
                                id="dueDate-mobile"
                                type="date"
                                {...register('dueDate')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            />
                            {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="priority-mobile" className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                id="priority-mobile"
                                {...register('priority', { valueAsNumber: true })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            >
                                {priorityOptions.map((option) => (
                                    <option key={option.name} value={option.value}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assign Members</label>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={memberSearchQuery}
                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="mt-2 p-3 border border-gray-200 bg-white rounded-md max-h-48 overflow-y-auto space-y-2">
                            {isLoadingMembers ? <LoadingSpinner /> : filteredMembers.map((member: ProjectMember) => (
                                <div key={member.memberId} className="flex items-center">
                                    <input
                                        id={`member-mobile-${member.memberId}`}
                                        type="checkbox"
                                        value={member.memberId}
                                        {...register('assignedMembers')}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`member-mobile-${member.memberId}`} className="ml-3 block text-sm text-gray-900">{member.username}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
)

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, organisationId, projectId, kanbanColumnId }) => {
    const isDesktop = useBreakpoint()
    const [notification, setNotification] = useState<Notification>({ open: false, variant: 'success', title: '', description: '' })
    const [memberSearchQuery, setMemberSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<ActiveTab>('details')

    const { data: members, isLoading: isLoadingMembers } = useGetProjectMembers(organisationId, projectId)
    const { mutate: createTask, isPending } = useCreateTask(organisationId, projectId)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(CreateTaskSchema),
        defaultValues: { title: '', description: '', priority: 1, order: 1, assignedMembers: [] },
    })

    const filteredMembers = useMemo(() => {
        if (!members) return []
        if (!memberSearchQuery) return members
        return members.filter((member) => member.username.toLowerCase().includes(memberSearchQuery.toLowerCase()))
    }, [members, memberSearchQuery])

    useEffect(() => {
        if (isOpen) {
            reset()
            setMemberSearchQuery('')
            setActiveTab('details')
        }
    }, [isOpen, reset])

    const onSubmit = (data: CreateTaskFormValues) => {
        const requestData = {
            title: data.title,
            description: data.description,
            priority: data.priority,
            order: data.order || 1,
            dueDate: new Date(data.dueDate).toISOString(),
            assignedMembers: data.assignedMembers || [],
        }

        createTask(
            { kanbanColumnId, request: requestData },
            {
                onSuccess: () => {
                    reset()
                    onClose()
                    setNotification({ open: true, variant: 'success', title: 'Task Created', description: 'The new task has been added successfully.' })
                },
                onError: (error: any) => {
                    setNotification({ open: true, variant: 'error', title: 'Creation Failed', description: error.message || 'An unexpected error occurred.' })
                },
            }
        )
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose} className={isDesktop ? 'max-w-4xl' : 'max-w-lg'}>
                <DialogContent>
                    <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
                    <p className="text-sm text-gray-500 mb-6">Fill in the details below to create a new task.</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {isDesktop ? (
                            <DesktopLayout {...{ register, errors, filteredMembers, isLoadingMembers, memberSearchQuery, setMemberSearchQuery }} />
                        ) : (
                            <MobileLayout {...{ register, errors, filteredMembers, isLoadingMembers, memberSearchQuery, setMemberSearchQuery, activeTab, setActiveTab }} />
                        )}

                        <div className="flex justify-end gap-3 pt-6">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create Task'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

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
