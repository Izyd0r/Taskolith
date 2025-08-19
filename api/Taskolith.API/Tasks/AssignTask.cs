using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Tasks.Requests;

namespace Taskolith.API.Tasks;

public class AssignTask : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/{taskId}/members", Handle)
        .RequireAuthorization("AssignTask")
        .WithRequestValidation<AssignTaskRequest>()
        .WithSummary("Assigns task to a member");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid taskId,
        AssignTaskRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();

        var task = await dbContext.ToDoTasks.FindAsync([taskId], ct);
        if (task is null) return Results.NotFound();

        dbContext.Entry(task).State = EntityState.Modified;
        var members = await dbContext.OrganisationMembers
            .Where(o => o.OrganisationId == organisationId && request.MemberIds.Contains(o.Id))
            .ToListAsync(ct);
        foreach (var membership in members) {
            if (task.AssignedMembers.All(m => m.Id != membership.Id)) task.AssignedMembers.Add(membership);
        }
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    } 
}