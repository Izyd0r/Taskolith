using Taskolith.API.Data.Types;
using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.OrganizationManagement.Members.Requests;

public record AddMemberRoleRequest(
    Guid RoleId
);