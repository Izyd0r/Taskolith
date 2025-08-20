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
        var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Results.BadRequest();
        
        var project = await dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.OrganisationId == organisationId, cancellationToken: ct);
            
        if (project is null) return Results.NotFound();

        var membersToAssign = await dbContext.OrganisationMembers
            .Where(m => request.MembersId.Contains(m.Id) && m.OrganisationId == organisationId)
            .ToListAsync(cancellationToken: ct);
        
        foreach (var member in membersToAssign.Where(member => !project.Members.Contains(member))) {
            project.Members.Add(member);
        }

        await dbContext.SaveChangesAsync(ct);

        return Results.NoContent();
    }
}