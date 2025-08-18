using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.Members.Responses;

public record GetMemberRolesResponse(List<RoleDto> Roles = null!) {
    public GetMemberRolesResponse() : this(new List<RoleDto>()) { }
}