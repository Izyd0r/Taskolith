namespace Taskolith.API.OrganizationManagement.Roles.Responses;

public record GetMemberRolesResponse(List<RoleDto> Roles = null!) {
    public GetMemberRolesResponse() : this(new List<RoleDto>()) { }
}