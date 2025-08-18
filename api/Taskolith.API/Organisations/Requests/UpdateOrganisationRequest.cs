namespace Taskolith.API.Organisations.Requests;

public record UpdateOrganisationRequest(
    Guid OrganisationId, 
    string OrganisationName
);