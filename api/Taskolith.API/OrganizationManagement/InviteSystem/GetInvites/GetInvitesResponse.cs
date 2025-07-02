using Taskolith.API.Data.Types;

namespace Taskolith.API.OrganizationManagement.InviteSystem.GetInvites;

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