namespace Taskolith.API.InviteSystem.Responses;

public record InvitationDto(
    Guid Id,
    Guid OrganisationId, 
    String Status,
    DateTime DueDate,
    bool Expired
);

public record GetInvitesResponse(
    List<InvitationDto> Invites
);