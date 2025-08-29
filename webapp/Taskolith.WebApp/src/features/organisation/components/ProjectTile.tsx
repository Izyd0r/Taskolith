import React from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight, MoreVertical } from 'lucide-react'
import { Menu, MenuButton, MenuItems, MenuItem } from '@/components/ui/Menu'
import { type Project } from '@/features/organisation/types/Project'

type ProjectTileProps = {
    project: Project
    onEdit: () => void
    onDelete: () => void
    onManageMembers: () => void
    onGoToKanban: () => void
    canUpdate: boolean
    canDelete: boolean
    canManageMembers: boolean
}

const ActionItem = ({ children, onClick, isDestructive = false }: { children: React.ReactNode, onClick: () => void, isDestructive?: boolean }) => (
    <MenuItem onClick={onClick}>
        {({ active }) => (
            <span
                className={`block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                    active ? 'bg-gray-100' : ''
                } ${isDestructive ? 'text-red-700' : 'text-gray-700'}`}
            >
                {children}
            </span>
        )}
    </MenuItem>
)

export function ProjectTile({
    project,
    onEdit,
    onDelete,
    onManageMembers,
    onGoToKanban,
    canUpdate,
    canDelete,
    canManageMembers,
}: ProjectTileProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg">{project.projectName}</h3>
                <p className="text-gray-600 text-sm">{project.projectDescription}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {(canUpdate || canDelete || canManageMembers) && (
                    <Menu>
                        <MenuButton className="p-2 rounded-md hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4" />
                        </MenuButton>
                        <MenuItems className="origin-top-right right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1">
                                {canUpdate && <ActionItem onClick={onEdit}>Edit</ActionItem>}
                                {canManageMembers && <ActionItem onClick={onManageMembers}>Manage Members</ActionItem>}
                                {canDelete && <ActionItem onClick={onDelete} isDestructive>Delete</ActionItem>}
                            </div>
                        </MenuItems>
                    </Menu>
                )}

                <Button size="sm" variant="default" onClick={onGoToKanban}>
                    Kanban <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
