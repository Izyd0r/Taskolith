using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Projects;

public class DeleteProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{projectId:guid}", Handle)
        .RequireAuthorization("DeleteProject")
        .WithSummary("Delete a project");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var project = await dbContext.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId && p.OrganisationId == organisationId, ct);
        if (project is null) return Results.NotFound();
        
        dbContext.Entry(project).State = EntityState.Deleted;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
}