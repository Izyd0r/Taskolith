import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useGetKanbanColumns } from '@/features/project/hooks/useGetKanbanColumns'
import { useCreateKanbanColumn } from '@/features/project/hooks/useCreateKanbanColumn'
import { useUpdateKanbanColumn } from '@/features/project/hooks/useUpdateKanbanColumn'
import { useDeleteKanbanColumn } from '@/features/project/hooks/useDeleteKanbanColumn'
import { CreateTaskModal } from '@/features/project/components/CreateTaskModal'
import { TaskDetailModal } from '@/features/project/components/TaskDetailModal'
import { TaskCard } from '@/features/project/components/TaskCard'
import { type Task } from '@/features/project/types/Task'
import { Menu, MenuButton, MenuItems, MenuItem } from '@/components/ui/Menu'
import { MoreHorizontal, Edit2, PlusCircle } from 'lucide-react'
import { priorityOptions } from '@/features/project/types/Priority'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'

const Kanban: React.FC = () => {
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()
    const queryClient = useQueryClient()

    const { data: rawColumns = [], isLoading } = useGetKanbanColumns(organisationId!, projectId!)
    const { mutate: createColumn, isPending: isCreatingColumn } = useCreateKanbanColumn(organisationId!, projectId!)
    const { mutate: updateColumn, isPending: isUpdatingColumn } = useUpdateKanbanColumn(organisationId!, projectId!)
    const { mutate: deleteColumn, isPending: isDeletingColumn } = useDeleteKanbanColumn(organisationId!, projectId!)

    const columns = useMemo(() => {
        return rawColumns.map(column => ({
            ...column,
            tasks: column.tasks.map(task => ({
                ...task,
                kanbanColumnId: column.columnId,
            })),
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
    const [deletingColumnId, setDeletingColumnId] = useState<string | null>(null)

    const invalidateKanbanQuery = () => {
        queryClient.invalidateQueries({ queryKey: ['kanban-columns', organisationId, projectId] })
    }

    const handleAddColumn = () => {
        if (!newColumnTitle.trim()) return
        createColumn({ name: newColumnTitle }, {
            onSuccess: () => {
                setNewColumnTitle('')
                setIsAddingColumn(false)
            },
        })
    }

    const handleUpdateColumnName = () => {
        if (!editingColumnId || !updatedColumnName.trim()) {
            setEditingColumnId(null)
            return
        }
        updateColumn({ kanbanColumnId: editingColumnId, request: { name: updatedColumnName } }, {
            onSuccess: () => {
                setEditingColumnId(null)
                setUpdatedColumnName('')
            },
            onError: () => {
                setEditingColumnId(null)
            },
        })
    }

    const confirmDeleteColumn = () => {
        if (!deletingColumnId) return
        deleteColumn(deletingColumnId, {
            onSettled: () => {
                setDeletingColumnId(null)
            },
        })
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
        invalidateKanbanQuery()
    }

    const handleOpenDetailModal = (task: Task) => {
        setSelectedTask(task)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false)
        setSelectedTask(null)
        invalidateKanbanQuery()
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

    if (isLoading) {
        return <div className="flex h-full items-center justify-center"><LoadingSpinner /></div>
    }

    return (
        <div className="flex h-full flex-col bg-gray-50 p-6">
            <h1 className="flex-shrink-0 text-2xl font-bold mb-6">Kanban Board</h1>
            <div className="flex flex-grow items-start gap-6 overflow-x-auto pb-4">
                {columns.map((column, index) => (
                    <div key={column.columnId} className={`flex h-full w-[300px] flex-shrink-0 flex-col rounded-xl border border-gray-200 p-4 bg-white ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="mb-4 flex flex-shrink-0 items-center justify-between px-1">
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
                                    className="column-header-input w-full max-w-[220px] truncate border-b-2 border-blue-500 text-lg font-semibold focus:outline-none"
                                    autoFocus
                                    disabled={isUpdatingColumn}
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h2 className="max-w-[200px] truncate text-lg font-semibold" title={column.columnName}>
                                        {column.columnName}
                                    </h2>
                                    <button onClick={() => startEditing(column.columnId, column.columnName)} className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            )}
                            <Menu>
                                <MenuButton className="p-1 rounded hover:bg-gray-200"><MoreHorizontal className="h-5 w-5 text-gray-500" /></MenuButton>
                                <MenuItems className="absolute right-0 z-10 mt-2 w-40 rounded border border-gray-200 bg-white py-1 text-sm shadow-lg">
                                    <MenuItem>
                                        {({ active }) => <button onClick={() => handleOpenCreateTaskModal(column.columnId)} className={`flex w-full items-center gap-2 px-4 py-2 text-left ${active ? 'bg-gray-100' : ''}`}>Add Task</button>}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ active }) => <button onClick={() => setDeletingColumnId(column.columnId)} className={`flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 ${active ? 'bg-red-50' : ''}`}>Delete Column</button>}
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                        <div className="flex-grow space-y-3 overflow-y-auto">
                            {column.tasks.map((task) => (
                                <TaskCard key={task.taskId} task={task} onClick={() => handleOpenDetailModal(task)} />
                            ))}
                        </div>
                        <button onClick={() => handleOpenCreateTaskModal(column.columnId)} className="mt-4 block flex-shrink-0 px-1 text-left text-sm text-blue-600 hover:underline pt-2">+ Add Task</button>
                    </div>
                ))}
                <div className="w-[300px] flex-shrink-0">
                    {isAddingColumn ? (
                        <div className="w-full rounded-xl border border-dashed border-gray-300 bg-white p-4 shadow-sm">
                            <input
                                type="text"
                                autoFocus
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                                placeholder="Enter column name..."
                                className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setIsAddingColumn(false)}>Cancel</Button>
                                <Button size="sm" onClick={handleAddColumn} disabled={isCreatingColumn}>{isCreatingColumn ? 'Adding...' : 'Add Column'}</Button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setIsAddingColumn(true)} className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-5 text-left text-blue-600 transition hover:bg-blue-50">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add another column
                        </button>
                    )}
                </div>
            </div>
            {selectedColumnId && <CreateTaskModal isOpen={isCreateTaskModalOpen} onClose={handleCloseCreateTaskModal} organisationId={organisationId!} projectId={projectId!} kanbanColumnId={selectedColumnId} />}
            {selectedTask && <TaskDetailModal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} task={selectedTask} priorityOptions={priorityOptions} />}
            {deletingColumnId && <DeleteConfirmationModal open={!!deletingColumnId} onOpenChange={() => setDeletingColumnId(null)} onConfirm={confirmDeleteColumn} isDeleting={isDeletingColumn} title="Delete Column" description="Are you sure? All tasks in this column will be permanently deleted." />}
        </div>
    )
}

export default Kanban
