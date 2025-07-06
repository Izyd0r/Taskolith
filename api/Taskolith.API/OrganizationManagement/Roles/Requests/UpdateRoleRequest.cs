using Taskolith.API.Data.Types;

namespace Taskolith.API.OrganizationManagement.Roles.Requests;

public record UpdateRoleRequest(
    string Name,
    Permission Permissions
);