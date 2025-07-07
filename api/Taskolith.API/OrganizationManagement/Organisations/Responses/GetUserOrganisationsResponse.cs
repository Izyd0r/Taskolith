namespace Taskolith.API.OrganizationManagement.Organisations.Responses;

public record GetUserOrganisationsResponse(
    Guid OrganisationId,
    string OrganisationName
);