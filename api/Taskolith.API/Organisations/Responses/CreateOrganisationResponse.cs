namespace Taskolith.API.Organisations.Responses;

public record CreateOrganisationResponse(
    Guid OrganisationId,
    string Name
);