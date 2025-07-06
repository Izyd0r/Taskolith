using Taskolith.API.Data.Types;

namespace Taskolith.API.OrganizationManagement.Roles.Responses;

public record RoleDto(
    Guid Id,
    Guid OrganisationId,
    string Name,
    Permission Permissions
);