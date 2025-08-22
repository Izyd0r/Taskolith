using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.Projects;

public class GetProjects : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .RequireAuthorization("GetAllProjects")
        .WithSummary("Get all projects in an organisation");

    private static async Task<IResult> Handle(
        Guid organisationId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();

        var projects = await dbContext.Projects
            .Where(p => p.OrganisationId == organisationId)
            .Select(p => new GetProjectsResponse(p.Id, p.Name, p.Description ?? string.Empty))
            .ToListAsync(cancellationToken: ct);
        
        return Results.Ok(projects);
    }
}