using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Projects;

public class RemoveFromProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{projectId:guid}/members/{memberId:guid}", Handle)
        .RequireAuthorization("RemoveFromProject")
        .WithSummary("Removes member from a project");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid memberId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        return Results.NoContent();
    }
}