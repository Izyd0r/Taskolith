using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Projects;

public class GetAssignedProjects : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/me", Handle)
        .RequireAuthorization("Public")
        .WithSummary("Gets all projects that are assigned to me");

    private static async Task<IResult> Handle(
        Guid organisationId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        return Results.Ok(/*response*/);
    }
}