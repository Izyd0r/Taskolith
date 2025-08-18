using Taskolith.API.Data.Types;

namespace Taskolith.API.Roles.Requests;

public record CreateRoleRequest(
    string Name,
    Permission Permissions,
    ICollection<Guid>? MembersId = null 
);