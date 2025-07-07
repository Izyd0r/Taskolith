using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.OrganizationManagement.Members.Responses;

public record GetOrganisationMembersResponse(
    Guid Id,
    Guid UserId,
    Guid OrganisationId,
    ICollection<RoleDto> Roles
);