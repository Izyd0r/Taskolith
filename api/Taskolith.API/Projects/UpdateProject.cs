using System.Security.Claims;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Projects.Requests;

namespace Taskolith.API.Projects;

public class UpdateProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/{projectId:guid}", Handle)
        .WithRequestValidation<UpdateProjectRequest>()
        .RequireAuthorization("UpdateProject")
        .WithSummary("Updates a project");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        UpdateProjectRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        return Results.Ok(/*response*/);
    }
}