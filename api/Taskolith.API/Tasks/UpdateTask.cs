using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;
using Taskolith.API.Tasks.Requests;

namespace Taskolith.API.Tasks.UpdateTask;

public class UpdateTask : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/{taskId:guid}", Handle)
        .WithSummary("Updates a task")
        .RequireAuthorization("UpdateTask")
        .WithRequestValidation<UpdateTaskRequest>();

    static async Task<IResult> Handle(
        Guid organisationId,
        Guid projectId,
        Guid kanbanColumnId,
        Guid taskId,
        UpdateTaskRequest request,
        AppDbContext dbContext,
        ClaimsPrincipal claims,
        CancellationToken ct
        ) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Results.BadRequest();
        
        var task = await dbContext.ToDoTasks.FirstOrDefaultAsync(x => x.Id == taskId, cancellationToken: ct);
        if (task is null) return Results.NotFound("No task found");
        
        dbContext.Entry(task).State = EntityState.Modified;
        task.Title = request.Title ?? task.Title;
        task.Description = request.Description ?? task.Description;
        if (request.DueDate.HasValue)
            task.DueDate = request.DueDate.Value.ToUniversalTime();
        task.Priority = request.Priority ?? task.Priority;
        task.IsCompleted = request.IsCompleted ?? task.IsCompleted;
        task.KanbanColumnId = request.KanbanColumnId ?? task.KanbanColumnId;
        task.Order = request.Order ?? task.Order;
        
        await dbContext.SaveChangesAsync(ct);
        
        return Results.NoContent();
    }
    
}