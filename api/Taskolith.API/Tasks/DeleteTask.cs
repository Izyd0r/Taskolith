using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Tasks;

public class DeleteTask : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{taskId:guid}", Handle)
        .RequireAuthorization("DeleteTask")
        .WithSummary("Delete a task");

    static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid kanbanColumnId,
        Guid taskId,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Results.BadRequest();
        
        var rowDeleted = await dbContext.ToDoTasks
            .Where(x => x.Id == taskId && x.KanbanColumnId == kanbanColumnId && x.ProjectId == projectId)
            .ExecuteDeleteAsync(ct);
    
        return rowDeleted == 1
            ? Results.NoContent()
            : Results.NotFound();
    }
}