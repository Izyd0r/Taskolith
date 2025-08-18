namespace Taskolith.API.Organisations.Responses;

public record GetUserOrganisationsResponse(
    Guid OrganisationId,
    string OrganisationName
);