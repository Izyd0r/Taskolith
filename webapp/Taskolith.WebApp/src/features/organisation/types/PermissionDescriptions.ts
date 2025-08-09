import { Permission } from '@/features/organisation/types/Permission'

export const PermissionDescriptions: Record<number, { title: string; description: string }> = {
    [Permission.CreateRole]: {
        title: 'Create Roles',
        description: 'Allows creating new roles within the organisation.'
    },
    [Permission.DeleteRole]: {
        title: 'Delete Roles',
        description: 'Allows deleting roles from the organisation.'
    },
    [Permission.UpdateRole]: {
        title: 'Edit Roles',
        description: 'Allows editing the name and permissions of roles.'
    },
    [Permission.AddRole]: {
        title: 'Assign Roles',
        description: 'Allows assigning roles to members.'
    },
    [Permission.RemoveRole]: {
        title: 'Remove Roles',
        description: 'Allows removing roles from members.'
    },
    [Permission.DeleteOrganisation]: {
        title: 'Delete Organisation',
        description: 'Allows permanently deleting the organisation.'
    },
    [Permission.UpdateOrganisation]: {
        title: 'Edit Organisation Settings',
        description: 'Allows changing the organisation’s name and settings.'
    },
    [Permission.InviteMember]: {
        title: 'Invite Members',
        description: 'Allows inviting new members to join the organisation.'
    },
    [Permission.KickMember]: {
        title: 'Kick Members',
        description: 'Allows removing members from the organisation.'
    },
    [Permission.CreateProject]: {
        title: 'Create Projects',
        description: 'Allows creating new projects.'
    },
    [Permission.UpdateProject]: {
        title: 'Edit Projects',
        description: 'Allows editing project details.'
    },
    [Permission.DeleteProject]: {
        title: 'Delete Projects',
        description: 'Allows deleting projects.'
    },
    [Permission.AssignProject]: {
        title: 'Assign Members to Projects',
        description: 'Allows assigning members to specific projects.'
    },
    [Permission.RemoveFromProject]: {
        title: 'Remove Members from Projects',
        description: 'Allows removing members from projects.'
    },
    [Permission.GetAllProjects]: {
        title: 'View All Projects',
        description: 'Allows viewing all projects in the organisation.'
    },
    [Permission.CreateKanbanColumn]: {
        title: 'Create Kanban Columns',
        description: 'Allows creating new columns in Kanban boards.'
    },
    [Permission.UpdateKanbanColumn]: {
        title: 'Edit Kanban Columns',
        description: 'Allows renaming or editing Kanban columns.'
    },
    [Permission.DeleteKanbanColumn]: {
        title: 'Delete Kanban Columns',
        description: 'Allows removing columns from Kanban boards.'
    },
    [Permission.CreateTask]: {
        title: 'Create Tasks',
        description: 'Allows creating new tasks.'
    },
    [Permission.UpdateTask]: {
        title: 'Edit Tasks',
        description: 'Allows editing existing tasks.'
    },
    [Permission.DeleteTask]: {
        title: 'Delete Tasks',
        description: 'Allows deleting tasks.'
    },
    [Permission.AssignTask]: {
        title: 'Assign Members to Tasks',
        description: 'Allows assigning members to tasks.'
    },
    [Permission.RemoveFromTask]: {
        title: 'Remove Members from Tasks',
        description: 'Allows removing members from tasks.'
    }
}
