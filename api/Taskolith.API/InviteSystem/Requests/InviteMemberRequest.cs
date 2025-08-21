using Taskolith.API.OrganizationManagement.Roles.Responses;

namespace Taskolith.API.InviteSystem.Requests;

public record InviteMemberRequest(
    string Email,
    DateTime DueDate,
    List<RoleDto>? InitialRoles = null
);