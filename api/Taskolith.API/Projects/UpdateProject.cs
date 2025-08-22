using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Projects.Requests;
using Taskolith.API.Projects.Responses;

namespace Taskolith.API.Projects;

public class UpdateProject : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/{projectId:guid}", Handle)
        .WithRequestValidation<UpdateProjectRequest>()
        .RequireAuthorization("UpdateProject")
        .WithSummary("Update a project");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        UpdateProjectRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
    ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        
        var project = await dbContext.Projects
            .Where(p => p.OrganisationId == organisationId && p.Id == projectId)
            .FirstOrDefaultAsync(ct);
        if (project == null) return Results.NotFound();
        dbContext.Entry(project).State = EntityState.Modified;
        project.Name = request.Name;
        project.Description = request.Description;
        await dbContext.SaveChangesAsync(ct);
        
        return Results.Ok(new UpdateProjectResponse(project.Name, project.Description));
    }
}