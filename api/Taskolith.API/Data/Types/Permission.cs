namespace Taskolith.API.Data.Types;

[Flags]
public enum Permission
{
    Public = 0,

    // Role Management
    CreateRole = 1 << 0,
    DeleteRole = 1 << 1,
    ChangeRole = 1 << 2,
    AddRole = 1 << 3,
    RemoveRole = 1 << 4,

    // Organisation Management
    DeleteOrganisation = 1 << 5,
    UpdateOrganisation = 1 << 6,

    // Member Management
    InviteMember = 1 << 7,
    KickMember = 1 << 8,
    
}