using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.Roles.Responses;

public record GetRolesResponse(ICollection<RoleDto> Roles = null!) {
  public GetRolesResponse() : this(new List<RoleDto>()) { }  
}