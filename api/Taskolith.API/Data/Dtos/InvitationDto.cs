namespace Taskolith.API.Data.Dtos;

public record InvitationDto(
    Guid Id,
    Guid OrganisationId, 
    String Status,
    DateTime DueDate,
    bool Expired,
    String InvitedUserEmail
);