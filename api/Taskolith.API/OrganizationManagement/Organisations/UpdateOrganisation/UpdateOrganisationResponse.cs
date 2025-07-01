namespace Taskolith.API.OrganizationManagement.Organisations.UpdateOrganisation;

public record UpdateOrganisationResponse(
    Guid OrganisationId,
    string Name
);