namespace Taskolith.API.OrganizationManagement.InviteSystem.InviteMember;

public record InviteMemberRequest(
    string Email,
    DateTime DueDate
);