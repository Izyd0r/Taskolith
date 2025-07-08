namespace Taskolith.API.Data.Dtos;

public record MembershipDto(
    Guid MemberId,
    Guid UserId,
    Guid OrganisationId
);