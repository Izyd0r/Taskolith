using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Projects.Requests;

namespace Taskolith.API.Projects;

public class AssignProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/{projectId:guid}", Handle)
        .WithRequestValidation<AssignProjectRequest>()
        .RequireAuthorization("AssignProject")
        .WithSummary("Assigns member to a project");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        AssignProjectRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        return Results.Ok(/*response*/);
    }
}