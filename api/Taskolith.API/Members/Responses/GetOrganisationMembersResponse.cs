using Taskolith.API.Data.Dtos;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.Members.Responses;

public record GetOrganisationMembersResponse(
    MembershipDto Member,
    ICollection<RoleDto> Roles
);
