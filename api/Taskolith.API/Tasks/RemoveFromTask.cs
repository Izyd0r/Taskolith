using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Tasks;

public class RemoveFromTask : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{taskId}/members/{memberId:guid}", Handle)
        .RequireAuthorization("RemoveFromTask")
        .WithSummary("Remove a member from a task");

    private static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid taskId,
        Guid memberId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var task = await dbContext.ToDoTasks
            .Include(t => t.AssignedMembers)
            .FirstOrDefaultAsync(t=>t.Id == taskId, ct);
        if (task is null) return Results.NotFound();

        var memberToRemove = await dbContext.OrganisationMembers
            .FirstOrDefaultAsync(o => o.OrganisationId == organisationId && memberId == o.Id, ct);

        if (memberToRemove is null)
            return Results.NotFound("Member not found.");

        var existing = task.AssignedMembers.FirstOrDefault(m => m.Id == memberToRemove.Id);

        if (existing is null)
            return Results.BadRequest("Member is not assigned to this task.");

        task.AssignedMembers.Remove(existing);

        await dbContext.SaveChangesAsync(ct);
       
        
        return Results.NoContent();
    }
}