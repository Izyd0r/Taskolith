namespace Taskolith.API.OrganizationManagement.InviteSystem;

public record InviteMemberResponse(
    Guid InviteMemberId,
    string Email,
    Guid OrganisationId,
    DateTime DueDate,
    string Status
);