using Taskolith.API.Data.Types;

namespace Taskolith.API.Roles.Requests;

public record UpdateRoleRequest(
    string Name,
    Permission Permissions
);