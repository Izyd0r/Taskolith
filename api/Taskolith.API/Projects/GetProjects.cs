using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Projects;

public class GetProjects : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .RequireAuthorization("GetAllProjects")
        .WithSummary("Gets all projects inside an organisation");

    private static async Task<IResult> Handle(
        Guid organisationId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        return Results.Ok(/*response*/);
    }
}