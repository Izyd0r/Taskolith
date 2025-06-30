namespace Taskolith.API.OrganizationManagement.Organisations.CreateOrganisation;

public record CreateOrganisationResponse(
    Guid OrganisationId,
    string Name
);