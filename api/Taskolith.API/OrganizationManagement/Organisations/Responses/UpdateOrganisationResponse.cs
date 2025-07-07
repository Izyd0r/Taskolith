namespace Taskolith.API.OrganizationManagement.Organisations.Responses;

public record UpdateOrganisationResponse(
    Guid OrganisationId,
    string Name
);