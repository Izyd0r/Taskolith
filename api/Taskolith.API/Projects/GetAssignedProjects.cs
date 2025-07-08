using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Projects.Responses;

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
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var projects = await dbContext.Projects
            .Where(p => p.OrganisationId == organisationId &&
                        p.Members.Any(m => m.UserId == Guid.Parse(userId)))
            .Select(p => new GetAssignedProjectsResponse(p.Id, p.Name, p.Description ?? string.Empty))
            .ToListAsync(cancellationToken: ct);
        
        return Results.Ok(projects);
    }
}