namespace Taskolith.API.OrganizationManagement.Organisations.Responses;

public record CreateOrganisationResponse(
    Guid OrganisationId,
    string Name
);