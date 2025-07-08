using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Projects;

public class DeleteProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{projectId:guid}", Handle)
        .RequireAuthorization("DeleteProject")
        .WithName("Deletes a project");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        return Results.NoContent();
    }
}