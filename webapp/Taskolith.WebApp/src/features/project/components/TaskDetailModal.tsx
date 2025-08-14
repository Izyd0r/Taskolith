import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router-dom'
import { type Task } from '@/features/project/types/Task'
import { Dialog } from '@/components/ui/Dialog'
import { Users, AlignLeft, Calendar, Trash2 } from 'lucide-react'
import { UpdateTaskSchema, type UpdateTaskRequest } from '@/features/project/types/UpdateTaskSchema'
import { useUpdateTask } from '@/features/project/hooks/useUpdateTask'
import { useDeleteTask } from '@/features/project/hooks/useDeleteTask'

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

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task, priorityOptions }) => {
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()

    const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(organisationId!, projectId!)
    const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask(organisationId!, projectId!)

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<UpdateTaskRequest>({
        resolver: zodResolver(UpdateTaskSchema)
    })

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description || '',
                dueDate: task.dueDate.split('T')[0],
                priority: task.priority,
                isCompleted: task.completed
            })
        }
    }, [task, reset])

    const onSubmit = (data: UpdateTaskRequest) => {
        const requestData: UpdateTaskRequest = {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        }
        updateTask({ taskId: task.taskId, columnId: task.kanbanColumnId, request: requestData }, {
            onSuccess: () => reset(data)
        })
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask({ columnId: task.kanbanColumnId, taskId: task.taskId }, {
                onSuccess: onClose
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-between items-center gap-4">
                    <input
                        {...register('title')}
                        className="text-2xl font-bold text-gray-800 p-1 -ml-1 w-full border-transparent focus:border-gray-300 focus:ring-0 rounded"
                    />
                    <button type="button" onClick={handleDelete} disabled={isDeleting} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full">
                        {isDeleting ? '...' : <Trash2 className="w-5 h-5" />}
                    </button>
                </div>
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}

                <div>
                    <label htmlFor="description" className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2"><AlignLeft className="w-4 h-4" />Description</label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={3}
                        className="w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Status</h3>
                        <select
                            {...register('isCompleted', { setValueAs: (v) => v === 'true' })}
                            className="w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="false">In Progress</option>
                            <option value="true">Completed</option>
                        </select>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Priority</h3>
                        <select
                            {...register('priority', { valueAsNumber: true })}
                            className="w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            {priorityOptions.map(option => (
                                <option key={option.name} value={option.value}>{option.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Due Date</h3>
                        <input
                            type="date"
                            {...register('dueDate')}
                            className="w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Assignees</h3>
                        <div className="w-full flex items-center gap-2 text-left bg-gray-100 p-2.5 rounded-md text-sm border">
                            <Users className="w-5 h-5 text-gray-500" />
                            <span className="truncate">
                                {task.assignedMembers.length > 0 ? task.assignedMembers.map(m => m.username).join(', ') : 'Unassigned'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4 pt-4 border-t">
                    <span className="text-xs text-gray-400">
                        Created on {new Date(task.createdDate).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={onClose} className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100">Close</button>
                        <button
                            type="submit"
                            disabled={!isDirty || isUpdating}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </Dialog>
    )
}
