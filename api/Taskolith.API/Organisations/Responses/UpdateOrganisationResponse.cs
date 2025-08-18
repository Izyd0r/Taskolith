namespace Taskolith.API.Organisations.Responses;

public record UpdateOrganisationResponse(
    Guid OrganisationId,
    string Name
);