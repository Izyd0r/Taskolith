import React from 'react'
import { type Task } from '@/features/project/types/Task'
import { Clock, MessageSquare } from 'lucide-react'

interface TaskCardProps {
    task: Task
    onClick: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
    const hasDescription = task.description && task.description.trim().length > 0

    const formattedDueDate = new Date(task.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    })

    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-800 shadow-sm cursor-pointer transition-colors duration-150 hover:bg-gray-50 hover:border-blue-500"
        >
            <p className="font-medium text-gray-900">{task.title}</p>

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                {hasDescription && (
                    <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formattedDueDate}</span>
                </div>
            </div>
        </div>
    )
}
