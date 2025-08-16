import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGetKanbanColumns } from '@/features/project/hooks/useGetKanbanColumns'
import { useCreateKanbanColumn } from '@/features/project/hooks/useCreateKanbanColumn'
import { useUpdateKanbanColumn } from '@/features/project/hooks/useUpdateKanbanColumn'
import { useDeleteKanbanColumn } from '@/features/project/hooks/useDeleteKanbanColumn'
import { CreateTaskModal } from '@/features/project/components/CreateTaskModal'
import { TaskDetailModal } from '@/features/project/components/TaskDetailModal'
import { TaskCard } from '@/features/project/components/TaskCard'
import { type Task } from '@/features/project/types/Task'
import { Menu, MenuButton, MenuItems, MenuItem } from '@/components/ui/Menu'
import { MoreHorizontal } from 'lucide-react'
import { priorityOptions } from '@/features/project/types/Priority'

const Kanban: React.FC = () => {
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()

    const { data: rawColumns = [], refetch: refetchColumns } = useGetKanbanColumns(organisationId!, projectId!)
    const { mutate: createColumn } = useCreateKanbanColumn(organisationId!, projectId!)
    const { mutate: updateColumn } = useUpdateKanbanColumn(organisationId!, projectId!)
    const { mutate: deleteColumn } = useDeleteKanbanColumn(organisationId!, projectId!)

    const columns = useMemo(() => {
        return rawColumns.map(column => ({
            ...column,
            tasks: column.tasks.map(task => ({
                ...task,
                kanbanColumnId: column.columnId
            }))
        }))
    }, [rawColumns])

    const [isAddingColumn, setIsAddingColumn] = useState(false)
    const [newColumnTitle, setNewColumnTitle] = useState('')
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
    const [updatedColumnName, setUpdatedColumnName] = useState('')
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

    const handleUpdateColumnName = () => {
        if (!editingColumnId) return
        updateColumn({ kanbanColumnId: editingColumnId, request: { name: updatedColumnName } }, {
            onSuccess: () => {
                setEditingColumnId(null)
                setUpdatedColumnName('')
                refetchColumns()
            },
            onError: () => {
                setEditingColumnId(null)
            }
        })
    }

    const handleDeleteColumn = (columnId: string) => {
        if (window.confirm('Are you sure you want to delete this column? All tasks within it will also be removed.')) {
            deleteColumn(columnId, {
                onSuccess: () => {
                    refetchColumns()
                }
            })
        }
    }

    const startEditing = (columnId: string, currentName: string) => {
        setEditingColumnId(columnId)
        setUpdatedColumnName(currentName)
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
        refetchColumns()
    }

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (editingColumnId && !(event.target as HTMLElement).closest('.column-header-input')) {
                handleUpdateColumnName()
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [editingColumnId, updatedColumnName])

    return (
        <div className="p-6 h-full flex flex-col bg-slate-100">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex-shrink-0">Kanban Board</h1>
            <div className="flex gap-6 overflow-x-auto items-start flex-grow pb-4">
                {columns.map((column) => (
                    <div key={column.columnId} className="bg-white rounded-xl p-4 w-[300px] flex-shrink-0 flex flex-col">
                        <div className="flex justify-between items-center mb-4 px-1 flex-shrink-0">
                            {editingColumnId === column.columnId ? (
                                <input
                                    type="text"
                                    value={updatedColumnName}
                                    onChange={(e) => setUpdatedColumnName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdateColumnName()
                                        if (e.key === 'Escape') setEditingColumnId(null)
                                    }}
                                    onBlur={handleUpdateColumnName}
                                    className="w-full border-b-2 border-blue-500 focus:outline-none text-lg font-semibold column-header-input"
                                    autoFocus
                                />
                            ) : (
                                <h2 className="text-lg font-semibold text-gray-700">{column.columnName}</h2>
                            )}
                            <Menu>
                                <MenuButton className="p-1 rounded hover:bg-gray-200">
                                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                </MenuButton>
                                <MenuItems className="absolute right-3 top-10 z-10 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg text-sm py-1">
                                    <MenuItem onClick={() => handleOpenCreateTaskModal(column.columnId)}>
                                        {({ active }) => (
                                            <span className={`block w-full px-4 py-2 cursor-pointer ${active ? 'bg-gray-100' : ''}`}>
                                                Add Task
                                            </span>
                                        )}
                                    </MenuItem>
                                    <MenuItem onClick={() => startEditing(column.columnId, column.columnName)}>
                                        {({ active }) => (
                                            <span className={`block w-full px-4 py-2 cursor-pointer ${active ? 'bg-gray-100' : ''}`}>
                                                Edit Name
                                            </span>
                                        )}
                                    </MenuItem>
                                    <MenuItem onClick={() => handleDeleteColumn(column.columnId)}>
                                        {({ active }) => (
                                            <span className={`block w-full px-4 py-2 cursor-pointer ${active ? 'bg-gray-100' : ''} text-red-600`}>
                                                Delete Column
                                            </span>
                                        )}
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                        <div className="space-y-3 overflow-y-auto">
                            {column.tasks.map((task) => (
                                <TaskCard
                                    key={task.taskId}
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
