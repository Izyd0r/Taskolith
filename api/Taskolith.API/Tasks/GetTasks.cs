using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;

namespace Taskolith.API.Tasks.GetTasks;

public class GetTasks : IEndPoint
{
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Get all user tasks");

    static async Task<IResult> Handle(AppDbContext dbContext, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        /*
        var userId = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null) return Results.BadRequest();
        if (!Guid.TryParse(userId, out var parsedUserId))
            return Results.BadRequest("Invalid user ID.");
        
        var returnTasks = await dbContext.ToDoTasks
            .Where(t => t.UserId == parsedUserId)
            .ToListAsync(cancellationToken: cancellationToken);
        var response = new GetTasksResponse(Guid.Parse(userId), returnTasks);
        return Results.Ok(response);
        */
        return Results.Ok();
    }
}