using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Projects.Requests;

namespace Taskolith.API.Projects;

public class AssignProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/{projectId:guid}/members", Handle)
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
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var project = await dbContext.Projects.
            FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken: ct);
        if (project is null) return Results.NotFound();
        
        var members = await dbContext.OrganisationMembers
            .Where(m => request.MembersId.Contains(m.Id))
            .ToListAsync(cancellationToken: ct);
        
        dbContext.Entry(project).State = EntityState.Modified;
        foreach (var member in members) {
            project.Members.Add(member);
        }
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}