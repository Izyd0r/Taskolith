export const Permission = {
    Public: 0,

    // Role Management
    CreateRole: 1 << 0,
    DeleteRole: 1 << 1,
    UpdateRole: 1 << 2,
    AddRole: 1 << 3,
    RemoveRole: 1 << 4,

    // Organisation Management
    DeleteOrganisation: 1 << 5,
    UpdateOrganisation: 1 << 6,

    // Member Management
    InviteMember: 1 << 7,
    KickMember: 1 << 8,

    // Project Management
    CreateProject: 1 << 9,
    UpdateProject: 1 << 10,
    DeleteProject: 1 << 11,
    AssignProject: 1 << 12,
    RemoveFromProject: 1 << 13,
    GetAllProjects: 1 << 14,

    // Kanban Management
    CreateKanbanColumn: 1 << 15,
    UpdateKanbanColumn: 1 << 16,
    DeleteKanbanColumn: 1 << 17,

    // Task Management
    CreateTask: 1 << 18,
    UpdateTask: 1 << 19,
    DeleteTask: 1 << 20,
    AssignTask: 1 << 21,
    RemoveFromTask: 1 << 22,
} as const

type PermissionValues = typeof Permission[keyof typeof Permission]
export type TPermission = PermissionValues
