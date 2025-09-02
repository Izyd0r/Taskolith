using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Projects;

public class RemoveFromProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{projectId:guid}/members/{memberId:guid}", Handle)
        .RequireAuthorization("RemoveFromProject")
        .WithSummary("Remove a member from a project");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid memberId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var project = await dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.Organisation.Id == organisationId, ct);
        if (project is null) return Results.NotFound();
        var memberToRemove = project?.Members.FirstOrDefault(m => m.Id == memberId);
        if (memberToRemove is null) return Results.NotFound();
       
        project.Members.Remove(memberToRemove);
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}
