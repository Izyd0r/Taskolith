namespace Taskolith.API.OrganizationManagement.InviteSystem;

public record InviteMemberRequest(
    string Email,
    DateTime DueDate
);