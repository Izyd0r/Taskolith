namespace Taskolith.API.OrganizationManagement.Organisations;

public record CreateOrganisationResponse(
    Guid OrganisationId,
    string Name
);