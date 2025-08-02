import React from 'react'
import { type Task } from '@/features/project/types/Task'
import { Dialog } from '@/components/ui/Dialog'
import { CheckCircle, Circle, Flag, Users, AlignLeft, Calendar } from 'lucide-react'

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

const getPriorityName = (value: number | string, options: readonly PriorityOption[]) => {
    return options.find(p => p.value === Number(value))?.name || 'Unknown'
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    isOpen,
    onClose,
    task,
    priorityOptions
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className="space-y-6">

                <div className="text-2xl font-bold text-gray-800 p-1 -ml-1">
                    {task.title}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <AlignLeft className="w-4 h-4" />
                        <span>Description</span>
                    </label>
                    <div className="w-full border border-gray-200 rounded p-2 h-24 text-gray-700 whitespace-pre-wrap">
                        {task.description || 'No description provided.'}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Status</h3>
                        <button className="w-full flex items-center gap-2 text-left bg-gray-100 p-2 rounded hover:bg-gray-200 transition">
                            {task.completed ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-gray-400" />}
                            <span>{task.completed ? 'Completed' : 'In Progress'}</span>
                        </button>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Priority</h3>
                        <div className="w-full flex items-center gap-2 bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200 transition">
                            <Flag className="w-5 h-5 text-gray-500" />
                            <span>{getPriorityName(task.priority, priorityOptions)}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Due Date</h3>
                        <div className="w-full flex items-center gap-2 bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200 transition">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Assignees</h3>
                        <button className="w-full flex items-center gap-2 text-left bg-gray-100 p-2 rounded hover:bg-gray-200 transition">
                            <Users className="w-5 h-5 text-gray-500" />
                            <span className="truncate">
                                {task.assignedMembers.length > 0
                                    ? task.assignedMembers.map(m => m.Username).join(', ')
                                    : 'Unassigned'}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="text-xs text-gray-400 text-right pt-4 border-t">
                    Created on {new Date(task.createdDate).toLocaleDateString()}
                </div>
            </div>
        </Dialog>
    )
}
