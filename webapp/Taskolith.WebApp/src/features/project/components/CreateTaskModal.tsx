import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useCreateTask } from '@/features/project/hooks/useCreateTask'
import { CreateTaskSchema } from '@/features/project/validators/CreateTaskScheme'
import { priorityOptions } from '@/features/project/types/Priority'
import { Dialog } from '@/components/ui/Dialog'

type CreateTaskFormValues = z.infer<typeof CreateTaskSchema>

interface CreateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    organisationId: string
    projectId: string
    kanbanColumnId: string
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    onClose,
    organisationId,
    projectId,
    kanbanColumnId,
}) => {
    const { mutate: createTask, isPending } = useCreateTask(
        organisationId,
        projectId,
        kanbanColumnId
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(CreateTaskSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 1,
            order: 1,
        },
    })

    const onSubmit = (data: CreateTaskFormValues) => {
        const requestData = {
            ...data,
            order: data.order || 1,
            dueDate: new Date(data.dueDate).toISOString()
        }

        createTask(requestData, {
            onSuccess: () => {
                reset()
                onClose()
            },
            onError: (error) => {
                console.error('Failed to create task:', error)
                alert(`Error: ${error.message}`)
            },
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <h2 className="text-xl font-bold">Add New Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        type="text"
                        {...register('title')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        id="dueDate"
                        type="date"
                        {...register('dueDate')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                        id="priority"
                        {...register('priority', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                        {priorityOptions.map(option => (
                            <option key={option.name} value={option.value}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100">Cancel</button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isPending ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </form>
        </Dialog>
    )
}
