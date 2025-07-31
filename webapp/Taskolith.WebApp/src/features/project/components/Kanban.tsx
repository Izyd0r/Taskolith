import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetKanbanColumns } from '@/features/project/hooks/useGetKanbanColumns'
import { useCreateKanbanColumn } from '@/features/project/hooks/useCreateKanbanColumn'
import { Menu, MenuButton, MenuItems, MenuItem } from '@/components/ui/Menu'
import { MoreHorizontal } from 'lucide-react'

const Kanban: React.FC = () => {
    const { organisationId, projectId } = useParams()
    const { data: columns = [] } = useGetKanbanColumns(organisationId!, projectId!)
    const { mutate: createColumn } = useCreateKanbanColumn(organisationId!, projectId!)

    const [isAdding, setIsAdding] = useState(false)
    const [newColumnTitle, setNewColumnTitle] = useState('')

    const handleAddColumn = () => {
        if (!newColumnTitle.trim()) return
        createColumn({ name: newColumnTitle })
        setNewColumnTitle('')
        setIsAdding(false)
    }

    const handleRename = (columnId: string) => {
        const newName = prompt('Rename column to:')
        if (newName && newName.trim()) {
            // TODO: add useRenameKanbanColumn() mutation
            console.log(`Rename column ${columnId} to ${newName}`)
        }
    }

    const handleDelete = (columnId: string) => {
        if (confirm('Are you sure you want to delete this column?')) {
            // TODO: add useDeleteKanbanColumn() mutation
            console.log(`Delete column ${columnId}`)
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Kanban Board</h1>

            <div className="flex gap-6 overflow-x-auto pb-4 pr-4">
                {columns.map((column) => (
                    <div
                        key={column.columnId}
                        className="bg-white rounded-xl p-5 min-w-[280px] shadow-md border border-gray-200 flex-shrink-0 relative"
                    >
                        {/* Column Header with Menu */}
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">{column.columnName}</h2>

                            <Menu>
                                <MenuButton className="p-1 rounded hover:bg-gray-100">
                                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                </MenuButton>
                                <MenuItems className="absolute right-3 top-10 z-10 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg text-sm py-1">
                                    <MenuItem onClick={() => handleRename(column.columnId)}>
                                        {({ active }) => (
                                            <div
                                                className={`px-4 py-2 ${active ? 'bg-gray-100' : ''} cursor-pointer`}
                                            >
                                                Rename
                                            </div>
                                        )}
                                    </MenuItem>
                                    <MenuItem onClick={() => handleDelete(column.columnId)}>
                                        {({ active }) => (
                                            <div
                                                className={`px-4 py-2 text-red-600 ${active ? 'bg-gray-100' : ''} cursor-pointer`}
                                            >
                                                Delete
                                            </div>
                                        )}
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>

                        {/* Tasks */}
                        <div className="space-y-4">
                            {column.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm text-gray-800 shadow-sm"
                                >
                                    {task.title}
                                </div>
                            ))}
                        </div>

                        <button className="mt-6 block text-sm text-blue-600 hover:underline">
                            + Add Task
                        </button>
                    </div>
                ))}

                {/* Add Column UI */}
                <div className="min-w-[280px] flex items-start">
                    {isAdding ? (
                        <div className="w-full bg-white border border-dashed border-gray-300 rounded-xl p-5 shadow-sm">
                            <input
                                type="text"
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                placeholder="Column name"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddColumn}
                                    className="text-sm text-blue-600 font-medium hover:underline"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full h-full text-sm text-blue-600 hover:underline border-2 border-dashed border-gray-300 rounded-xl p-5"
                        >
                            + Add Column
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Kanban
