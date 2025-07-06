using Taskolith.API.Data.Types;

namespace Taskolith.API.OrganizationManagement.Roles.Responses;

public record GetRolesResponse(ICollection<RoleDto> Roles = null!) {
  public GetRolesResponse() : this(new List<RoleDto>()) { }  
}