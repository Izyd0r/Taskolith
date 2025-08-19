namespace Taskolith.API.InviteSystem.Responses;

public record InviteMemberResponse(
    Guid InviteId,
    string Email,
    Guid OrganisationId,
    DateTime DueDate,
    string Status
);