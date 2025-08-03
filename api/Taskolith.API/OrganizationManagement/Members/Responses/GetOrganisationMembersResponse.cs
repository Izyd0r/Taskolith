using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Roles.Responses;
using Taskolith.API.Data.Dtos;

namespace Taskolith.API.OrganizationManagement.Members.Responses;

public record GetOrganisationMembersResponse(
    MembershipDto Member,
    ICollection<RoleDto> Roles
);
