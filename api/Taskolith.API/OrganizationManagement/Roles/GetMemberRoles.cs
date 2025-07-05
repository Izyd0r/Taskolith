using Taskolith.API.Common;

namespace Taskolith.API.OrganizationManagement.Roles;

public class GetMemberRoles : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{organisationId:guid}/members/{memberId:guid}/roles/", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Get member roles");

    private static async Task<IResult> Handle(Guid organisationId, Guid memberId) {
        return Results.Ok(/*response*/);
    }
}