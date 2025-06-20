using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Tasks.DeleteTask;

public class DeleteTask : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/{taskId:guid}", Handle)
        .WithSummary("Deletes a task");

    static async Task<IResult> Handle(Guid taskId, AppDbContext db, ClaimsPrincipal claimsPrincipal ,CancellationToken cancellationToken)
    {
        var rowDeleted = await db.ToDoTasks
            .Where(x => x.Id == taskId)
            .ExecuteDeleteAsync(cancellationToken);
    
        return rowDeleted == 1
            ? Results.NoContent()
            : Results.NotFound();
    }
}