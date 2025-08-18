namespace Taskolith.API.InviteSystem.Responses;

public record InviteMemberResponse(
    Guid InviteMemberId,
    string Email,
    Guid OrganisationId,
    DateTime DueDate,
    string Status
);