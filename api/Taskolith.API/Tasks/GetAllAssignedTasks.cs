using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Taskolith.API.Common;
using Taskolith.API.Data;
using Taskolith.API.Data.Dtos;
using Taskolith.API.Tasks.Responses;

namespace Taskolith.API.Tasks;

public class GetAllAssignedTasks : IEndPoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("", Handle)
        .WithSummary("Get all tasks assigned to the current user");
    private static async Task<IResult> Handle(AppDbContext db, ClaimsPrincipal claims, CancellationToken ct) {
        var userId = claims.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if(userId is null) return Results.BadRequest();

        var tasks = await db.ToDoTasks
            .Include(t => t.Project)
            .ThenInclude(p => p.Organisation)
            .Where(t => t.AssignedMembers.Any(m => m.UserId == Guid.Parse(userId)))
            .Select(t => new TaskDtoWithOrganisation(
                new TaskDtoCore(
                    t.Id,
                    t.Title,
                    t.Description, 
                    t.DueDate,
                    t.CreatedDate,
                    t.Priority
                ),
                t.Project!.Organisation!.Id,
                t.Project.Organisation.Name
            ))
            .ToListAsync(ct);
        
        return Results.Ok(new GetAssignedTasksResponse(tasks));
    }
}