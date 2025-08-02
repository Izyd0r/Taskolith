import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetKanbanColumns } from '@/features/project/hooks/useGetKanbanColumns'
import { useCreateKanbanColumn } from '@/features/project/hooks/useCreateKanbanColumn'
import { CreateTaskModal } from '@/features/project/components/CreateTaskModal'
import { TaskDetailModal } from '@/features/project/components/TaskDetailModal'
import { TaskCard } from '@/features/project/components/TaskCard'
import { type Task } from '@/features/project/types/Task'
import { Menu, MenuButton, MenuItems, MenuItem } from '@/components/ui/Menu'
import { MoreHorizontal } from 'lucide-react'
import { priorityOptions } from '@/features/project/types/Priority'

const Kanban: React.FC = () => {
    const { organisationId, projectId } = useParams()

    const { data: columns = [], refetch: refetchColumns } = useGetKanbanColumns(organisationId!, projectId!)

    const { mutate: createColumn } = useCreateKanbanColumn(organisationId!, projectId!)

    const [isAddingColumn, setIsAddingColumn] = useState(false)
    const [newColumnTitle, setNewColumnTitle] = useState('')

    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null)

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const handleAddColumn = () => {
        if (!newColumnTitle.trim()) return
        createColumn({ name: newColumnTitle }, {
            onSuccess: () => {
                setNewColumnTitle('')
                setIsAddingColumn(false)
                refetchColumns()
            }
        })
    }

    const handleOpenCreateTaskModal = (columnId: string) => {
        setSelectedColumnId(columnId)
        setIsCreateTaskModalOpen(true)
    }

    const handleCloseCreateTaskModal = () => {
        setIsCreateTaskModalOpen(false)
        setSelectedColumnId(null)
        refetchColumns()
    }

    const handleOpenDetailModal = (task: Task) => {
        setSelectedTask(task)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false)
        setSelectedTask(null)
    }

    const handleRenameColumn = (columnId: string) => {
        const newName = prompt('Rename column to:')
        if (newName) {
            // TODO: Implement rename column mutation.
            console.log(`Rename column ${columnId} to ${newName}`)
        }
    }

    const handleDeleteColumn = (columnId: string) => {
        if (confirm('Are you sure you want to delete this column? This action cannot be undone.')) {
            // TODO: Implement delete column mutation.
            console.log(`Delete column ${columnId}`)
        }
    }

    return (
        <div className="p-6 h-full flex flex-col bg-slate-100">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex-shrink-0">Kanban Board</h1>

            <div className="flex gap-6 overflow-x-auto items-start flex-grow pb-4">

                {columns.map((column) => (
                    <div
                        key={column.columnId}
                        className="bg-white rounded-xl p-4 w-[300px] flex-shrink-0 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-4 px-1 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-700">{column.columnName}</h2>
                            <Menu>
                                <MenuButton className="p-1 rounded hover:bg-gray-200">
                                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                </MenuButton>
                                <MenuItems className="absolute right-3 top-10 z-10 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg text-sm py-1">
                                    <MenuItem onClick={() => handleOpenCreateTaskModal(column.columnId)}>
                                        {({ active }) => <div className={`px-4 py-2 ${active ? 'bg-gray-100' : ''} cursor-pointer`}>Add Task</div>}
                                    </MenuItem>
                                    <MenuItem onClick={() => handleRenameColumn(column.columnId)}>
                                        {({ active }) => <div className={`px-4 py-2 ${active ? 'bg-gray-100' : ''} cursor-pointer`}>Rename</div>}
                                    </MenuItem>
                                    <MenuItem onClick={() => handleDeleteColumn(column.columnId)}>
                                        {({ active }) => <div className={`px-4 py-2 text-red-600 ${active ? 'bg-gray-100' : ''} cursor-pointer`}>Delete</div>}
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>

                        <div className="space-y-3 overflow-y-auto">
                            {column.tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={() => handleOpenDetailModal(task)}
                                />
                            ))}
                        </div>

                        <button onClick={() => handleOpenCreateTaskModal(column.columnId)} className="mt-4 pt-2 block text-sm text-blue-600 hover:underline px-1 text-left flex-shrink-0">
                            + Add Task
                        </button>
                    </div>
                ))}

                <div className="w-[300px] flex-shrink-0">
                    {isAddingColumn ? (
                        <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-dashed border-gray-300">
                            <input
                                type="text"
                                autoFocus
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                                placeholder="Enter column name..."
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsAddingColumn(false)} className="text-sm text-gray-500 hover:underline px-3 py-1">
                                    Cancel
                                </button>
                                <button onClick={handleAddColumn} className="text-sm text-blue-600 font-medium hover:underline px-3 py-1">
                                    Add Column
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingColumn(true)}
                            className="w-full h-full text-left text-blue-600 hover:bg-blue-50 border-2 border-dashed border-gray-300 rounded-xl p-5 transition"
                        >
                            + Add another column
                        </button>
                    )}
                </div>
            </div>

            {selectedColumnId && (
                <CreateTaskModal
                    isOpen={isCreateTaskModalOpen}
                    onClose={handleCloseCreateTaskModal}
                    organisationId={organisationId!}
                    projectId={projectId!}
                    kanbanColumnId={selectedColumnId}
                />
            )}

            {selectedTask && (
                <TaskDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    task={selectedTask}
                    priorityOptions={priorityOptions}
                />
            )}
        </div>
    )
}

export default Kanban
