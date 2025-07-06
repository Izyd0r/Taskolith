using Taskolith.API.Data.Types;

namespace Taskolith.API.OrganizationManagement.Roles.Requests;

public record CreateRoleRequest(
    string Name,
    Permission Permissions,
    ICollection<Guid>? MembersId = null 
);