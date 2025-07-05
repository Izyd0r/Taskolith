using System.Security.Claims;
using Taskolith.API.Common;

namespace Taskolith.API.OrganizationManagement.Roles;

public class GetRoles : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/{organisationId:guid}/roles", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Get all roles inside organisation");

    private static async Task<IResult> Handle(Guid organisationId) {
        return Results.Ok(/*response*/);
    }
}