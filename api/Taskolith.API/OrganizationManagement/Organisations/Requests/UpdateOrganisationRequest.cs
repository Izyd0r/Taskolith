namespace Taskolith.API.OrganizationManagement.Organisations.Requests;

public record UpdateOrganisationRequest(
    Guid OrganisationId, 
    string OrganisationName
);