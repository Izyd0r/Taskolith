namespace Taskolith.API.OrganizationManagement.Organisations.UpdateOrganisation;

public record UpdateOrganisationRequest(
    Guid OrganisationId, 
    string OrganisationName
);