using Taskolith.API.Data.Dtos;

namespace Taskolith.API.InviteSystem.Responses;

public record GetInvitesOrganisationResponse(
    List<InvitationDto> Invites
);