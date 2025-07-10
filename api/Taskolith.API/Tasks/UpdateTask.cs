using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Filters;

namespace Taskolith.API.Tasks.UpdateTask;

public class UpdateTask : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/", Handle)
        .WithSummary("Updates task")
        .WithRequestValidation<UpdateTaskRequest>();

    static async Task<IResult> Handle(UpdateTaskRequest request, AppDbContext db, ClaimsPrincipal user ,CancellationToken cancellationTokentoken)
    {
        var task = await db.ToDoTasks.SingleOrDefaultAsync(x => x.Id == request.TaskId, cancellationToken: cancellationTokentoken);
        if (task == null) return Results.BadRequest("No task found");
        
        if(request.Title is not null) task.Title = request.Title;
        if(request.Description is not null) task.Description = request.Description;
        if(request.DueDate.HasValue) task.DueDate = request.DueDate.Value;
        if(request.Completed is not null) task.IsCompleted = request.Completed.Value;
        
        await db.SaveChangesAsync(cancellationTokentoken);
        
        return Results.Ok();
    }
    
}